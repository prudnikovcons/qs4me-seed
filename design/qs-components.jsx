/* qs-components.jsx — building blocks for qs4.me
   Globals: React, ReactDOM
   Exposes to window: CategoryChip, ComplexityPill, TeamSafeChip,
                      QuestionCard, PracticeCounter, HintSlot,
                      LibraryTile, PlaylistRow, StatTile, StreakStrip,
                      BottomNav, BrandMark, Icon, CATEGORIES, COMPLEXITY
*/

const CATEGORIES = {
  morning:      { ru: 'утро',         tone: 'sunrise' },
  memory:       { ru: 'память',       tone: 'amber' },
  work:         { ru: 'работа',       tone: 'cobalt' },
  creative:     { ru: 'творчество',   tone: 'coral' },
  reflection:   { ru: 'рефлексия',    tone: 'plum' },
  children:     { ru: 'дети',         tone: 'mint' },
  social:       { ru: 'социум',       tone: 'ocean' },
  philosophy:   { ru: 'философия',    tone: 'slate' },
  meta:         { ru: 'мета',         tone: 'violet' },
  epistemology: { ru: 'эпистемика',   tone: 'indigo' },
  modelling:    { ru: 'моделирование',tone: 'teal' },
  linguistics:  { ru: 'язык',         tone: 'rose' },
  senses:       { ru: 'чувства',      tone: 'blossom' },
  imagination:  { ru: 'воображение',  tone: 'lilac' },
  absurd:       { ru: 'абсурд',       tone: 'coral-2' },
};

const COMPLEXITY = ['база', 'рабочий', 'развивающий', 'продвинутый', 'предел'];

