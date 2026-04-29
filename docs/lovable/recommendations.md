# qs4me — feed recommendations deep dive

Companion to `docs/lovable/spec.md` §2. Defines the SQL/RPC implementation of `feed_next` and the signal aggregation that feeds it. MVP-scoped: rule-based, single-Postgres, no ML, no Redis, no separate service.

---

## 1. Goals & non-goals

**Goals**

- Pick a *fitting* next question, not a *viral* one.
- Avoid showing the same thing twice within a week.
- Mix mastered and new categories.
- Keep latency ≤ 60ms p95 for `feed_next`.
- Be cheap: one RPC call per batch of 10–20 cards.

**Non-goals**

- Personalised embeddings.
- Multi-armed bandit / Thompson sampling.
- Cross-user collaborative filtering.

We can layer those later behind the same RPC contract.

---

## 2. Signals

Stored in two places:

### 2.1 Raw event tables

- `feed_events` — every card unmount or completion (see spec §1.5).
- `practice_runs` — completed counter sessions.
- `bookmarks` — user-saved questions.
- `depth_ratings` — 1–5 depth/usefulness rating.
- `reports` — content reports (hard signal).

### 2.2 Aggregates: `user_signals`

Materialized aggregate keyed by `(user_id, dimension, value)`. Updated by triggers on the raw tables.

```sql
create table user_signals (
  user_id        uuid not null,
  dimension      text not null,         -- 'category' | 'playlist' | 'primary_class' | 'complexity' | 'answer_form'
  value          text not null,
  positive_score numeric default 0,     -- EWMA, decays toward 0
  negative_score numeric default 0,
  shown_count    int default 0,
  completed_count int default 0,
  last_event_at  timestamptz,
  primary key (user_id, dimension, value)
);
```

**EWMA update on a new event:**

```sql
-- on a positive event (bookmarked, completed, dwell > median, depth_rating >= 4)
update user_signals
set positive_score = positive_score * 0.95 + 1.0,
    shown_count = shown_count + 1,
    completed_count = completed_count + (case when v_completed then 1 else 0 end),
    last_event_at = now()
where ...;
```

Decay factor `0.95` is roughly a half-life of ~14 events. Tune if needed.

**Negative events:** `dwell_ms < 2000 and inc_count = 0`, reported, repeatedly skipped.

---

## 3. `feed_next` RPC

```sql
create or replace function feed_next(
  p_user uuid,
  p_limit int default 20,
  p_filters jsonb default '{}'::jsonb
) returns table (
  question_id uuid,
  rank_score numeric,
  reason text
) language plpgsql security invoker as $$
declare
  v_anon boolean := p_user is null;
  v_runs int := 0;
begin
  if not v_anon then
    select count(*) into v_runs from practice_runs where user_id = p_user;
  end if;

  return query
  with
  -- 3.1 hard filter ----------------------------------------------------
  pool as (
    select q.*
    from questions q
    where q.status = 'approved'
      and q.moderation_state = 'ok'
      and q.visibility = 'public'
      and q.body_locale = coalesce(p_filters->>'locale', 'ru')
      -- explicit user filters
      and (p_filters->'category_slugs' is null
           or q.category_slug = any(
                array(select jsonb_array_elements_text(p_filters->'category_slugs'))
              ))
      and (p_filters->'playlist_slugs' is null
           or q.playlist_slugs ?| array(
                select jsonb_array_elements_text(p_filters->'playlist_slugs')
              ))
      and (p_filters->>'team_safe' is null or q.team_safe = (p_filters->>'team_safe')::bool)
      and (p_filters->>'min_target' is null or q.target_count >= (p_filters->>'min_target')::int)
      and (p_filters->>'max_target' is null or q.target_count <= (p_filters->>'max_target')::int)
      -- not seen recently
      and (v_anon or not exists (
        select 1 from feed_events fe
        where fe.user_id = p_user
          and fe.question_id = q.id
          and fe.created_at > now() - interval '7 days'
      ))
      -- not reported by me
      and (v_anon or not exists (
        select 1 from reports r
        where r.reporter_id = p_user
          and r.target_type = 'question'
          and r.target_id = q.id
      ))
      -- onboarding gate: first 20 runs see only safe content
      and (v_runs >= 20 or v_anon or q.onboarding_safe = true)
  ),
  -- 3.2 score ----------------------------------------------------------
  scored as (
    select
      p.*,
      -- editorial quality (cold-start friendly)
      (case when p.is_featured then 0.5 else 0 end
        + case when p.editorial_flags ? 'practice_ready' then 0.3 else 0 end
        + case when p.editorial_flags ? 'high_generativity' then 0.2 else 0 end
      ) as q_editorial,

      -- category affinity (EWMA-derived; null-safe)
      coalesce(
        (select positive_score - 0.5 * negative_score
           from user_signals us
          where us.user_id = p_user
            and us.dimension = 'category'
            and us.value = p.category_slug)
        / nullif((select greatest(max(positive_score), 1)
                    from user_signals
                   where user_id = p_user and dimension = 'category'), 0),
      0)::numeric as q_category,

      -- complexity match (prefer one step above current skill)
      coalesce(
        (select 1.0 - abs(
           array_position(array['basic','working','developmental','advanced','limit'],
                          (p.taxonomy->>'complexity'))::int
           - (select percentile_cont(0.5) within group (order by
                array_position(array['basic','working','developmental','advanced','limit'],
                               (q2.taxonomy->>'complexity')))::int
                from questions q2
                join practice_runs pr on pr.question_id = q2.id
                where pr.user_id = p_user and pr.completed)
         ) / 4.0),
      0.5)::numeric as q_complexity,

      -- time of day match
      (case
         when extract(hour from now() at time zone 'Europe/Moscow') between 6 and 11
              and p.category_slug = 'morning' then 1.0
         when extract(hour from now() at time zone 'Europe/Moscow') between 21 and 23
              and p.category_slug in ('reflection','memory') then 0.7
         else 0.0
       end) as q_time,

      -- novelty bonus (never-shown gets a small boost)
      (case when not exists (
         select 1 from feed_events fe
         where fe.user_id = p_user and fe.question_id = p.id
       ) then 0.2 else 0.0 end) as q_novelty,

      -- penalties
      (case when exists (
         select 1 from practice_runs pr
         where pr.user_id = p_user and pr.question_id = p.id
           and pr.completed and pr.created_at > now() - interval '14 days'
       ) then 0.3 else 0.0 end) as p_just_completed
    from pool p
  ),
  ranked as (
    select
      s.*,
      ( 0.40 * coalesce(q_category, 0)
      + 0.15 * coalesce(q_complexity, 0)
      + 0.10 * q_editorial
      + 0.10 * q_time
      + 0.05 * q_novelty
      - 0.30 * p_just_completed
      + (random() * 0.05)        -- tiny tie-break jitter
      ) as score
    from scored s
  )
  -- 3.3 candidate mix + diversification done in app code below
  select id as question_id, score as rank_score, 'mvp_v1' as reason
  from ranked
  order by score desc
  limit p_limit * 4;        -- over-fetch, then diversify below
end $$;
```

