# qs4.me — follow-up prompt (session 2)

> Use this when continuing the build after the first session ran out of credits.
> Paste everything between `=== START ===` and `=== END ===` into Lovable as a single message.

---

```
=== START ===

Continue the qs4me MVP build. Previous session left the project mid-flight.
Do NOT regenerate things that already exist. Read the current repo first.

# Current state (from previous session — already in the project)

DONE:
- DB schema rewritten with text-slug PKs, `public_id`, `playlist_slugs jsonb`,
  `hint_seeds_ru`, `frame_hint_ru`, role column on profiles.
- Triggers: `set_target_count` on body insert/update, `set_updated_at`,
  `update_question_children_count`, `on_feed_event` (updates user_signals).
- RPC `feed_next(p_user, p_limit, p_filters)` with category affinity,
  editorial flags, novelty bonus, jitter, 7-day exclusion, reports filter,
  onboarding-safe gate for users with <20 runs.
- Tables: profiles, categories, playlists, questions, practice_runs,
  feed_events, bookmarks, depth_ratings, comments, reports, user_signals.
- All RLS policies in place.
- src/styles.css = full design tokens (oklch palette, Newsreader / Inter Tight,
  qs-* utility classes, dark theme via [data-theme="dark"]).
- src/components/qs/primitives.tsx — CategoryChip, ComplexityPill, TeamSafeChip,
  HintSlot, PracticeCounter, LibraryTile, PlaylistRow, StatTile, StreakStrip,
  BottomNav, BrandMark, Icon, CATEGORIES, COMPLEXITY, catLabel,
  complexityToLevel.
- src/components/qs/QuestionCard.tsx — hero card with synonym cycle, hint slot,
  +/- counter, completion ring + Дальше, idle pulse, telemetry hooks.
- src/routes/index.tsx — snap feed with IntersectionObserver pagination,
  client-side category diversifier (max 3 per 10), batched feed_events
  (5s + on visibilitychange), guest mode with localStorage anon_id, nudge
  after 8 cards.
- src/routes/auth.tsx — email/password + Google OAuth via lovable.auth.
- src/routes/library.tsx — categories grid + playlists list.
- src/lib/queries.ts — supabase wrappers wired to the new schema.

NOT DONE / BROKEN:
- Build fails: library.tsx links to /library/categories/$slug and
  /library/playlists/$slug — those routes don't exist yet.
- Database has 0 questions (old data dropped during migration; nothing imported).
- Missing routes: /me, /saved, /questions/$id, /questions/$id/tree,
  /questions/new, /settings, /admin/moderation, /library/categories/$slug,
  /library/playlists/$slug.
- Comments / reports / depth-ratings / moderation UI not built.
- handle_new_user has SECURITY DEFINER linter warning unresolved.

# Tasks — in strict order. Don't skip ahead.

## Phase 1 — Unbreak the build (do FIRST)

Create minimal stubs for every missing route so TanStack Router compiles
and `pnpm tsc --noEmit` passes. Stubs render BrandMark + a centered
"в разработке" line + BottomNav, using existing primitives. No logic yet.

Files to create:
- src/routes/library.categories.$slug.tsx
- src/routes/library.playlists.$slug.tsx
- src/routes/me.tsx
- src/routes/saved.tsx
- src/routes/questions.$id.tsx
- src/routes/questions.$id.tree.tsx
- src/routes/questions.new.tsx
- src/routes/settings.tsx
- src/routes/admin.moderation.tsx

Then fix any remaining type errors in QuestionCard.tsx / queries.ts /
index.tsx. Don't proceed until `pnpm tsc --noEmit` is clean and
`pnpm build` succeeds.

## Phase 2 — Seed import (CRITICAL — without this, nothing renders)

Source URLs (raw, public, stable):
- categories: https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/question-taxonomy/exports/lovable/categories.json
- playlists:  https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/question-taxonomy/exports/lovable/playlists.json
- questions:  https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/question-taxonomy/exports/lovable/questions.v2.json
- seed.sql:   https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/question-taxonomy/exports/lovable/seed.sql

Two paths — pick one and tell me which:

**Path A — Edge Function (preferred).** Create `supabase/functions/import-seed/index.ts`:
1. Use SUPABASE_SERVICE_ROLE_KEY (server-side only, NEVER in frontend bundle).
2. Fetch the three JSON URLs.
3. Upsert categories ON CONFLICT (slug) DO UPDATE SET …
4. Upsert playlists ON CONFLICT (slug) DO UPDATE SET …
5. Upsert questions in chunks of 200, ON CONFLICT (public_id) DO UPDATE SET …
   IMPORTANT: pass `target_count` explicitly so the trigger doesn't override
   our parsed value.
6. Protect the function: require `Authorization: Bearer <SERVICE_ROLE_KEY>`
   header. Return JSON `{ categories, playlists, questions }` counts.

Deploy and invoke ONCE. Verify:
- `select count(*) from categories;` → 15
- `select count(*) from playlists;` → 17
- `select count(*) from questions;` → 1500

**Path B — manual SQL (fallback).** Tell me to open Supabase SQL editor and
paste the seed.sql URL contents. seed.sql is 2.5 MB and uses
ON CONFLICT DO NOTHING, idempotent.

## Phase 3 — Replace stubs with real implementations, in this order

### 3a. /me (highest priority — post-auth landing)

- Time-aware greeting: "Доброе утро/день/вечер, {display_name or email_prefix}."
  Serif 22px, ink color. Logic: hour < 12 утро, < 18 день, else вечер.
- StreakStrip — 30 days, dot filled if user has ≥1 practice_run that day.
- 4 StatTile in a 2×2 grid:
  - "Сегодня" — count of practice_runs today
  - "Эта неделя" — count last 7 days
  - "Всего" — all-time count
  - "Серия" — current consecutive-day streak (dy. compute server-side via RPC
    or client-side from the streak data)
- Top-3 active categories as horizontal bars. Port `CategoryBar` from the
  design reference at design/qs-screens.jsx (function CategoryBar lines ~228-258).
  Width proportional to user's practice_runs count for that category.
- Sign-out link at the bottom (ink-soft, 13px, underline on hover).
- NO leaderboards. NO popularity. NO comparisons.

### 3b. /saved

- `fetchBookmarks(user.id)` → JOIN with questions.
- Render as a non-snap vertical list. Each item is a compact QuestionCard
  variant (80vh, no bottom nav, no top brand bar — just chips + body +
  counter + actions).
- "×" icon in the top-right of each card → calls `bookmarkRemove`, optimistic
  removal from list.
- Empty state: centered "Сохрани вопрос на ленте — он появится здесь"
  in ink-soft, 14px.

### 3c. /questions/$id

- Fetch the question by id.
- Render the standard QuestionCard (full screen, but NOT inside a snap container).
- Below the card: aggregate stats row.
  - "Практик: {n}" — count from practice_runs
  - "Прошли: {pct}%" — completed/total
  - "Глубина: {avg}" — avg depth_ratings.value
  - "Дочерних: {n}" — direct_children_count
- Action: "Перейти к дереву" link → /questions/$id/tree.
- DepthRating widget below stats — 5 dots, click to set 1-5, upsert into
  depth_ratings.

### 3d. /questions/$id/tree

- Show parent (one level up) if `parent_id` exists, as a small chip
  "← {parent.body[:50]}…" → tap navigates to parent.
- Show direct children as a vertical list.
- Each child row: CategoryChip + first 60 chars of body + " · " + target_count
  in tabular nums. Tap → /questions/$id.
- "+ дочерний вопрос" button at bottom → /questions/new?parent_id={id}.

### 3e. /questions/new

- Form with these fields:
  - body — large serif textarea, min 10 chars, max 280
  - target_count — stepper 1-100; quick-buttons 3 / 5 / 7 / 10
  - category — single-select chip grid of 15 categories
  - complexity — 5-step slider (база / рабочий / развивающий / продвинутый / предел)
  - visibility — toggle public / private
  - parent_id — hidden, populated from `?parent_id=…` query param
- On submit:
  - source='user', author_id=user.id, status='draft', moderation_state='ok'
  - target_count is sent explicitly (the trigger only acts as a fallback)
  - taxonomy: { primary_class: 'generative', complexity: <slider value as enum> }
  - body_locale='ru', language_hint='ru'
- After insert: navigate to /questions/$newId.

### 3f. /library/categories/$slug

- Fetch category by slug + count of questions in it.
- Header: serif 28px name + ink-soft description + "{n} вопросов".
- "Открыть в потоке" primary button → /?category=$slug. Update the feed
  to read this query param and pass it to feed_next as `category_slugs:[slug]`.
- Below: vertical list of question previews — each row = first 80 chars +
  target_count, tappable → /questions/$id.

### 3g. /library/playlists/$slug

- Same shape as 3f, but filter is `playlist_slugs ? $slug` (jsonb containment).
- Header includes parent category chip + playlist name.

## Phase 4 — Secondary

- Comments on /questions/$id:
  - Input below the card. Placeholder:
    "Почему этот вопрос работает? Где его применить? Как его улучшить?"
  - List of comments under input. Show only `moderation_state='ok'`.
- Report button (already wired in QuestionCard.onReport): open a small
  Sheet/Dialog with reason input, then insert into `reports`.
- /admin/moderation: list reports where status='open'. Allow setting
  `moderation_state='hidden'` on the target. Role-gate via has_role(uid, 'moderator')
  or 'admin'.
- /settings:
  - Theme toggle: light / dark / auto. Persist in localStorage. Apply
    `data-theme="dark"` on <html> when dark.
  - Reminder time (mock UI is fine; just save to profiles.settings jsonb).
  - Sign-out button.

## Phase 5 — Polish + verify

- Resolve `handle_new_user` linter warning. Keep SECURITY DEFINER (required
  to insert into auth-adjacent tables on signup), but:
  `REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;`
  Add an SQL comment explaining why DEFINER is necessary.
- Add to index.html:
  `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
