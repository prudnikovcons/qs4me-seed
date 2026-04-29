# qs4.me — single-shot Lovable prompt

> Скопируй всё ниже (от `=== START ===` до `=== END ===`) и вставь одним сообщением в чат Lovable. Перед этим выполни «Перед стартом» (3 шага, 5 минут) — иначе Lovable не сможет загрузить 1500 вопросов.

---

## Перед стартом

Всё уже опубликовано. Репо: https://github.com/prudnikovcons/qs4me-seed

В промте ниже все ссылки на сид и дизайн уже подставлены:

```
SEED_SQL_URL    = …/question-taxonomy/exports/lovable/seed.sql
QUESTIONS_URL   = …/question-taxonomy/exports/lovable/questions.v2.json
CATEGORIES_URL  = …/question-taxonomy/exports/lovable/categories.json
PLAYLISTS_URL   = …/question-taxonomy/exports/lovable/playlists.json
TOKENS_CSS_URL  = …/design/tokens.css
DESIGN_COMPS    = …/design/qs-components.jsx
DESIGN_SCREENS  = …/design/qs-screens.jsx
```

Тебе остаётся:
1. Создать новый Lovable-проект, включить **Lovable Cloud** (или подключить Supabase).
2. Скопировать всё между `=== START ===` и `=== END ===` ниже и вставить одним сообщением в чат Lovable.

После этого вставь весь блок ниже одним сообщением.

---

```
=== START ===

Build a production-shaped MVP called **qs4.me** (codename qs4me) — a 
Russian-first mobile-first question practice app. People open it, see ONE 
question on the whole screen, count answers in their heads, swipe to the 
next. Seed data has 1500 questions across 15 categories.

# 0. Stack

React 18 + TypeScript + Vite + Tailwind + shadcn/ui + lucide-react + 
react-router. Backend = Supabase / Lovable Cloud. RU-first.

NO info blocks, NO marketing landing, NO article portal, NO answer-text 
storage. Public social content is questions only. Counters store metrics, 
not answer text. Privacy beats engagement.

**The visual system is already designed.** See section 9. Do NOT improvise 
or fall back to shadcn defaults. Fetch `design/tokens.css`, 
`design/qs-components.jsx`, and `design/qs-screens.jsx` from the seed 
repo and adopt them as authoritative. The shadcn primitives are still 
fine for things not covered there (Dialog, Sheet, Toast, Popover) — but 
restyled with the same tokens.

# 1. Database (Supabase)

Create these tables with UUID primary keys, RLS on, owner-only writes.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  locale text default 'ru',
  timezone text default 'Europe/Moscow',
  role text default 'user' check (role in ('user','moderator','admin')),
  stats_visibility text default 'private',
  created_at timestamptz default now()
);

create table categories (
  slug text primary key,
  name_ru text not null, name_en text not null,
  description_ru text, description_en text,
  color text, icon text, sort int default 0,
  is_system bool default true,
  created_at timestamptz default now()
);

create table playlists (
  slug text primary key,
  category_slug text references categories(slug),
  name_ru text not null, name_en text not null,
  description_ru text, description_en text,
  visibility text default 'public',
  is_system bool default true,
  owner_id uuid references auth.users(id),
  created_at timestamptz default now()
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  public_id text unique,
  body text not null,
  target_count int not null default 5,
  body_locale text default 'ru',
  language_hint text default 'ru',
  source text default 'seed',
  visibility text default 'public',
  moderation_state text default 'ok',
  status text default 'approved',
  category_slug text references categories(slug),
  playlist_slugs jsonb default '[]'::jsonb,
  parent_id uuid references questions(id),
  author_id uuid references auth.users(id),
  synonyms jsonb default '[]'::jsonb,
  hint_seeds_ru jsonb default '[]'::jsonb,
  frame_hint_ru text,
  taxonomy jsonb default '{}'::jsonb,
  editorial_flags jsonb default '[]'::jsonb,
  editor_note text,
  is_featured bool default false,
  card_of_day_weight int default 0,
  onboarding_safe bool default false,
  team_safe bool default false,
  search_index_text_ru text,
  depth_score numeric default 0,
  direct_children_count int default 0,
  descendants_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_q_pub on questions(status, moderation_state, visibility);
create index idx_q_cat on questions(category_slug);
create index idx_q_feat on questions(is_featured) where is_featured;
create index idx_q_onb on questions(onboarding_safe) where onboarding_safe;
create index idx_q_pl on questions using gin (playlist_slugs jsonb_path_ops);
create index idx_q_tx on questions using gin (taxonomy jsonb_path_ops);

create table practice_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  target_count int, found_count int, completed bool default false,
  duration_seconds int, source text,
  mood int, energy int,
  private_note text,
  created_at timestamptz default now()
);

create table feed_events (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  anon_id text,
  question_id uuid references questions(id) on delete cascade,
  dwell_ms int,
  direction text,
  inc_count int default 0,
  dec_count int default 0,
  bookmarked bool default false,
  reported bool default false,
  tree_opened bool default false,
  hint_opened bool default false,
  final_state text,
  source text,
  created_at timestamptz default now()
);
create index idx_fe_user on feed_events(user_id, created_at desc);
create index idx_fe_q on feed_events(question_id, created_at desc);

create table bookmarks (
  user_id uuid references auth.users(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, question_id)
);

create table depth_ratings (
  user_id uuid references auth.users(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  value int check (value between 1 and 5),
  created_at timestamptz default now(),
  primary key (user_id, question_id)
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  body text not null,
  moderation_state text default 'ok',
  created_at timestamptz default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  target_type text check (target_type in ('question','comment')),
  target_id uuid not null,
  reason text,
  status text default 'open',
  resolver_id uuid references auth.users(id),
  created_at timestamptz default now()
);

create table user_signals (
  user_id uuid references auth.users(id) on delete cascade,
  dimension text,
  value text,
  positive_score numeric default 0,
  negative_score numeric default 0,
  shown_count int default 0,
  completed_count int default 0,
  last_event_at timestamptz,
  primary key (user_id, dimension, value)
);
```

