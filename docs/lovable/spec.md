# qs4me — Lovable build spec

> Hand this whole document to Lovable as your build brief. It supersedes `docs/lovable-start-prompt.md` for the scrolling, recommendations, hints, taxonomy, and seed sections.

Companion docs:
- `docs/lovable/recommendations.md` — deep dive on the `feed_next` rerank
- `question-taxonomy/exports/lovable/` — categories, playlists, questions, `seed.sql`

---

## 0. Product in one paragraph

`qs4me` is a mobile-first question practice app. The user opens it, sees one question on the whole screen, mentally retrieves answers, and taps a counter (`0 / N`). Public social content is **questions only**. Answers stay in the user's head — we store metrics, not answer text. Stack: **React + TypeScript + Vite + Tailwind + shadcn/ui + lucide + Supabase / Lovable Cloud**. RU-first. **No info blocks. No article portal. No marketing landing.** First load = the app.

---

## 1. Scrollable feed

### 1.1 Behavior

- **Vertical snap feed.** One question = one full screen (`100dvh` on mobile, centered column `max-w-[480px]` on desktop, page background extends edge-to-edge).
- CSS:
  ```css
  .feed { scroll-snap-type: y mandatory; overflow-y: scroll; height: 100dvh; }
  .card { scroll-snap-align: start; scroll-snap-stop: always; min-height: 100dvh; }
  ```
- Gestures: swipe up/down on touch; mouse wheel, `↑/↓`, `PgUp/PgDn`, `Space`/`Shift+Space` on desktop.
- Snap must always stop on the next card — no inertial through-scroll.
- Infinite load: `IntersectionObserver` on the second-to-last rendered card → fetch the next batch (10–20 IDs) via `supabase.rpc('feed_next', …)`.
- Keep at most 30 cards mounted (window: `[index-5 … index+25]`); recycle older ones to keep memory steady.
- **No info blocks** in the feed. **No ads.** **No “card of the day”** banner inside the feed (that lives on `/library`).

### 1.2 `<QuestionCard>` anatomy (top → bottom)

1. **Top chips** — thin row, 12px text, click → filter:
   - category pill (`📚 Память`, color from `categories.color`)
   - complexity pill (`Рабочий` / `Развивающий` / `Продвинутый`)
   - optional `team_safe` / `onboarding_safe` micro-pill
2. **Question body** — 24–32px, `text-balance`, vertically centered in ~50% of the card. The hero.
3. **Hint slot** — collapsed by default (see §3). When open: 14px, muted color, under the body.
4. **Counter block**:
   - big `0 / N` (40–56px, tabular numerals)
   - `−` and `+` round buttons, ≥ 56×56px, `+` is the dominant control
   - thin progress bar
   - on `found_count ≥ target_count` → soft check state, `+ ещё` micro-button (allow continuing past N), and a primary `Дальше` that programmatically snaps to the next card
5. **Action bar** — floating bottom row, 4 lucide icons: `bookmark`, `git-branch` (tree), `flag` (report), `more`. **No share, no comment surface in the feed itself.**
6. **Hint pill** — tiny `💡` button on the left of the question body. Tap = open hint slot. Pulses gently if the user has been idle ≥ 30s with `inc_count < 2`.

### 1.3 Card states

| State | Trigger | Visual |
|---|---|---|
| `idle` | mounted, counter 0 | neutral |
| `counting` | first `+` tap | `Готово` button becomes primary |
| `completed` | `found_count ≥ target_count` | mute + check, `+ ещё` and `Дальше` appear |
| `skipped` | swipe-away with `found_count < target_count` | nothing visual, but `feed_event` is emitted |
| `loading` / `error` / `empty` | feed RPC | skeleton / retry / "пусто, попробуй другие фильтры" |

### 1.4 Guest mode

- Counter works locally via `localStorage` (`anon_id` cookie/uuid). Only `approved` + `moderation_state='ok'` + `visibility='public'` questions.
- No streak, no stats, no history sync.
- Soft nudge `Сохрани прогресс` after the **8th** card. Non-blocking, dismissable for the session.

### 1.5 Telemetry — `feed_event`

On every card unmount **and** on completion, the client batches and POSTs (`supabase.from('feed_events').insert([...])`):

