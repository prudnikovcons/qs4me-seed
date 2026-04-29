# qs4.me — design reference

Reference design system generated in Claude Design. **Lovable should adopt this as the canonical visual system** and port to its TypeScript/Tailwind setup.

## Files

| file | purpose |
|---|---|
| `qs4-me-design.html` | self-contained HTML preview (open in any browser to see the full system) |
| `tokens.css` | the design tokens — **use as-is** in the Lovable build (it's framework-neutral CSS custom properties + a few utility classes). Drop into `src/index.css` and import the Google Fonts as shown. |
| `qs-components.jsx` | reference implementations: `CategoryChip`, `ComplexityPill`, `TeamSafeChip`, `HintSlot`, `PracticeCounter`, `QuestionCard`, `LibraryTile`, `PlaylistRow`, `StatTile`, `StreakStrip`, `BottomNav`, `BrandMark`, `Icon`. Also exports `CATEGORIES` (15 slugs → ru label + tone) and `COMPLEXITY` (5 RU labels). |
| `qs-screens.jsx` | reference implementations of full screens: `FeedScreen`, `LibraryScreen`, `SavedScreen`, `MeScreen`, `NewQuestionScreen`, `AuthScreen`, `OnboardingScreen`, `FilterSheetScreen`. |
| `ios-frame.jsx` | the 390×844 phone frame used in the canvas (cosmetic — do **not** ship in the actual app). |
| `design-canvas.jsx` | the canvas that arranges the screens. Not for the production app. |
| `tweaks-panel.jsx` | a serif/font/density tweaks panel used during design exploration. Not for production. |

## How to adopt in the Lovable React+Vite+Tailwind project

1. Copy `tokens.css` into `src/index.css` (replacing the shadcn/ui defaults). Keep the `@import url(...)` for Google Fonts at the top.
2. Use OKLCH custom properties via `var(--ink)`, `var(--acc-{category})`, etc. **Do not** translate to Tailwind theme colors — the design depends on per-category accents resolved at runtime by `--acc-{category}` / `--acc-{category}-bg`.
3. Port the JSX components to TypeScript verbatim. The class names (`qs-screen`, `qs-chip`, `qs-round`, `qs-primary`, `qs-tnum`, `qs-serif`, `qs-skel`, `qs-hairline`) are defined in `tokens.css` — keep them.
4. Replace inline-style `Icon` with `lucide-react` icons of equivalent semantics if you prefer (the inline SVGs are deliberately tight; lucide ones are 95% identical).
5. The font stack is **Newsreader** (serif body — main brand voice), **Inter Tight** (UI), **JetBrains Mono** (rare; for code only). Don't substitute.

## Visual rules (already enforced in the design)

- Serif body for the question itself, sans for chrome.
- One muted accent **per category** — never used as a giant fill, only for chips, the 1-px progress line, and the 3-px left rail of LibraryTile.
- 1-px hairline dividers + 1-px inner ring (`box-shadow: inset 0 0 0 1px var(--divider)`) instead of drop-shadows.
- 4–10 px border radii. `9999px` only on chip-pills and the +/- counter buttons.
- One micro-animation per interaction: 80 ms scale-press on counter, 300 ms `qs-draw-in` on completion. No springs, confetti, or sounds.
- Dark theme is warm-charcoal (`oklch(0.18 0.01 250)`), never pure black.

## Lowercase RU labels

Note that `CATEGORIES` in `qs-components.jsx` uses **lowercase** Russian labels (`утро`, `память`, `работа`, …), not capitalised. This is the intended typographic voice — tight, quiet, deliberately non-corporate. Keep it.

## Open the preview

Open `qs4-me-design.html` in any browser to see all screens at once on the canvas, with theme switcher, font picker, and density tweaks.
