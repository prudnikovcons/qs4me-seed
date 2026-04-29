# qs4.me — Lovable seed & spec

This is a public, minimal companion repo for the **qs4.me** Lovable build. It contains:

- `docs/lovable/MEGA-PROMPT.md` — single-shot prompt to paste into Lovable
- `docs/lovable/spec.md` — full product/tech spec
- `docs/lovable/recommendations.md` — `feed_next` recommender deep dive
- `question-taxonomy/exports/lovable/seed.sql` — 1500 questions + 15 categories + 17 playlists, idempotent INSERTs
- `question-taxonomy/exports/lovable/questions.v2.json` — 1500 questions, JSON
- `question-taxonomy/exports/lovable/categories.json` — 15 categories
- `question-taxonomy/exports/lovable/playlists.json` — 17 playlists
- `question-taxonomy/exports/lovable/questions.v2.csv` — same data, human-reviewable
- `question-taxonomy/schema/question.v2.schema.json` — JSON Schema
- `tools/seed-builder/` — deterministic Node 22 generator (regenerate with `node tools/seed-builder/build.mjs`)

## Quick start (Lovable Cloud / Supabase)

1. Open Supabase SQL editor.
2. Apply the DDL from `docs/lovable/MEGA-PROMPT.md` → section `# 1. Database`.
3. Paste the contents of `question-taxonomy/exports/lovable/seed.sql` and run.
4. `select count(*) from questions;` → 1500.

## Raw URLs (for the Lovable mega-prompt)

After this repo is pushed to GitHub, replace the placeholders in `MEGA-PROMPT.md` with the raw URLs:

```
SEED_SQL_URL    = https://raw.githubusercontent.com/<user>/<repo>/main/question-taxonomy/exports/lovable/seed.sql
QUESTIONS_URL   = https://raw.githubusercontent.com/<user>/<repo>/main/question-taxonomy/exports/lovable/questions.v2.json
CATEGORIES_URL  = https://raw.githubusercontent.com/<user>/<repo>/main/question-taxonomy/exports/lovable/categories.json
PLAYLISTS_URL   = https://raw.githubusercontent.com/<user>/<repo>/main/question-taxonomy/exports/lovable/playlists.json
```

## License

AGPL-3.0-or-later — same as the upstream qs4me monorepo.
