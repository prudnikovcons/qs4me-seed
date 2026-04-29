#!/usr/bin/env node
// Build Lovable-shaped seed data.
//
// Inputs:
//   ../question-taxonomy/exports/seed-data/categories.json
//   ../question-taxonomy/exports/seed-data/playlists.json
//   ../question-taxonomy/exports/seed-data/seed-questions.json   (144 existing)
//   ./templates.mjs                                               (new generation)
//
// Outputs (../question-taxonomy/exports/lovable/):
//   categories.json    — 15 rows, Lovable shape
//   playlists.json     — 17 rows, Lovable shape
//   questions.v2.json  — 1500 rows, schema in docs/lovable/spec.md §4
//   questions.v2.csv   — for human review
//   seed.sql           — idempotent INSERTs for Supabase

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  TEMPLATES,
  CATEGORY_DEFAULTS,
  CATEGORY_PRIMARY_PLAYLIST,
  CATEGORY_QUOTA,
} from "./templates.mjs";
import { EXTRA_TEMPLATES, EXTRA2_TEMPLATES } from "./templates-extra.mjs";

// merge extra templates into TEMPLATES
for (const src of [EXTRA_TEMPLATES, EXTRA2_TEMPLATES]) {
  for (const [cat, extras] of Object.entries(src)) {
    TEMPLATES[cat] = [...(TEMPLATES[cat] ?? []), ...extras];
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");
const SRC = path.join(REPO, "question-taxonomy", "exports", "seed-data");
const OUT = path.join(REPO, "question-taxonomy", "exports", "lovable");

// ----------------------------------------------------------------------------
// utilities
// ----------------------------------------------------------------------------
function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function writeJson(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf8");
}
function writeText(p, txt) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, txt, "utf8");
}

function extractTargetCount(body) {
  const m = body.match(/^\s*(\d{1,3})\b/);
  let t = m ? parseInt(m[1], 10) : null;
  if (!t) {
    const m2 = body.match(/\b(\d{1,2})\b/);
    t = m2 ? parseInt(m2[1], 10) : 5;
  }
  if (t < 1 || t > 100) t = 5;
  return t;
}

function normalizeForDedup(s) {
  return s
    .toLowerCase()
    .replace(/[ёЁ]/g, "е")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\d+\b/g, "#")
    .trim();
}

function* cartesian(template) {
  const slots = Object.keys(template).filter(
    (k) =>
      k !== "tpl" &&
      k !== "class" &&
      k !== "complexity" &&
      k !== "time" &&
      Array.isArray(template[k]),
  );
  if (slots.length === 0) {
    yield { ...template, vals: {} };
    return;
  }
  const lists = slots.map((s) => template[s]);
  const idx = lists.map(() => 0);
  while (true) {
    const vals = {};
    slots.forEach((s, i) => (vals[s] = lists[i][idx[i]]));
    yield { vals };
    let i = 0;
    while (i < lists.length) {
      idx[i]++;
      if (idx[i] < lists[i].length) break;
      idx[i] = 0;
      i++;
    }
    if (i === lists.length) return;
  }
}

function applyTemplate(tpl, vals) {
  let out = tpl;
  for (const [k, v] of Object.entries(vals)) {
    out = out.replaceAll(`{${k}}`, String(v));
  }
  return out;
}

// shuffle with deterministic seed for reproducibility
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260429);
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ----------------------------------------------------------------------------
// synonym + hint generation (rule-based)
// ----------------------------------------------------------------------------
const SYNONYM_PREFIXES = [
  ["", "Назови "],
  ["", "Вспомни "],
  ["", "Перечисли "],
  ["Назови ", ""],
  ["Назови ", "Перечисли "],
  ["Вспомни ", "Назови "],
  ["Вспомни ", ""],
  ["Какие ", ""],
];