- Add CSS `padding-bottom: env(safe-area-inset-bottom)` to BottomNav.
- Run `pnpm tsc --noEmit` — 0 errors.
- Run `pnpm build` — succeeds.

# Hard rules — do NOT violate (these are critical, re-read tokens.css and previous spec sections 9-10)

- DO NOT touch src/styles.css unless adding a new utility class. The
  oklch palette and qs-* classes are authoritative.
- DO NOT replace per-category accents with Tailwind theme colors. Accents
  MUST be runtime CSS custom properties via `var(--acc-${category})` and
  `var(--acc-${category}-bg)`.
- DO NOT add: gradient backgrounds, drop shadows on cards, rounded-full on
  large surfaces, info blocks, "did you know" panels, marketing copy,
  popularity counters, like buttons, view counts, share buttons, emoji
  decorations, AI-sparkle icons.
- DO NOT capitalize Russian category labels (CATEGORIES uses lowercase
  by design — keep it).
- DO NOT store answer text anywhere. practice_runs stores metrics only.
  private_note exists but is opt-in private after completion.
- DO NOT regenerate the design system or rewrite primitives "for consistency".
  They are the source of truth.

# End-of-session verification

Open the app in the preview and check:
- `/` — snap feed shows real questions, +/- works, swipe advances, telemetry
  fires (verify in feed_events: `select count(*) from feed_events;`).
