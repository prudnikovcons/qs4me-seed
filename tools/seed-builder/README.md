# seed-builder

Builds Lovable-shaped seed data for **qs4me** from `question-taxonomy/`.

Output lives in `question-taxonomy/exports/lovable/`:

| file | purpose |
|---|---|
| `categories.json` | 15 system categories, Lovable shape |
| `playlists.json` | 17 system playlists, Lovable shape |
| `questions.v2.json` | 1500 questions, schema in `question-taxonomy/schema/question.v2.schema.json` |
| `questions.v2.csv` | same data, comma-separated, for human review/edits |
| `seed.sql` | idempotent INSERTs (`ON CONFLICT … DO NOTHING`) |

## Run

```bash
node tools/seed-builder/build.mjs
node tools/seed-builder/validate.mjs
```

No npm install required — single-file Node 22 ESM, no runtime deps.

## What it does

1. **Read** existing source-of-truth JSON from `question-taxonomy/exports/seed-data/` (144 curated questions, 15 categories, 12 playlists — the rest of the 17 system playlists are already in the Lovable shape).
2. **Migrate** the 144 to the v2 shape: extract `target_count` from `body` (`/^\s*(\d+)/` with fallback), add `hint_seeds_ru` and `frame_hint_ru` where appropriate, add `onboarding_safe` heuristics.
3. **Generate** 1356 new questions per the per-category quotas in `templates.mjs:CATEGORY_QUOTA`. Each comes from a slot template (e.g. `{N} человек, которых ты помнишь {memory_axis}, но больше не встречал.`) with cartesian-product expansion. Templates live in `templates.mjs` + `templates-extra.mjs`.
4. **Dedupe** by normalised body (case-, punctuation-, number-insensitive).
5. **Enrich** every question with 1–2 synonyms via rule-based paraphrase, `hint_seeds_ru` for `developmental+` complexity, `frame_hint_ru` for `advanced+` and for `meta`/`philosophy`/`absurd`.
6. **Emit** JSON, CSV, and a single idempotent `seed.sql`.

## Distribution (target == actual)

```
morning       90
memory        135
work          150
creative      120
reflection    150
children      90
social        105
philosophy    105
meta          90
epistemology  90
modelling     105
linguistics   75
senses        75
imagination   75
absurd        45
─────────────────
total         1500
```

## Hint coverage

- `synonyms`: 100%
- `hint_seeds_ru`: ~64%
- `frame_hint_ru`: ~37%

## Re-running

The build is **deterministic** (seeded RNG `mulberry32(20260429)` in `build.mjs`). Re-running produces byte-identical output unless templates change.

If you add new templates, expect new `qtx-` IDs to be allocated starting at the lowest free integer above the current max — the existing 144 keep their original IDs.

## Adding new templates

Append to `templates.mjs` or `templates-extra.mjs`. Each template:

```js
{
  tpl: "{N} {thing}, которые …",        // body with {slot} placeholders
  class: "retrieval",                   // taxonomy.primary_class
  complexity: "working",                // taxonomy.complexity
  time: "past",                         // taxonomy.time_focus
  N: [3, 5, 7],                         // slot values
  thing: ["событий", "разговоров", …],
}
```

The cartesian product of all slot value lists (`N × thing × …`) defines the candidate pool for that template. The generator shuffles all candidates per category and picks until the quota is hit.

## Loading into Supabase / Lovable

See [`question-taxonomy/exports/lovable/README.md`](../../question-taxonomy/exports/lovable/README.md).