function genSynonyms(body) {
  // produce 2 paraphrases by toggling lead verb if present
  const out = new Set();
  // 1: prepend "Назови " if not already
  if (!/^(Назови|Вспомни|Перечисли|Какие)\b/i.test(body)) {
    out.add(`Назови ${body[0].toLowerCase()}${body.slice(1)}`);
  }
  // 2: prepend "Вспомни"
  if (!/^Вспомни\b/i.test(body)) {
    out.add(`Вспомни, ${body[0].toLowerCase()}${body.slice(1)}`);
  }
  // 3: replace "Назови" with "Перечисли"
  if (/^Назови /i.test(body)) {
    out.add(body.replace(/^Назови /i, "Перечисли "));
  }
  // 4: rephrase as a question
  if (!body.includes("?")) {
    let q = body.replace(/\.$/, "");
    if (!/^Какие /i.test(q)) {
      q = `Какие ${q[0].toLowerCase()}${q.slice(1)}?`;
    } else {
      q = `${q}?`;
    }
    out.add(q);
  }
  // ensure at most 2 distinct
  const arr = [...out].filter((s) => s !== body).slice(0, 2);
  return arr.length ? arr : [body];
}

const HINT_SEEDS_POOL = {
  morning: ["до завтрака", "у окна", "ощущение в груди", "первый звук", "тихий момент"],
  memory: ["лицо", "запах", "комната", "разговор", "погода", "голос", "касание"],
  work: ["до обеда", "с командой", "одному", "блокер", "следующий шаг", "что лишнее"],
  creative: ["как ребёнок", "наоборот", "очень мало", "очень много", "другой материал"],
  reflection: ["в теле", "в дыхании", "в голосе", "в избегании", "в выборе", "в мелочи"],
  children: ["почему", "а что если", "глазами зверя", "глазами игры", "на ощупь"],
  social: ["вчера", "при встрече", "в переписке", "молчание", "то, что не сказал"],
  philosophy: ["в крайнем случае", "если поменять слово", "если включить тело", "если это ребёнок"],
  meta: ["задано слишком рано", "задано на бегу", "с любовью", "с упрёком"],
  epistemology: ["где доказательство", "что я повторяю", "что я не проверял", "обратный пример"],
  modelling: ["границы карты", "обратная связь", "масштаб ×10", "масштаб ÷10"],
  linguistics: ["другой язык", "молча", "одним словом", "длинной фразой", "глаголом"],
  senses: ["звук", "запах", "цвет", "касание", "вкус", "температура"],
  imagination: ["в 2050", "в детстве", "в другом теле", "если бы я был героем сказки"],
  absurd: ["обратись к самому вопросу", "поменяй местами", "ответ внутри"],
};

const FRAME_HINTS = {
  morning: "Считай не громкие события, а маленькие переключения внимания.",
  memory: "Важна не точность, а сам акт возвращения.",
  work: "Замечай то, что мешает увидеть уже знакомое.",
  creative: "Дай себе право на плохие варианты — иначе хороших не будет.",
  reflection: "Не оценивай ответы, просто фиксируй их по факту.",
  children: "Ребёнок видит вопрос буквально. Попробуй так же.",
  social: "Ищи не выводы, а конкретные слова и интонации.",
  philosophy: "Опирайся на свой опыт, а не на правильное звучание.",
  meta: "Заметь форму вопроса не меньше, чем его содержание.",
  epistemology: "Отличай «знаю», «верю» и «слышал».",
  modelling: "Карта не территория — ищи, где они расходятся.",
  linguistics: "Слово — это инструмент. Какой смысл оно выбирает за тебя?",
  senses: "Снизь скорость до уровня тела.",
  imagination: "Не бойся неправдоподобных деталей — в них смысл.",
  absurd: "Не пытайся «решить» — заметь, как вопрос работает с тобой.",
};

// ----------------------------------------------------------------------------
// load existing
// ----------------------------------------------------------------------------
console.log("Reading source files…");
const srcCategories = readJson(path.join(SRC, "categories.json"));
const srcPlaylists = readJson(path.join(SRC, "playlists.json"));
const srcQuestions = readJson(path.join(SRC, "seed-questions.json"));
console.log(
  `  categories=${srcCategories.length} playlists=${srcPlaylists.length} questions=${srcQuestions.length}`,
);