```ts
type FeedEvent = {
  question_id: uuid
  user_id: uuid | null      // null for guests
  anon_id: string | null    // from localStorage
  dwell_ms: number
  direction: 'up' | 'down' | 'completed' | 'unmount'
  inc_count: number
  dec_count: number
  bookmarked: boolean
  reported: boolean
  tree_opened: boolean
  hint_opened: boolean
  final_state: 'viewed' | 'counting' | 'completed' | 'skipped'
  source: 'feed' | 'session' | 'category' | 'playlist' | 'search' | 'tree'
  created_at: timestamptz
}
```

Batches flush every 5s or on `visibilitychange=hidden`.

### 1.6 Files (frontend)

```
src/components/feed/FeedView.tsx
src/components/feed/QuestionCard.tsx
src/components/feed/PracticeCounter.tsx
src/components/feed/HintSlot.tsx
src/components/feed/ActionBar.tsx
src/hooks/useFeed.ts
src/hooks/useFeedEvents.ts
src/lib/supabase.ts
```

---

## 2. Recommendations

The full formula and SQL live in `docs/lovable/recommendations.md`. Summary:

- **Two-stage:** candidate generation (~150 IDs) → rule-based ranking → MMR-lite diversification → anti-fatigue cap.
- **Hard filters:** language, `status='approved'`, `moderation_state='ok'`, `visibility='public'`, not seen in last 7 days, not authored-by-blocked, not reported-by-me.
- **Mix:** 60% top score in active categories, 20% exploration, 10% featured, 10% bookmarked-tree neighbours.
- **Score (MVP, rule-based):**
  ```
  score = 0.40·category_affinity + 0.20·playlist_affinity
        + 0.15·complexity_match + 0.10·editorial_quality
        + 0.10·time_of_day_match + 0.05·novelty_decay
        − 0.30·just_completed_penalty
        − 0.50·reported_neighbour_penalty
  ```
- **Cold start (`practice_runs<5`):** drop to `editorial_quality + onboarding_safe·0.5 + diversity_bonus`.
- **Diversification:** at most 3 of any single `category_slug` or `primary_class` in any 10 consecutive cards. No 4 consecutive `target_count ≥ 10` cards.
- **Where it runs:** Postgres RPC `feed_next(p_user uuid, p_limit int, p_filters jsonb)` in Supabase. No separate backend. No ML on MVP.

User-visible filters (top sheet, `Filter` icon):
- category(ies), playlist, complexity range, target_count range, `team_safe` only.

Random mode (`Шафл` icon): bypasses ranking, uses uniform sample with the hard filters.

---

## 3. Hints

Hints **never** answer the question. Three types:

### 3.1 Synonym (reformulation)

- Source: `questions.synonyms[]` (already populated for all seed questions).
- UI: `↻ Иначе` icon next to the question. Cycles through synonyms; doesn't write back.

### 3.2 Constraint seeds

- Source: `questions.hint_seeds_ru[]` — 2–4 short stem-words. Example for «10 событий вчерашнего дня»: `["до обеда", "разговор", "что-то новое", "место, где ты был"]`.
- UI: tap `💡 Подсказка` → `HintSlot` opens with seeds as non-clickable pills.
- Auto-pulse: idle ≥ 30s and `inc_count < 2`. Never auto-open.

### 3.3 Frame hint (reframe)

- Source: `questions.frame_hint_ru` — single sentence, sets the angle, doesn't list answers. Example: «Считай не громкие события, а маленькие переключения внимания.»
- UI: bottom of `HintSlot`, prefixed «Если не получается:».

### 3.4 Visibility rules