- `/me` after sign-in — greeting + streak + 4 stats + top categories.
- `/library` — 15 category tiles, all 17 playlists, both tappable to detail.
- `/library/categories/morning` — list of morning questions, "Открыть в потоке"
  filters the feed.
- `/saved` — empty state for fresh user, populated after bookmarking 2-3.
- `/questions/{any-id}` — single card + stats + tree link + depth rating.
- `/questions/{id}/tree` — parent (if any) + children list + "+ дочерний".
- `/questions/new` — composer creates a draft, navigates to it.
- Light/dark theme toggle works.
- `pnpm build` succeeds.

If anything blocks, STOP and tell me which phase + which task. Don't
keep burning tokens on speculative fixes.

=== END ===
```

---

## Когда вставлять

Завтра, как только обновятся очки в Lovable. Никаких подготовительных шагов не нужно — все ссылки уже резолвлены, репо публичный, схема БД и компоненты уже на месте с прошлой сессии.

## Что делать, если упрётся

- **Если билд не починился после Phase 1** — попроси: `Show me the failing tsc errors in full. Don't fix them yet — just paste the error list.` Так получишь точечную диагностику без блуждания.
- **Если Edge Function не разворачивается** — попроси: `Skip Path A. I'll do Path B manually.` Открой Supabase SQL editor, вставь содержимое https://raw.githubusercontent.com/prudnikovcons/qs4me-seed/main/question-taxonomy/exports/lovable/seed.sql одним блоком, нажми Run. 1500 вопросов окажутся в БД одним кликом.
- **Если начнёт городить shadcn-цвета или gradient'ы** — пингуй: `Re-read Hard rules. Stop. Revert that change. The accent system uses CSS custom properties only.`