// ----------------------------------------------------------------------------
// 1. categories.json — drop items_count, that's a Vue-app metric
// ----------------------------------------------------------------------------
const categoriesOut = srcCategories.map((c) => ({
  slug: c.slug,
  name_ru: c.name_ru,
  name_en: c.name_en,
  description_ru: c.description_ru,
  description_en: c.description_en,
  color: c.color,
  icon: c.icon,
  sort: c.sort,
  is_system: c.is_system,
}));

// ----------------------------------------------------------------------------
// 2. playlists.json — drop items_count and question_ids; top up missing ones
// ----------------------------------------------------------------------------
const playlistsOut = srcPlaylists.map((p) => ({
  slug: p.slug,
  category_slug: p.category_slug,
  name_ru: p.name_ru,
  name_en: p.name_en,
  description_ru: p.description_ru,
  description_en: p.description_en,
  visibility: p.visibility,
  is_system: p.is_system,
}));

// Add the 5 system playlists missing from seed-data/ (they exist in curation/playlists.v1.yaml).
const MISSING_PLAYLISTS = [
  { slug: "language_lens",        category_slug: "linguistics",
    name_ru: "Линза языка",       name_en: "Language Lens",
    description_ru: "Вопросы о том, как слова и грамматика определяют горизонты мышления.",
    description_en: "Questions about how words and grammar shape the horizon of thought.",
    visibility: "public", is_system: true },
  { slug: "sensory_sharpening",   category_slug: "senses",
    name_ru: "Настройка восприятия", name_en: "Sensory Sharpening",
    description_ru: "Вопросы о восприятии, иллюзиях и точности органов чувств.",
    description_en: "Questions about perception, illusions, and the precision of the senses.",
    visibility: "public", is_system: true },
  { slug: "social_mirror",        category_slug: "social",
    name_ru: "Социальное зеркало", name_en: "Social Mirror",
    description_ru: "Вопросы о том, как другие люди отражают и меняют наше мышление.",
    description_en: "Questions about how other people reflect and reshape our thinking.",
    visibility: "public", is_system: true },
  { slug: "thought_experiments",  category_slug: "imagination",
    name_ru: "Мысленные эксперименты", name_en: "Thought Experiments",
    description_ru: "Вопросы для воображаемых сценариев, контрфактических миров и «что если».",
    description_en: "Questions for imagined scenarios, counterfactual worlds, and what-ifs.",
    visibility: "public", is_system: true },
  { slug: "paradox_lab",          category_slug: "absurd",
    name_ru: "Лаборатория абсурда", name_en: "Paradox Lab",
    description_ru: "Парадоксы, коаны и вопросы, где смысл начинает ловить себя за хвост.",
    description_en: "Paradoxes, koans, and questions where meaning starts to catch its own tail.",
    visibility: "public", is_system: true },
];
const existingPlaylistSlugs = new Set(playlistsOut.map((p) => p.slug));
for (const p of MISSING_PLAYLISTS) {
  if (!existingPlaylistSlugs.has(p.slug)) playlistsOut.push(p);
}

// ----------------------------------------------------------------------------
// 3. questions.v2 — start with 144 existing, parse target_count
// ----------------------------------------------------------------------------
function toV2(q) {
  const target_count = extractTargetCount(q.body);
  return {
    public_id: q.id,
    body: q.body,
    target_count,
    body_locale: q.body_locale ?? "ru",
    language_hint: q.language_hint ?? "ru",
    source: q.source ?? "seed",
    visibility: q.visibility ?? "public",
    moderation_state: q.moderation_state ?? "ok",
    status: q.status ?? "approved",
    category_slug: q.category_slug,
    playlist_slugs: q.playlist_slugs ?? [],
    synonyms: q.synonyms ?? [],
    hint_seeds_ru: [],
    frame_hint_ru: null,
    taxonomy: q.taxonomy ?? {},
    editorial_flags: q.editorial_flags ?? [],
    editor_note: q.editor_note ?? null,
    is_featured: q.is_featured ?? false,
    card_of_day_weight: q.card_of_day_weight ?? 0,
    onboarding_safe: q.onboarding_safe ?? false,
    team_safe: q.team_safe ?? false,
    search_index_text_ru: q.search_index_text_ru ?? null,
  };
}

