# Lovable / Supabase seed for qs4me

Drop-in seed for the React + Vite + shadcn/ui + Supabase Lovable build. Contents:

| file | rows | description |
|---|---:|---|
| `categories.json` | 15 | system categories (slug, name, description, color, icon, sort) |
| `playlists.json` | 17 | system playlists (slug, category_slug, name, description, visibility, is_system) |
| `questions.v2.json` | 1500 | full question records (schema: `../../schema/question.v2.schema.json`) |
| `questions.v2.csv` | 1500 | human-reviewable subset (key columns) |
| `seed.sql` | 1532 | idempotent `INSERT … ON CONFLICT DO NOTHING` for all three |

Distribution and the build process are documented in [`tools/seed-builder/README.md`](../../../tools/seed-builder/README.md).

## How to import

### Option A — Supabase SQL editor (fastest)

1. Open Supabase → SQL editor.
2. Make sure the schema (`categories`, `playlists`, `questions`, …) exists. The DDL is in [`docs/lovable/spec.md`](../../../docs/lovable/spec.md) §4.
3. Paste the contents of `seed.sql` and run.
4. Verify:

```sql
select count(*) from questions;                 -- 1500
select category_slug, count(*) from questions
  group by 1 order by 2 desc;                   -- matches the table below
```

### Option B — Edge Function `import-seed`

For larger or repeated imports, deploy this Edge Function:

```ts
// supabase/functions/import-seed/index.ts
import { createClient } from "npm:@supabase/supabase-js@2";
import questions from "./questions.v2.json" with { type: "json" };
import categories from "./categories.json" with { type: "json" };
import playlists from "./playlists.json" with { type: "json" };

Deno.serve(async () => {
  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  await sb.from("categories").upsert(categories, { onConflict: "slug" });
  await sb.from("playlists").upsert(playlists, { onConflict: "slug" });
  // chunk to keep the request under the body limit
  for (let i = 0; i < questions.length; i += 200) {
    await sb.from("questions").upsert(questions.slice(i, i + 200), {
      onConflict: "public_id",
    });
  }
  return new Response("ok");
});
```

Trigger once with the service role key. The function is idempotent — re-running is safe.

## Schema highlights (see spec.md §4 for the full DDL)

- `questions.target_count int not null` — extracted from body via `/^\s*(\d+)/` with fallback
- `questions.synonyms jsonb` — array of 1-2 paraphrases for `↻ Иначе` button
- `questions.hint_seeds_ru jsonb` — 2-4 stem words for `💡 Подсказка` (≈ 64% coverage)
- `questions.frame_hint_ru text` — single reframe sentence (≈ 37% coverage)
- `questions.taxonomy jsonb` — the full facet bag: primary_class, complexity, modes, time_focus, …
- `questions.editorial_flags jsonb` — `practice_ready, high_generativity, deep_work, team_safe, …`

## Distribution

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

The first 144 questions (`qtx-0001` … `qtx-0144`) are the originally curated corpus from `question-taxonomy/data/questions/**/*.yaml`. The rest (`qtx-0145` … `qtx-1503`) are template-generated. Public IDs are stable across rebuilds.

## Re-building

```bash
node tools/seed-builder/build.mjs
node tools/seed-builder/validate.mjs
```

The generator is deterministic (seeded RNG). Re-running produces identical output unless `templates.mjs` / `templates-extra.mjs` change.