| Trigger | Shown |
|---|---|
| `↻ Иначе` tap | rotate body to next synonym |
| `💡` tap | open hint slot (seeds + frame) |
| idle 30s + `inc<2` | pulse the `💡` (don't auto-open) |
| `practice_runs.count_for_user < 5` | frame_hint shown by default, mutable |

### 3.5 Forbidden

- No example answers. No “что считать”. No AI rewriting in the card. No tutorial overlays per card.

---

## 4. Data model (Supabase)

> Use UUID primary keys. Apply RLS to every table. Server-side only for AI calls. No service-role keys in the client.

### 4.1 `categories`
```sql
slug             text primary key
name_ru          text not null
name_en          text not null
description_ru   text
description_en   text
color            text
icon             text
sort             int default 0
is_system        boolean default true
created_at       timestamptz default now()
```
Seed: `question-taxonomy/exports/lovable/categories.json` (15 rows).

### 4.2 `playlists`
```sql
slug             text primary key
category_slug    text references categories(slug)
name_ru          text not null
name_en          text not null
description_ru   text
description_en   text
visibility       text default 'public'
is_system        boolean default true
owner_id         uuid references auth.users(id)  -- null for system
created_at       timestamptz default now()
```
Seed: `question-taxonomy/exports/lovable/playlists.json` (17 rows).

### 4.3 `questions`
```sql
id                  uuid primary key default gen_random_uuid()
public_id           text unique                  -- qtx-0001 etc.
body                text not null
target_count        int  not null default 5
body_locale         text default 'ru'
language_hint       text default 'ru'
source              text default 'seed'          -- seed | user | ai
visibility          text default 'public'        -- public | private
moderation_state    text default 'ok'            -- ok | hidden | review
status              text default 'approved'      -- draft | approved | archived
category_slug       text references categories(slug)
playlist_slugs      jsonb default '[]'::jsonb    -- text[]
parent_id           uuid references questions(id)
author_id           uuid references auth.users(id)
synonyms            jsonb default '[]'::jsonb
hint_seeds_ru       jsonb default '[]'::jsonb
frame_hint_ru       text
taxonomy            jsonb default '{}'::jsonb    -- see 4.7
editorial_flags     jsonb default '[]'::jsonb
editor_note         text
is_featured         boolean default false
card_of_day_weight  int default 0
onboarding_safe     boolean default false
team_safe           boolean default false
search_index_text_ru text
depth_score         numeric default 0
direct_children_count int default 0
descendants_count   int default 0
created_at          timestamptz default now()
updated_at          timestamptz default now()
```

Indexes:
- `idx_questions_status_visibility (status, moderation_state, visibility)`
- `idx_questions_category (category_slug)`
- `idx_questions_featured (is_featured) where is_featured`
- `idx_questions_onboarding (onboarding_safe) where onboarding_safe`
- gin: `idx_questions_playlist_slugs (playlist_slugs jsonb_path_ops)`
- gin: `idx_questions_taxonomy (taxonomy jsonb_path_ops)`

### 4.4 `practice_runs`, `bookmarks`, `feed_events`, `depth_ratings`, `comments`, `reports`, `subscriptions`, `session_templates`, `session_runs`, `session_run_events`, `reminders`, `notifications`, `ai_generations`, `profiles`

Use the schemas in `docs/lovable-start-prompt.md` §Data model. The only additions:

- `feed_events` (see §1.5 above) — new table.
- `practice_runs.private_note text` stays nullable; never displayed publicly.

### 4.5 RLS

Mandatory:

- `questions`: public select where `status='approved' AND moderation_state='ok' AND visibility='public'`. Owner full CRUD on own rows. Moderator/admin override via `profiles.role`.
- `bookmarks`, `practice_runs`, `feed_events`, `reminders`, `notifications`, `ai_generations`, `session_runs`: only the owner.
- `comments`: public select for `moderation_state='ok'`; insert/update/delete only the owner; mods override.
- `reports`: insert by any authenticated user, select by reporter or moderator.
- Never trust frontend role checks.

### 4.6 `target_count` extraction

Run once at seed time and on every `INSERT/UPDATE`:

```ts
function extractTargetCount(body: string): number {
  const m = body.match(/^\s*(\d{1,3})/);
  let t = m ? parseInt(m[1], 10) : null;
  if (!t) {
    const m2 = body.match(/\b(\d{1,2})\b/);
    t = m2 ? parseInt(m2[1], 10) : 5;
  }
  if (t < 1 || t > 100) t = 5;
  return t;
}
```

Mirror in SQL trigger:

```sql
create or replace function set_target_count() returns trigger as $$
declare m text;
begin
  m := substring(new.body from '^\s*([0-9]{1,3})');
  if m is null then
    m := substring(new.body from '\m([0-9]{1,2})\M');
  end if;
  new.target_count := coalesce(nullif(m,'')::int, 5);
  if new.target_count < 1 or new.target_count > 100 then
    new.target_count := 5;
  end if;
  return new;
end $$ language plpgsql;

create trigger trg_questions_target_count
before insert or update of body on questions
for each row execute function set_target_count();
```

### 4.7 `taxonomy` jsonb facets

```jsonc
{
  "primary_class":      "retrieval | descriptive | classifying | generative | clarifying | analytical | evaluative | projecting | reflexive | meta_generative",
  "purpose":            ["diagnostic","development","research","design","reflection","communication","learning","creative"],
  "domains":            ["memory","work","learning","project","creativity","relationships","children","self_development","thinking","philosophy","team","speech","emotions","everyday_practice"],
  "answer_form":        "list | description | classification | comparison | evaluation | idea | plan | self_analysis | yes_no | choice | scale",
  "openness":           "closed | semi_open | open | radically_open",
  "complexity":         "basic | working | developmental | advanced | limit",
  "modes":              ["individual","pair","group","lesson","meeting","card_of_day","deep_session","journal"],
  "time_focus":         "past | present | future | timeless | past_to_present | present_to_future",
  "subject_direction":  "self | other | pair | group | system | circular",
  "abstraction_level":  "concrete | situational | conceptual | meta | philosophical",
  "generativity_score": 1
}
```

`editorial_flags` is a separate top-level jsonb array: `practice_ready, high_generativity, counterintuitive, meta, team_safe, child_friendly, deep_work, onboarding_safe`.

---

## 5. Routes

```
/             → /feed (default authenticated landing)
/auth         → sign in / sign up
/feed         → snap feed
/library      → categories grid + playlists
/library/categories/:slug
/library/playlists/:slug
/sessions
/sessions/:id/run
/questions/:id              → detail + embedded counter
/questions/:id/tree
/questions/new
/saved
/stats
/u/:username
/me
/settings
/notifications
/admin/moderation
```

Bottom nav (mobile): `Поток` / `Библиотека` / `Я`.

---

## 6. Seed import

Files in `question-taxonomy/exports/lovable/`:

- `categories.json` — 15 rows
- `playlists.json` — 17 rows
- `questions.v2.json` — 1500 rows (full schema)
- `questions.v2.csv` — same data, comma-separated, for human review
- `seed.sql` — idempotent INSERTs (`ON CONFLICT (slug|public_id) DO NOTHING`)

Two import paths (pick one):

**A. SQL editor (fastest):** open Supabase → SQL editor → paste contents of `seed.sql` → Run. Verify: `select count(*) from questions;` → 1500.

**B. Edge Function:** upload `questions.v2.json` to a Storage bucket; deploy `supabase/functions/import-seed/index.ts` (provided in the README); invoke once.

After import, the feed RPC and the UI should immediately work end-to-end. The 144 originally-curated questions are part of the 1500 (preserved `public_id` `qtx-0001..qtx-0144`); the rest are `qtx-0145..qtx-1500`.

---

## 7. Acceptance checklist

- Guest opens `/`, sees a question, taps `+`/`−`, completes, swipes to next — works locally.
- Sign-up persists profile. `/me` shows stats.
- Snap feed: one card per screen, no info blocks, infinite load via `feed_next`.
- Recommendations: same category never appears more than 3× in any 10 consecutive cards. Reported items disappear from the user's feed within 1 swipe.
- Hints: `↻ Иначе` cycles through synonyms; `💡` opens seeds + frame; first-5-runs users see frame_hint by default.
- `target_count` extraction: spot-check 20 questions in the DB — every numeric prefix is correctly parsed.
- Counter records `practice_runs` (logged-in) with `found_count`, `target_count`, `completed`, `duration_seconds`. **Never** records answer text.
- Tree view from `/questions/:id/tree` shows parent/children/descendants.
- Library grid lists all 15 categories with the right colors/icons/counts.
- Comments are framed as meta-comments, not answer threads.
- Moderator queue at `/admin/moderation` hides/restores questions and comments.
- All AI calls (if any) are server-side only. No secret keys in the client bundle.
- 0 info blocks. 0 marketing landing pages. First-load surface is the feed.