## RLS policies

- `categories`, `playlists`: public select.
- `questions`: public select where `status='approved' and moderation_state='ok' and visibility='public'`. Owner full CRUD on own rows.
- `practice_runs`, `bookmarks`, `feed_events`, `depth_ratings`, `user_signals`: only owner select/insert/update/delete.
- `comments`: public select where `moderation_state='ok'`; owner manages.
- `reports`: insert by any authenticated user; reporter or moderator can select.

## Trigger: extract target_count

```sql
create or replace function set_target_count() returns trigger as $$
declare m text;
begin
  m := substring(new.body from '^\s*([0-9]{1,3})');
  if m is null then m := substring(new.body from '\m([0-9]{1,2})\M'); end if;
  new.target_count := coalesce(nullif(m,'')::int, 5);
  if new.target_count < 1 or new.target_count > 100 then new.target_count := 5; end if;
  return new;
end $$ language plpgsql;

create trigger trg_q_tc before insert or update of body on questions
for each row execute function set_target_count();
```

## RPC: feed_next (recommendation engine)

```sql
create or replace function feed_next(p_user uuid, p_limit int default 20, p_filters jsonb default '{}'::jsonb)
returns table (question_id uuid, rank_score numeric)
language plpgsql security invoker as $$
declare v_anon bool := p_user is null; v_runs int := 0;
begin
  if not v_anon then
    select count(*) into v_runs from practice_runs where user_id = p_user;
  end if;
  return query
  with pool as (
    select q.* from questions q
    where q.status='approved' and q.moderation_state='ok' and q.visibility='public'
      and q.body_locale = coalesce(p_filters->>'locale','ru')
      and (p_filters->'category_slugs' is null or q.category_slug = any(
        array(select jsonb_array_elements_text(p_filters->'category_slugs'))))
      and (p_filters->>'team_safe' is null or q.team_safe = (p_filters->>'team_safe')::bool)
      and (v_anon or not exists (
        select 1 from feed_events fe where fe.user_id=p_user and fe.question_id=q.id
        and fe.created_at > now() - interval '7 days'))
      and (v_anon or not exists (
        select 1 from reports r where r.reporter_id=p_user and r.target_type='question' and r.target_id=q.id))
      and (v_runs >= 20 or v_anon or q.onboarding_safe = true)
  ),
  scored as (
    select p.id, p.category_slug, p.target_count, (p.taxonomy->>'primary_class') as primary_class,
      (case when p.is_featured then 0.5 else 0 end
       + case when p.editorial_flags ? 'practice_ready' then 0.3 else 0 end
       + case when p.editorial_flags ? 'high_generativity' then 0.2 else 0 end) as q_editorial,
      coalesce((select positive_score - 0.5*negative_score from user_signals
        where user_id=p_user and dimension='category' and value=p.category_slug), 0) as q_cat,
      (case when not exists (select 1 from feed_events fe
        where fe.user_id=p_user and fe.question_id=p.id) then 0.2 else 0.0 end) as q_novelty,
      random()*0.05 as jitter
    from pool p
  )
  select s.id, (0.4*q_cat + 0.1*q_editorial + 0.05*q_novelty + jitter) as score
  from scored s order by score desc limit p_limit*4;
end $$;

create or replace function on_feed_event() returns trigger as $$
declare v_q questions%rowtype; v_pos bool; v_neg bool;
begin
  select * into v_q from questions where id=new.question_id;
  v_pos := (new.bookmarked or new.final_state='completed' or coalesce(new.dwell_ms,0)>12000);
  v_neg := (new.final_state='skipped' and coalesce(new.dwell_ms,0)<2000 and coalesce(new.inc_count,0)=0);
  insert into user_signals(user_id,dimension,value,shown_count,last_event_at)
  values (new.user_id,'category',v_q.category_slug,1,now())
  on conflict (user_id,dimension,value) do update
    set shown_count = user_signals.shown_count+1,
        positive_score = user_signals.positive_score*0.95 + (case when v_pos then 1.0 else 0 end),
        negative_score = user_signals.negative_score*0.95 + (case when v_neg then 1.0 else 0 end),
        last_event_at = now();
  return new;
end $$ language plpgsql;

create trigger trg_fe_signals after insert on feed_events
for each row when (new.user_id is not null) execute function on_feed_event();
```