const questions = srcQuestions.map(toV2);
const usedNorm = new Set(questions.map((q) => normalizeForDedup(q.body)));
const usedPublicId = new Set(questions.map((q) => q.public_id));

// enrich existing where useful
for (const q of questions) {
  // add hint_seeds for ~complexity in {developmental, advanced, limit}
  const cx = q.taxonomy?.complexity;
  if (
    HINT_SEEDS_POOL[q.category_slug] &&
    (cx === "developmental" || cx === "advanced" || cx === "limit")
  ) {
    q.hint_seeds_ru = shuffle(HINT_SEEDS_POOL[q.category_slug]).slice(0, 3);
  }
  // add frame_hint for advanced+limit OR meta/philosophy/absurd
  if (
    cx === "advanced" ||
    cx === "limit" ||
    ["meta", "philosophy", "absurd"].includes(q.category_slug)
  ) {
    q.frame_hint_ru = FRAME_HINTS[q.category_slug] ?? null;
  }
  // also flag onboarding_safe heuristically for basic
  if (cx === "basic" && q.taxonomy?.openness !== "radically_open") {
    q.onboarding_safe = true;
  }
}

// ----------------------------------------------------------------------------
// 4. generate new questions per category to fit quota
// ----------------------------------------------------------------------------
function nextPublicId() {
  let n = 145;
  while (usedPublicId.has(`qtx-${String(n).padStart(4, "0")}`)) n++;
  const id = `qtx-${String(n).padStart(4, "0")}`;
  usedPublicId.add(id);
  return id;
}

function buildOne(category, tpl, vals) {
  const body = applyTemplate(tpl.tpl, vals);
  const target_count = extractTargetCount(body);
  const defaults = CATEGORY_DEFAULTS[category] ?? {};
  const taxonomy = {
    primary_class: tpl.class,
    purpose: defaults.purpose,
    domains: defaults.domains,
    answer_form: defaults.answer_form,
    openness: defaults.openness,
    complexity: tpl.complexity,
    modes: defaults.modes,
    time_focus: tpl.time,
    subject_direction: defaults.subject_direction,
    abstraction_level: defaults.abstraction_level,
    generativity_score:
      tpl.complexity === "limit"
        ? 5
        : tpl.complexity === "advanced"
          ? 4
          : tpl.complexity === "developmental"
            ? 3
            : tpl.complexity === "working"
              ? 2
              : 1,
  };
  const editorial_flags = ["practice_ready"];
  if (taxonomy.generativity_score >= 4) editorial_flags.push("high_generativity");
  if (category === "absurd" || category === "meta") editorial_flags.push("counterintuitive");
  if (category === "children") editorial_flags.push("child_friendly", "team_safe");
  if (category === "work" && tpl.complexity !== "advanced" && tpl.complexity !== "limit") {
    editorial_flags.push("team_safe");
  }
  if (taxonomy.complexity === "advanced" || taxonomy.complexity === "limit") {
    editorial_flags.push("deep_work");
  }
  const onboarding_safe =
    tpl.complexity === "basic" && taxonomy.openness !== "radically_open";
  const team_safe = editorial_flags.includes("team_safe");
  const playlist = CATEGORY_PRIMARY_PLAYLIST[category];

  const synonyms = genSynonyms(body);

  const wantsHints =
    tpl.complexity === "developmental" ||
    tpl.complexity === "advanced" ||
    tpl.complexity === "limit";
  const wantsFrame =
    tpl.complexity === "advanced" ||
    tpl.complexity === "limit" ||
    category === "meta" ||
    category === "philosophy" ||
    category === "absurd";

  return {
    public_id: nextPublicId(),
    body,
    target_count,
    body_locale: "ru",
    language_hint: "ru",
    source: "seed",
    visibility: "public",
    moderation_state: "ok",
    status: "approved",
    category_slug: category,
    playlist_slugs: playlist ? [playlist] : [],
    synonyms,
    hint_seeds_ru: wantsHints
      ? shuffle(HINT_SEEDS_POOL[category] ?? []).slice(0, 3)
      : [],
    frame_hint_ru: wantsFrame ? FRAME_HINTS[category] ?? null : null,
    taxonomy,
    editorial_flags,
    editor_note: null,
    is_featured: false,
    card_of_day_weight:
      tpl.complexity === "basic" || tpl.complexity === "working" ? 2 : 1,
    onboarding_safe,
    team_safe,
    search_index_text_ru: [body, ...synonyms].join(" "),
  };
}

