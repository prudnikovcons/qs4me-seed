#!/usr/bin/env node
// Lightweight validator for question-taxonomy/exports/lovable/questions.v2.json.
// No external deps — checks the invariants we care about (PK uniqueness,
// category/playlist references, target_count range, body length, hint counts).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");
const OUT = path.join(REPO, "question-taxonomy", "exports", "lovable");

const cats = JSON.parse(fs.readFileSync(path.join(OUT, "categories.json"), "utf8"));
const playlists = JSON.parse(fs.readFileSync(path.join(OUT, "playlists.json"), "utf8"));
const qs = JSON.parse(fs.readFileSync(path.join(OUT, "questions.v2.json"), "utf8"));

const catSlugs = new Set(cats.map((c) => c.slug));
const playlistSlugs = new Set(playlists.map((p) => p.slug));

const errors = [];
const warnings = [];

if (qs.length !== 1500) errors.push(`expected 1500 questions, got ${qs.length}`);

const seenPid = new Set();
const seenBody = new Set();
let withSyn = 0, withSeeds = 0, withFrame = 0;

for (const q of qs) {
  if (!q.public_id || seenPid.has(q.public_id))
    errors.push(`duplicate or missing public_id: ${q.public_id}`);
  seenPid.add(q.public_id);

  if (!q.body || q.body.length < 10)
    errors.push(`${q.public_id}: body too short`);

  const norm = q.body.toLowerCase().replace(/\s+/g, " ").trim();
  if (seenBody.has(norm))
    errors.push(`${q.public_id}: duplicate body: ${q.body.slice(0, 50)}…`);
  seenBody.add(norm);

  if (!Number.isInteger(q.target_count) || q.target_count < 1 || q.target_count > 100)
    errors.push(`${q.public_id}: bad target_count=${q.target_count}`);

  if (!catSlugs.has(q.category_slug))
    errors.push(`${q.public_id}: unknown category_slug=${q.category_slug}`);

  for (const ps of q.playlist_slugs ?? []) {
    if (!playlistSlugs.has(ps))
      errors.push(`${q.public_id}: unknown playlist_slug=${ps}`);
  }

  if (!q.taxonomy?.primary_class)
    warnings.push(`${q.public_id}: no primary_class`);
  if (!q.taxonomy?.complexity)
    warnings.push(`${q.public_id}: no complexity`);

  if ((q.synonyms ?? []).length > 0) withSyn++;
  if ((q.hint_seeds_ru ?? []).length > 0) withSeeds++;
  if (q.frame_hint_ru) withFrame++;
}

const tally = {};
for (const q of qs) tally[q.category_slug] = (tally[q.category_slug] ?? 0) + 1;

console.log("Distribution:");
for (const slug of Object.keys(tally).sort()) {
  console.log(`  ${slug.padEnd(13)} ${tally[slug]}`);
}
console.log(`Total: ${qs.length}`);
console.log(
  `Hint coverage: synonyms=${withSyn}/${qs.length} (${((withSyn / qs.length) * 100) | 0}%), seeds=${withSeeds}/${qs.length} (${((withSeeds / qs.length) * 100) | 0}%), frame=${withFrame}/${qs.length} (${((withFrame / qs.length) * 100) | 0}%)`,
);

if (warnings.length) {
  console.warn(`\n${warnings.length} warnings (showing first 5):`);
  for (const w of warnings.slice(0, 5)) console.warn(`  ! ${w}`);
}

if (errors.length) {
  console.error(`\n${errors.length} ERRORS (showing first 10):`);
  for (const e of errors.slice(0, 10)) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log("\nOK ✓");