# 2. Seed import (1500 questions)

After creating the schema, import the seed:

**Path A — most reliable:** prompt the user to open Supabase SQL editor 
and paste the contents of 
https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/question-taxonomy/exports/lovable/seed.sql 
(it's idempotent, ON CONFLICT DO NOTHING).

**Path B — automated:** create an edge function `import-seed` that 
fetches the JSON files below, upserts in chunks of 200 rows, and 
reports progress:

- categories: https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/question-taxonomy/exports/lovable/categories.json
- playlists:  https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/question-taxonomy/exports/lovable/playlists.json
- questions:  https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/question-taxonomy/exports/lovable/questions.v2.json (3 MB)

Until import finishes, the feed shows a skeleton with copy "Готовим вопросы…".

# 3. Routes

`/` (= /feed), `/auth`, `/feed`, `/library`, `/library/categories/:slug`, 
`/library/playlists/:slug`, `/saved`, `/me`, `/questions/:id`, 
`/questions/:id/tree`, `/questions/new`, `/settings`, `/admin/moderation`.

Bottom nav (mobile): `Поток · Библиотека · Я`.

# 4. Snap feed (the hero)

Container: `scroll-snap-type: y mandatory; overflow-y: scroll; height: 100dvh`.
Card: `scroll-snap-align: start; scroll-snap-stop: always; min-height: 100dvh`. 
Mobile-first; desktop = centered column max-w-[480px] on warm-paper bg.

Anatomy of `<QuestionCard>` (top → bottom):
1. Top chips: category pill (accent color), complexity, optional team_safe.
2. Question body: serif 26-32px, text-balance, vertically centered ~50%.
3. Tiny `↻ Иначе` text-link + `💡 Подсказка` icon button just below body.
4. HintSlot (collapsed by default; opens with seeds + frame_hint).
5. Counter block: tabular `0 / N` 48px, thin progress bar, `−` ghost + `+` 
   filled (≥56×56), primary `Готово` button (enables after first +).
6. Floating action bar bottom: bookmark, git-branch, flag, more (lucide).

States: idle / counting / completed (mute check + `+ ещё` + primary 
`Дальше`) / skipped (no UI but emits event). On completion → soft 
microanimation drawing the cardline in accent color (300ms ease-out, 
once). NO confetti, NO sounds.

Telemetry: on every card unmount and on completion, batch-insert into 
`feed_events`. Flush every 5s and on `visibilitychange=hidden`.

Pagination: `IntersectionObserver` on the second-to-last rendered card 
→ call `supabase.rpc('feed_next', { p_user, p_limit: 20, p_filters })`. 
Then run client-side diversifier that drops candidates whose 
`category_slug` or `primary_class` already appears 3+ times in the last 
10 cards, and drops `target_count >= 10` if last 3 cards are all heavy.

Guest mode: works without auth; counter persists in localStorage with 
`anon_id` UUID. Soft non-blocking nudge `Сохрани прогресс` after the 8th card.

# 5. Hints (3 kinds, NEVER answer the question)

- **Synonym** — `↻ Иначе` cycles `questions.synonyms[]` in place. Doesn't 
  write back.
- **Constraint seeds** — `💡 Подсказка` opens HintSlot rendering 
  `questions.hint_seeds_ru[]` as ghost pills (non-clickable).
- **Frame** — single sentence `questions.frame_hint_ru` shown inside 
  HintSlot prefixed «Если не получается:».

Auto-pulse the `💡` icon when user is idle ≥30s with `inc_count<2`. 
Never auto-open. For users with practice_runs<5, show frame_hint by 
default (mutable).

# 6. Library, Saved, Me

`/library`: 2-col category grid (each tile = name in serif + tiny 
description + count, accent shows as 3px left border). Below: playlists 
as a single-column list.

`/saved`: scrollable list (NOT snap) of saved QuestionCard, swipe-left 
to remove. Empty state: «Сохрани вопрос на ленте — он появится здесь».

`/me`: warm-paper greeting "Доброе утро, {name}." (depends on local 
hour). 30-day streak strip. 4 stat tiles: today/week/all-time/streak. 
Top-3 active categories. NO leaderboard, NO popularity.

# 7. Question detail / tree / new

`/questions/:id` — same QuestionCard with embedded counter, plus author 
chip and aggregate practice stats (count of completed runs, total 
played). Tree view at `/questions/:id/tree` shows parent + direct 
children + descendants count, simple nested list.

`/questions/new` — single-column form: serif body input, target_count 
stepper with quick buttons 3/5/7/10, category chip selector, 
complexity 5-step slider, visibility toggle. No AI suggest in v1.

# 8. Comments + moderation

Comments are explicitly **meta-comments**, never answers. Placeholder: 
«Почему этот вопрос работает? Где его применить? Как его улучшить?». 
Reports for questions and comments. `/admin/moderation` (role gated): 
list reports, hide/restore content. Hidden rows disappear from public 
feed within one swipe.

# 9. Visual system — adopt from the design reference

The visual system is **already designed** in detail. DO NOT improvise 
shadcn/ui defaults. DO NOT regenerate tokens from scratch. Fetch and 
adopt these files:

- tokens (CSS custom properties, fonts, utility classes — drop verbatim 
  into `src/index.css`):
  https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/design/tokens.css

- component reference (CategoryChip, ComplexityPill, TeamSafeChip, 
  HintSlot, PracticeCounter, QuestionCard, LibraryTile, PlaylistRow, 
  StatTile, StreakStrip, BottomNav, BrandMark, Icon, plus `CATEGORIES` 
  and `COMPLEXITY` constants):
  https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/design/qs-components.jsx

- screen reference (FeedScreen, LibraryScreen, SavedScreen, MeScreen, 
  NewQuestionScreen, AuthScreen, OnboardingScreen, FilterSheetScreen):
  https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/design/qs-screens.jsx

- adoption guide:
  https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/design/README.md

How to adopt:

1. **Tokens.** Copy `tokens.css` into `src/index.css` (replacing 
   shadcn defaults). Keep the `@import url('https://fonts.googleapis.com/...')` 
   line — fonts are Newsreader (serif), Inter Tight (sans), 
   JetBrains Mono (mono).
2. **Class names.** The CSS exposes utility classes the components 
   depend on: `qs-screen`, `qs-serif`, `qs-tnum`, `qs-hairline`, 
   `qs-chip`, `qs-round`, `qs-round-fill`, `qs-round-ghost`, 
   `qs-primary`, `qs-skel`. Keep them — don't translate to Tailwind 
   utilities, the design depends on them.
3. **Per-category color.** Resolved at runtime via 
   `var(--acc-${category})` and `var(--acc-${category}-bg)`. NEVER 
   translate to a Tailwind theme color list — the runtime lookup is 
   intentional.
4. **Components.** Port the JSX from `qs-components.jsx` to TypeScript 
   verbatim. The inline `Icon` component is fine to swap for 
   `lucide-react` icons of equivalent semantics — the SVG paths are 
   ~lucide already.
5. **Screens.** Treat `qs-screens.jsx` as the layout source of truth. 
   The Lovable React Router screens should render the same structure, 
   with real Supabase data wiring instead of the hardcoded sample data.
6. **Russian labels.** The design uses **lowercase** Russian category 
   labels (`утро`, `память`, `работа`, …). Keep this — it's the 
   product's typographic voice. Don't capitalise.
7. **Dark theme.** `[data-theme="dark"]` selector flips the palette. 
   Auto-detect via `prefers-color-scheme` and persist user choice in 
   localStorage.

Do **not** drop the design files (`design/`) into the production 
build — they're a reference. Only `tokens.css` ships, plus the 
TypeScript ports of the components/screens.

The `ios-frame.jsx`, `design-canvas.jsx`, and `tweaks-panel.jsx` files 
are design-canvas helpers and **must NOT** appear in the production app.

# 10. Hard "do NOT" list

- DO NOT add info-blocks, "did you know", Wikipedia cards, or any 
  context block above the question. Cards = question + counter only.
- DO NOT use stock photos or illustrations. Zero raster images in v1.
- DO NOT use top tabs on the feed. Filtering = bottom-sheet from a 
  filter icon top-right.
- DO NOT show like counts, view counts, "trending", or any popularity 
  signal. Depth ratings stay private aggregates.
- DO NOT use CSS gradient backgrounds anywhere.
- DO NOT use rounded-full on big surfaces.
- DO NOT use brand purple, "AI sparkle" icons, Memphis shapes, or 
  emoji as decoration.
- DO NOT generate a marketing landing page. The first surface is the feed.
- DO NOT store answer text. Counters store metrics only.
- DO NOT put any secret/API key in the frontend. AI calls must be 
  edge-function-only.

# 11. Acceptance

- Guest opens `/`, sees a question, taps `+`/`−`, swipes — works locally.
- Auth signup → `/me` shows stats. Practice run records `practice_runs` 
  with `found_count`, `target_count`, `completed`, `duration_seconds`.
- Snap feed: one card per screen, infinite load via `feed_next`.
- Recommendations: same category never appears 4× in any 10 consecutive 
  cards. Reported items disappear within one swipe.
- Hints: `↻ Иначе` cycles synonyms; `💡` opens seeds + frame; 
  first-5-runs users see frame_hint by default.
- 1500 seed questions present (`select count(*) from questions` = 1500).
- Comments framed as meta-comments. Moderation queue works.
- 0 info blocks. 0 marketing pages. 0 frontend secrets.

Build it now. Start with: schema + RLS + RPC + a single Edge Function 
that fetches the three JSON URLs from section 2 and bulk-upserts 
categories, playlists, then questions in chunks of 200. Then 
`<FeedView>` with the QuestionCard. Then `<Library>`. Then 
auth+profile. Then `/me`. Then comments/moderation last.

Seed source URLs (already-resolved, public, raw):
- https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/question-taxonomy/exports/lovable/seed.sql
- https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/question-taxonomy/exports/lovable/questions.v2.json
- https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/question-taxonomy/exports/lovable/categories.json
- https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/question-taxonomy/exports/lovable/playlists.json

=== END ===
```

---

## Что делать с 1500 вопросами (3 MB) — практически

Lovable не примет 3 MB JSON в чат. Три рабочих варианта:

**Вариант 1 (рекомендую) — публичный gist или GitHub repo.**
Запушь `seed.sql`, `questions.v2.json`, `categories.json`, `playlists.json` в публичный репо или gist → получи raw-URL'ы → подставь в промт. Lovable сделает edge-функцию-импортёр.

**Вариант 2 — Supabase Storage руками.**
Открой Storage в Lovable Cloud → создай бакет `seed` → залей 4 файла → бери signed URL'ы. Дальше edge-функция читает оттуда. Не требует git.

**Вариант 3 — без автоимпорта.**
В промте оставь только DDL+RLS+RPC. После того как Lovable создаст схему — открой Supabase SQL editor и вставь содержимое `seed.sql` руками (2.5 MB, проходит за один клик). Самый простой способ для одного раза.

Если выбрал **3** — удали из промта раздел `# 2. Seed import` и пункт «Replace these placeholders». Остальное оставь как есть.

---

## Дальше (после первого билда Lovable)

- Если Lovable начнёт ставить `border-radius: 9999px` на карточках, сыпать gradient'ы или пихать info-блоки — пингани его одной строкой: «Re-read sections 9 and 10 of the brief. Strip everything that violates the do-not list.»
- После того как лента работает — попроси отдельным промтом: `Add the question composer at /questions/new per section 7.`
- Когда дойдёшь до AI-генератора вопросов — это **отдельный** промт, не клади его сюда.