const stats = {};
for (const category of Object.keys(CATEGORY_QUOTA)) {
  const target = CATEGORY_QUOTA[category];
  const haveAlready = questions.filter((q) => q.category_slug === category).length;
  const need = Math.max(0, target - haveAlready);
  stats[category] = { existing: haveAlready, need, generated: 0 };
  if (need === 0) continue;

  const templates = TEMPLATES[category] ?? [];
  if (templates.length === 0) {
    console.warn(`  ! no templates for ${category}`);
    continue;
  }

  // build a pool of all candidates from cartesian products of every template
  const pool = [];
  for (const t of templates) {
    for (const expanded of cartesian(t)) {
      const body = applyTemplate(t.tpl, expanded.vals);
      pool.push({ tpl: t, vals: expanded.vals, body });
    }
  }
  const shuffled = shuffle(pool);

  let added = 0;
  for (const cand of shuffled) {
    if (added >= need) break;
    const norm = normalizeForDedup(cand.body);
    if (usedNorm.has(norm)) continue;
    usedNorm.add(norm);
    const q = buildOne(category, cand.tpl, cand.vals);
    questions.push(q);
    added++;
  }
  stats[category].generated = added;

  if (added < need) {
    console.warn(
      `  ! ${category}: pool exhausted, generated ${added}/${need}`,
    );
  }
}

// ----------------------------------------------------------------------------
// 5. report + write outputs
// ----------------------------------------------------------------------------
console.log("\nDistribution:");
const tally = {};
for (const q of questions) {
  tally[q.category_slug] = (tally[q.category_slug] ?? 0) + 1;
}
for (const slug of Object.keys(CATEGORY_QUOTA)) {
  const got = tally[slug] ?? 0;
  const want = CATEGORY_QUOTA[slug];
  const mark = got === want ? "✓" : "·";
  console.log(`  ${mark} ${slug.padEnd(13)} ${got}/${want}`);
}
console.log(`  total: ${questions.length}`);

// hint coverage
const synFull = questions.filter((q) => q.synonyms?.length).length;
const seedFull = questions.filter((q) => q.hint_seeds_ru?.length).length;
const frameFull = questions.filter((q) => q.frame_hint_ru).length;
console.log(
  `\nHint coverage: synonyms=${synFull}/${questions.length}  seeds=${seedFull}/${questions.length}  frame=${frameFull}/${questions.length}`,
);

// ----------------------------------------------------------------------------
// write categories.json
// ----------------------------------------------------------------------------
writeJson(path.join(OUT, "categories.json"), categoriesOut);
writeJson(path.join(OUT, "playlists.json"), playlistsOut);
writeJson(path.join(OUT, "questions.v2.json"), questions);