// ─────────────────────────────────────────────────────────────
// Tiny inline SVG icons (lucide-flavored, hand-tightened)
// ─────────────────────────────────────────────────────────────
function Icon({ name, size = 18, stroke = 'currentColor', strokeWidth = 1.5, style }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    style,
  };
  switch (name) {
    case 'filter':    return <svg {...props}><path d="M3 6h18M6 12h12M10 18h4"/></svg>;
    case 'bookmark':  return <svg {...props}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>;
    case 'branch':    return <svg {...props}><circle cx="6" cy="3" r="2"/><circle cx="6" cy="21" r="2"/><circle cx="18" cy="6" r="2"/><path d="M6 5v14M18 8v2a4 4 0 0 1-4 4H6"/></svg>;
    case 'flag':      return <svg {...props}><path d="M4 21V4M4 4h12l-2 4 2 4H4"/></svg>;
    case 'more':      return <svg {...props}><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>;
    case 'lightbulb': return <svg {...props}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.7.7 1 1.5 1 2.3v1h6v-1c0-.8.3-1.6 1-2.3A7 7 0 0 0 12 2z"/></svg>;
    case 'rotate':    return <svg {...props}><path d="M3 12a9 9 0 0 1 15.5-6.4L21 8M21 3v5h-5"/></svg>;
    case 'check':     return <svg {...props}><path d="M5 12l5 5L20 7"/></svg>;
    case 'plus':      return <svg {...props} strokeWidth="1.6"><path d="M12 5v14M5 12h14"/></svg>;
    case 'minus':     return <svg {...props} strokeWidth="1.6"><path d="M5 12h14"/></svg>;
    case 'arrow-r':   return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'x':         return <svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'sun':       return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>;
    case 'moon':      return <svg {...props}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>;
    case 'chevron-d': return <svg {...props}><path d="M6 9l6 6 6-6"/></svg>;
    case 'chevron-r': return <svg {...props}><path d="M9 6l6 6-6 6"/></svg>;
    default: return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Brand mark
// ─────────────────────────────────────────────────────────────
function BrandMark({ size = 14, color }) {
  return (
    <span style={{
      fontFamily: 'var(--serif)', fontSize: size, fontWeight: 500,
      letterSpacing: '-0.01em',
      color: color || 'var(--ink)',
      display: 'inline-flex', alignItems: 'baseline', gap: 0,
    }}>
      qs<span style={{ fontFamily: 'var(--sans)', fontWeight: 500, fontSize: size * 0.86, fontVariantNumeric: 'tabular-nums' }}>4</span>
      <span style={{ color: 'var(--ink-soft)' }}>.me</span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// CategoryChip
// ─────────────────────────────────────────────────────────────
function CategoryChip({ category, dot = true }) {
  const meta = CATEGORIES[category] || CATEGORIES.philosophy;
  return (
    <span className="qs-chip" style={{
      background: `var(--acc-${category}-bg)`,
      color: `var(--acc-${category})`,
    }}>
      {dot && (
        <span style={{
          width: 6, height: 6, borderRadius: 999,
          background: `var(--acc-${category})`, flex: '0 0 auto',
        }} />
      )}
      {meta.ru}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// ComplexityPill — 5 levels
// ─────────────────────────────────────────────────────────────
function ComplexityPill({ level = 1 /* 0..4 */ }) {
  return (
    <span className="qs-chip" style={{
      background: 'transparent',
      color: 'var(--ink-soft)',
      boxShadow: 'inset 0 0 0 1px var(--divider)',
      gap: 6,
    }}>
      <span style={{ display: 'inline-flex', gap: 2 }}>
        {[0,1,2,3,4].map(i => (
          <span key={i} style={{
            width: 4, height: 4, borderRadius: 999,
            background: i <= level ? 'var(--ink-soft)' : 'var(--divider)',
          }}/>
        ))}
      </span>
      {COMPLEXITY[level]}
    </span>
  );
}

function TeamSafeChip() {
  return (
    <span className="qs-chip" style={{
      background: 'transparent',
      color: 'var(--hint)',
      boxShadow: 'inset 0 0 0 1px var(--divider)',
    }}>team-safe</span>
  );
}

// ─────────────────────────────────────────────────────────────
// HintSlot
// ─────────────────────────────────────────────────────────────
function HintSlot({ open, seeds = [], frame = '', category = 'morning' }) {
  if (!open) return null;
  return (
    <div style={{
      borderTop: '1px solid var(--divider)',
      borderBottom: '1px solid var(--divider)',
      padding: '14px 0',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{
        fontFamily: 'var(--sans)', fontSize: 12.5,
        color: 'var(--hint)', letterSpacing: '0.02em',
        textTransform: 'uppercase', fontWeight: 500,
      }}>подсказка</div>
      <div style={{
        fontFamily: 'var(--serif)', fontSize: 15.5, lineHeight: 1.45,
        color: 'var(--ink-soft)', fontStyle: 'italic',
      }}>
        {frame}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {seeds.map((s, i) => (
          <span key={i} className="qs-chip" style={{
            background: `var(--acc-${category}-bg)`,
            color: `var(--acc-${category})`,
            height: 26, fontSize: 12.5, fontWeight: 450,
            fontFamily: 'var(--serif)',
            letterSpacing: 0,
          }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PracticeCounter
// ─────────────────────────────────────────────────────────────
function PracticeCounter({ count = 0, target = 10, category = 'morning', state = 'idle' /* idle | counting | done */ }) {
  const pct = Math.min(1, count / target);
  const drawing = state === 'done';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div className="qs-tnum" style={{
          fontFamily: 'var(--sans)', fontWeight: 450,
          fontSize: 48, lineHeight: 1, letterSpacing: '-0.02em',
          color: 'var(--ink)',
        }}>
          <span>{String(count).padStart(2, ' ')}</span>
          <span style={{ color: 'var(--hint)', margin: '0 6px', fontWeight: 400 }}>/</span>
          <span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>{target}</span>
        </div>
        {state === 'done' && (
          <span className="qs-chip" style={{
            background: `var(--acc-${category}-bg)`,
            color: `var(--acc-${category})`,
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            letterSpacing: 0, fontWeight: 500,
          }}>готово</span>
        )}
      </div>

      <div style={{
        position: 'relative',
        height: 2, background: 'var(--divider)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `var(--acc-${category})`,
          transformOrigin: 'left center',
          transform: drawing ? 'scaleX(1)' : `scaleX(${pct})`,
          transition: drawing ? 'transform 300ms cubic-bezier(0.2,0,0,1)' : 'transform 220ms cubic-bezier(0.2,0,0,1)',
          animation: drawing ? 'qs-draw-in 300ms var(--easing)' : undefined,
        }}/>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 4 }}>
        <button className="qs-round qs-round-ghost" aria-label="убрать" type="button">
          <Icon name="minus" size={20}/>
        </button>
        <div style={{
          fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--hint)',
          letterSpacing: '0.02em', textAlign: 'center', flex: 1,
        }}>
          {state === 'idle' && 'тапни +, чтобы засчитать ответ'}
          {state === 'counting' && `ещё ${target - count}`}
          {state === 'done' && 'продолжи или сохрани'}
        </div>
        <button className="qs-round qs-round-fill" aria-label="засчитать" type="button">
          <Icon name="plus" size={20}/>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// QuestionCard — the hero
// ─────────────────────────────────────────────────────────────
function QuestionCard({
  question,
  category = 'morning',
  complexity = 1,
  teamSafe = false,
  count = 0,
  target = 10,
  state = 'idle', // idle | counting | done | hint
  hint,
  serif = 'Newsreader',
  showAddMore = false,
}) {
  const isDone = state === 'done';
  const hintOpen = state === 'hint';
  return (
    <div className="qs-screen">
      {/* Top bar (status-bar safe area sits above this; iOS frame provides it) */}
      <div style={{
        padding: '14px 20px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <BrandMark size={14}/>
        <button type="button" style={{
          width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink-soft)', background: 'transparent',
        }}>
          <Icon name="filter" size={18}/>
        </button>
      </div>

      {/* Chips row */}
      <div style={{ padding: '14px 20px 0', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <CategoryChip category={category}/>
        <ComplexityPill level={complexity}/>
        {teamSafe && <TeamSafeChip/>}
      </div>

      {/* Question body — ~50% of card height, centered */}
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '20px 32px',
        position: 'relative',
      }}>
        <h1 className="qs-serif" style={{
          fontFamily: `'${serif}', var(--serif)`,
          margin: 0,
          fontSize: 28, lineHeight: 1.25,
          fontWeight: 420,
          color: 'var(--ink)',
          textWrap: 'balance',
          letterSpacing: '-0.005em',
        }}>
          {question}
        </h1>

        {/* Иначе + lightbulb */}
        <div style={{
          marginTop: 20,
          display: 'flex', alignItems: 'center', gap: 14,
          color: 'var(--ink-soft)',
        }}>
          <button type="button" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'transparent', color: 'var(--ink-soft)',
            fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 450,
            cursor: 'pointer',
          }}>
            <Icon name="rotate" size={14}/> иначе
          </button>
          <button type="button" aria-label="hint" style={{
            width: 28, height: 28,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: hintOpen ? `var(--acc-${category})` : 'var(--ink-soft)',
            background: hintOpen ? `var(--acc-${category}-bg)` : 'transparent',
            borderRadius: 6,
          }}>
            <Icon name="lightbulb" size={16}/>
          </button>
        </div>

        {isDone && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: 96, height: 96, borderRadius: 999,
              border: `1px solid var(--acc-${category})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: `var(--acc-${category})`,
              opacity: 0.55,
              animation: 'qs-draw-in 300ms var(--easing)',
            }}>
              <Icon name="check" size={40} strokeWidth={1.2}/>
            </div>
          </div>
        )}
      </div>

      {/* Counter + hint + primary */}
      <div style={{ padding: '0 24px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {hintOpen && hint && <HintSlot open seeds={hint.seeds} frame={hint.frame} category={category}/>}
        <PracticeCounter count={count} target={target} category={category} state={isDone ? 'done' : (count === 0 ? 'idle' : 'counting')}/>
        {isDone ? (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {showAddMore && (
              <button type="button" style={{
                height: 48, padding: '0 14px',
                background: 'transparent', color: 'var(--ink)',
                fontFamily: 'var(--sans)', fontSize: 13.5, fontWeight: 500,
                boxShadow: 'inset 0 0 0 1px var(--divider)',
                borderRadius: 'var(--r-button)',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>+ ещё</button>
            )}
            <button type="button" className="qs-primary" style={{ flex: 1 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Дальше <Icon name="arrow-r" size={16}/>
              </span>
            </button>
          </div>
        ) : (
          <button type="button" className="qs-primary" disabled={count === 0}>Готово</button>
        )}
      </div>

      {/* Floating action bar */}
      <div style={{
        display: 'flex', gap: 32, justifyContent: 'center',
        padding: '14px 0 6px',
        color: 'var(--ink-soft)',
      }}>
        {['bookmark','branch','flag','more'].map(n => (
          <button key={n} type="button" aria-label={n} style={{
            width: 28, height: 28, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'transparent', color: 'var(--ink-soft)',
          }}>
            <Icon name={n} size={18}/>
          </button>
        ))}
      </div>

      {/* Bottom nav text */}
      <div style={{
        padding: '8px 20px 12px',
        display: 'flex', justifyContent: 'center', gap: 28,
        fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 500,
        letterSpacing: '0.04em',
        color: 'var(--ink-soft)',
      }}>
        <span style={{ color: 'var(--ink)' }}>Поток</span>
        <span style={{ color: 'var(--divider)' }}>·</span>
        <span>Библиотека</span>
        <span style={{ color: 'var(--divider)' }}>·</span>
        <span>Я</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LibraryTile
// ─────────────────────────────────────────────────────────────
function LibraryTile({ category, name, desc, count }) {
  return (
    <div style={{
      borderLeft: `3px solid var(--acc-${category})`,
      borderTop: '1px solid var(--divider)',
      borderRight: '1px solid var(--divider)',
      borderBottom: '1px solid var(--divider)',
      borderRadius: '0 var(--r-card) var(--r-card) 0',
      padding: '14px 12px 14px 12px',
      background: 'var(--bg-card)',
      display: 'flex', flexDirection: 'column',
      minHeight: 110,
    }}>
      <div className="qs-serif" style={{
        fontSize: 18, fontWeight: 500, color: 'var(--ink)',
        lineHeight: 1.2, marginBottom: 2,
      }}>{name}</div>
      <div style={{ flex: 1 }}/>
      <div className="qs-hairline" style={{ margin: '8px 0' }}/>
      <div style={{
        fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--ink-soft)',
        lineHeight: 1.35, marginBottom: 6,
      }}>{desc}</div>
      <div className="qs-tnum" style={{
        fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--hint)',
        letterSpacing: '0.02em', textTransform: 'uppercase',
      }}>{count} вопросов</div>
    </div>
  );
}

function PlaylistRow({ name, desc, count }) {
  return (
    <div style={{
      padding: '14px 0',
      borderBottom: '1px solid var(--divider)',
      display: 'flex', alignItems: 'baseline', gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        <div className="qs-serif" style={{ fontSize: 16, color: 'var(--ink)', marginBottom: 2 }}>{name}</div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--ink-soft)' }}>{desc}</div>
      </div>
      <div className="qs-tnum" style={{
        fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--hint)',
        letterSpacing: '0.02em', minWidth: 32, textAlign: 'right',
      }}>{count}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// StatTile + StreakStrip
// ─────────────────────────────────────────────────────────────
function StatTile({ label, value, unit }) {
  return (
    <div style={{
      padding: '16px 14px',
      border: '1px solid var(--divider)',
      borderRadius: 'var(--r-card)',
      background: 'var(--bg-card)',
      display: 'flex', flexDirection: 'column', gap: 6,
      minHeight: 86,
    }}>
      <div style={{
        fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--hint)',
        letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500,
      }}>{label}</div>
      <div className="qs-tnum" style={{
        fontFamily: 'var(--sans)', fontSize: 32, fontWeight: 450,
        color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1,
        marginTop: 6,
      }}>
        {value}
        {unit && <span style={{ fontSize: 14, color: 'var(--ink-soft)', marginLeft: 4, fontWeight: 400 }}>{unit}</span>}
      </div>
    </div>
  );
}

function StreakStrip({ data = [], category = 'morning' }) {
  // data: array of 30 booleans
  const dots = data.length === 30 ? data : Array.from({length: 30}, (_, i) => i % 3 !== 1);
  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(30, 1fr)',
        gap: 4, alignItems: 'center', height: 22,
      }}>
        {dots.map((on, i) => (
          <div key={i} style={{
            height: on ? 14 : 6,
            borderRadius: 1.5,
            background: on ? `var(--acc-${category})` : 'var(--divider)',
            opacity: on ? (0.55 + (i / 30) * 0.45) : 1,
          }}/>
        ))}
      </div>
      <div style={{
        marginTop: 8, display: 'flex', justifyContent: 'space-between',
        fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--hint)',
        letterSpacing: '0.02em',
      }}>
        <span>30 дней назад</span>
        <span>сегодня</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BottomNav (mobile)
// ─────────────────────────────────────────────────────────────
function BottomNav({ active = 'feed' }) {
  const items = [
    { id: 'feed',    label: 'Поток' },
    { id: 'library', label: 'Библиотека' },
    { id: 'me',      label: 'Я' },
  ];
  return (
    <div style={{
      padding: '14px 20px 18px',
      display: 'flex', justifyContent: 'center', gap: 28,
      fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 500,
      letterSpacing: '0.04em',
    }}>
      {items.map((it, i) => (
        <React.Fragment key={it.id}>
          <span style={{ color: active === it.id ? 'var(--ink)' : 'var(--ink-soft)' }}>
            {it.label}
          </span>
          {i < items.length - 1 && <span style={{ color: 'var(--divider)' }}>·</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

Object.assign(window, {
  CATEGORIES, COMPLEXITY,
  Icon, BrandMark,
  CategoryChip, ComplexityPill, TeamSafeChip,
  HintSlot, PracticeCounter, QuestionCard,
  LibraryTile, PlaylistRow, StatTile, StreakStrip, BottomNav,
});