The RPC over-fetches by 4×; the **diversifier** runs in plpgsql or in a thin TS wrapper:

```ts
// supabase/functions/feed_next/index.ts (optional wrapper)
export function diversify(rows: Candidate[], limit: number) {
  const out: Candidate[] = []
  const recentCats: string[] = []   // last 10 cats
  const recentClass: string[] = []
  const targetWindow: number[] = [] // last 4 target_counts

  for (const r of rows) {
    const catCount = recentCats.slice(-10).filter(c => c === r.category_slug).length
    const classCount = recentClass.slice(-10).filter(c => c === r.primary_class).length
    const heavyStreak = targetWindow.slice(-3).every(t => t >= 10)
    if (catCount >= 3) continue
    if (classCount >= 3) continue
    if (heavyStreak && r.target_count >= 10) continue
    out.push(r)
    recentCats.push(r.category_slug)
    recentClass.push(r.primary_class)
    targetWindow.push(r.target_count)
    if (out.length >= limit) break
  }
  return out
}
```

If you prefer no Edge Function, do the diversifier as a recursive CTE over `ranked` — slightly uglier SQL, same result.

---

## 4. Triggers feeding `user_signals`

```sql
create or replace function on_feed_event() returns trigger as $$
declare
  v_q questions%rowtype;
  v_pos boolean;
  v_neg boolean;
begin
  select * into v_q from questions where id = new.question_id;
  v_pos := (new.bookmarked or new.final_state = 'completed' or new.dwell_ms > 12000);
  v_neg := (new.final_state = 'skipped' and new.dwell_ms < 2000 and new.inc_count = 0);

  insert into user_signals (user_id, dimension, value, shown_count, last_event_at)
  values (new.user_id, 'category', v_q.category_slug, 1, now())
  on conflict (user_id, dimension, value) do update
    set shown_count = user_signals.shown_count + 1,
        positive_score = user_signals.positive_score * 0.95 + (case when v_pos then 1.0 else 0 end),
        negative_score = user_signals.negative_score * 0.95 + (case when v_neg then 1.0 else 0 end),
        last_event_at = now();

  -- repeat for primary_class, complexity, answer_form
  return new;
end $$ language plpgsql;

create trigger trg_feed_event_signals
after insert on feed_events
for each row when (new.user_id is not null)
execute function on_feed_event();
```

---

## 5. Cold start

For users with `practice_runs.count < 5` **or** anonymous:

- skip `q_category`, `q_complexity` (not enough data)
- score = `0.5·q_editorial + 0.3·onboarding_safe + 0.2·diversity_bonus + 0.1·random()`
- diversifier still runs.

---

## 6. Random / Shuffle mode

Bypass everything except hard filters:

```sql
create or replace function feed_random(
  p_user uuid,
  p_limit int default 20,
  p_filters jsonb default '{}'::jsonb
) returns table (question_id uuid) language sql as $$
  select id from questions
  where status='approved' and moderation_state='ok' and visibility='public'
    and (p_filters->'category_slugs' is null or category_slug = any(
          array(select jsonb_array_elements_text(p_filters->'category_slugs'))))
  order by random()
  limit p_limit;
$$;
```

---

## 7. Future hooks

When MVP is stable, you can layer:

- **pgvector** — embed `body || synonyms` in OpenAI-free local model; rerank with cosine distance to bookmarked centroid.
- **Bandits** — replace flat weights with `Thompson sampling` per dimension.
- **Cross-user CF** — only after you have ≥ 1k DAU and a privacy review.

The RPC contract (`feed_next(user, limit, filters) → (question_id, score, reason)`) does not change.

---

## 8. Verification

```sql
-- 1. recommend a feed for a fresh user
select * from feed_next(null, 20, '{}'::jsonb);

-- 2. no category appears more than 3× in any 10 consecutive
with feed as (
  select q.category_slug, row_number() over () as rn
  from feed_next('00000000-0000-0000-0000-000000000000', 100, '{}'::jsonb) f
  join questions q on q.id = f.question_id
)
select max(c) as max_cat_per_10 from (
  select count(*) c from feed
  group by category_slug, (rn / 10)
) s;
-- expected: <= 3

-- 3. seen items don't repeat within 7 days
-- (insert feed_event for q1, then call feed_next; q1 must be absent)
```