// ----------------------------------------------------------------------------
// CSV
// ----------------------------------------------------------------------------
function csvCell(v) {
  if (v == null) return "";
  if (Array.isArray(v)) v = v.join(" | ");
  else if (typeof v === "object") v = JSON.stringify(v);
  v = String(v);
  if (/[",\n]/.test(v)) return `"${v.replaceAll(`"`, `""`)}"`;
  return v;
}
const csvCols = [
  "public_id",
  "category_slug",
  "target_count",
  "body",
  "synonyms",
  "hint_seeds_ru",
  "frame_hint_ru",
  "complexity",
  "primary_class",
  "playlist_slugs",
  "onboarding_safe",
  "team_safe",
];
const csvLines = [csvCols.join(",")];
for (const q of questions) {
  csvLines.push(
    [
      q.public_id,
      q.category_slug,
      q.target_count,
      q.body,
      q.synonyms,
      q.hint_seeds_ru,
      q.frame_hint_ru,
      q.taxonomy?.complexity ?? "",
      q.taxonomy?.primary_class ?? "",
      q.playlist_slugs,
      q.onboarding_safe,
      q.team_safe,
    ]
      .map(csvCell)
      .join(","),
  );
}
writeText(path.join(OUT, "questions.v2.csv"), csvLines.join("\n") + "\n");

// ----------------------------------------------------------------------------
// seed.sql
// ----------------------------------------------------------------------------
function sqlEsc(v) {
  if (v == null) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  if (Array.isArray(v) || typeof v === "object")
    return `'${JSON.stringify(v).replaceAll("'", "''")}'::jsonb`;
  return `'${String(v).replaceAll("'", "''")}'`;
}

const sqlLines = [];
sqlLines.push("-- qs4me seed for Lovable / Supabase");
sqlLines.push("-- generated by tools/seed-builder/build.mjs");
sqlLines.push(`-- generated_at: ${new Date().toISOString()}`);
sqlLines.push("-- idempotent: re-runnable safely");
sqlLines.push("begin;");
sqlLines.push("");
sqlLines.push("-- categories ---------------------------------------------------------");
for (const c of categoriesOut) {
  sqlLines.push(
    `insert into categories (slug,name_ru,name_en,description_ru,description_en,color,icon,sort,is_system) values (${[
      c.slug,
      c.name_ru,
      c.name_en,
      c.description_ru,
      c.description_en,
      c.color,
      c.icon,
      c.sort,
      c.is_system,
    ]
      .map(sqlEsc)
      .join(", ")}) on conflict (slug) do nothing;`,
  );
}
sqlLines.push("");
sqlLines.push("-- playlists ----------------------------------------------------------");
for (const p of playlistsOut) {
  sqlLines.push(
    `insert into playlists (slug,category_slug,name_ru,name_en,description_ru,description_en,visibility,is_system) values (${[
      p.slug,
      p.category_slug,
      p.name_ru,
      p.name_en,
      p.description_ru,
      p.description_en,
      p.visibility,
      p.is_system,
    ]
      .map(sqlEsc)
      .join(", ")}) on conflict (slug) do nothing;`,
  );
}
sqlLines.push("");
sqlLines.push("-- questions ----------------------------------------------------------");
for (const q of questions) {
  sqlLines.push(
    `insert into questions (public_id,body,target_count,body_locale,language_hint,source,visibility,moderation_state,status,category_slug,playlist_slugs,synonyms,hint_seeds_ru,frame_hint_ru,taxonomy,editorial_flags,editor_note,is_featured,card_of_day_weight,onboarding_safe,team_safe,search_index_text_ru) values (${[
      q.public_id,
      q.body,
      q.target_count,
      q.body_locale,
      q.language_hint,
      q.source,
      q.visibility,
      q.moderation_state,
      q.status,
      q.category_slug,
      q.playlist_slugs,
      q.synonyms,
      q.hint_seeds_ru,
      q.frame_hint_ru,
      q.taxonomy,
      q.editorial_flags,
      q.editor_note,
      q.is_featured,
      q.card_of_day_weight,
      q.onboarding_safe,
      q.team_safe,
      q.search_index_text_ru,
    ]
      .map(sqlEsc)
      .join(", ")}) on conflict (public_id) do nothing;`,
  );
}
sqlLines.push("");
sqlLines.push("commit;");
writeText(path.join(OUT, "seed.sql"), sqlLines.join("\n") + "\n");

console.log(`\nWrote outputs to ${path.relative(REPO, OUT)}/`);
console.log("  categories.json");
console.log("  playlists.json");
console.log("  questions.v2.json");
console.log("  questions.v2.csv");
console.log("  seed.sql");
