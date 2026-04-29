/* qs-screens.jsx — composed full-bleed screens
   Globals: React, ReactDOM, IOSDevice
   Uses: QuestionCard, LibraryTile, PlaylistRow, StatTile, StreakStrip, CategoryChip, ComplexityPill, BottomNav, Icon, BrandMark, CATEGORIES
   Exposes to window: SCREENS_DATA, FeedScreen, LibraryScreen, SavedScreen, MeScreen,
                      NewQuestionScreen, AuthScreen, OnboardingScreen, FilterSheetScreen
*/

const SAMPLE_QUESTIONS = {
  morning_hero: {
    text: 'Назови десять вещей, которые ты замечаешь только утром.',
    cat: 'morning', cx: 1, target: 10,
  },
  memory: {
    text: 'Какие пять запахов мгновенно возвращают тебя в детство?',
    cat: 'memory', cx: 1, target: 5,
  },
  reflection: {
    text: 'О чём ты молчишь чаще всего — и почему именно об этом?',
    cat: 'reflection', cx: 3, target: 7,
  },
  creative: {
    text: 'Десять способов закончить эту строчку: «Если бы дом умел…»',
    cat: 'creative', cx: 2, target: 10,
  },
  philosophy: {
    text: 'Что отличает «достаточно» от «мало»?',
    cat: 'philosophy', cx: 3, target: 5,
  },
  imagination: {
    text: 'Семь предметов, которые могли бы существовать, но не существуют.',
    cat: 'imagination', cx: 2, target: 7,
  },
};

const HINT_EXAMPLE = {
  frame: 'попробуй идти по чувствам — что слышно, что пахнет, что ещё не проснулось.',
  seeds: ['пар над кружкой', 'тишина двора', 'свет на стене', 'шорох тапок'],
};

// ─────────────────────────────────────────────────────────────
// Wrap a screen in an IOSDevice
// ─────────────────────────────────────────────────────────────
function Phone({ children, dark = false, keyboard = false, w = 390, h = 844 }) {
  return (
    <IOSDevice width={w} height={h} dark={dark} keyboard={keyboard}>
      {/* push content below status bar (~44px) */}
      <div style={{ height: 44 }}/>
      <div data-theme={dark ? 'dark' : 'light'} style={{ height: 'calc(100% - 44px)', position: 'relative' }}>
        {children}
      </div>
    </IOSDevice>
  );
}

// ─────────────────────────────────────────────────────────────
// /feed — wrapper around QuestionCard
// ─────────────────────────────────────────────────────────────
function FeedScreen(props) {
  const q = SAMPLE_QUESTIONS[props.q || 'morning_hero'];
  const merged = {
    question: q.text,
    category: q.cat,
    complexity: q.cx,
    target: q.target,
    hint: HINT_EXAMPLE,
    teamSafe: false,
    ...props,
  };
  return (
    <Phone dark={props.dark}>
      <QuestionCard {...merged}/>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// /library
// ─────────────────────────────────────────────────────────────
const LIBRARY_CATS = [
  { c: 'morning',     name: 'Утро',         desc: 'Пять минут после пробуждения.', count: 24 },
  { c: 'memory',      name: 'Память',       desc: 'То, что хранит тело.',           count: 38 },
  { c: 'work',        name: 'Работа',       desc: 'Дело, в котором ты варишься.',   count: 51 },
  { c: 'creative',    name: 'Творчество',   desc: 'Когда хочется сделать.',         count: 33 },
  { c: 'reflection',  name: 'Рефлексия',    desc: 'Долгие, тихие.',                 count: 47 },
  { c: 'children',    name: 'Дети',         desc: 'Можно спрашивать вместе.',       count: 19 },
  { c: 'social',      name: 'Социум',       desc: 'Среди людей и стен.',            count: 28 },
  { c: 'philosophy',  name: 'Философия',    desc: 'Старые сомнения.',               count: 42 },
];

const PLAYLISTS = [
  { name: 'Семь утр',          desc: 'По одному вопросу на каждое утро недели.', count: 7 },
  { name: 'Тихий вечер',       desc: 'Перед сном. Никакой работы.',              count: 12 },
  { name: 'С друзьями',        desc: 'Вопросы для долгого ужина.',                count: 24 },
  { name: 'Я и ребёнок',       desc: 'Подходят с шести лет.',                     count: 18 },
  { name: 'На перерыве',       desc: 'Пять минут — и обратно.',                   count: 9 },
];

function LibraryScreen({ dark }) {
  return (
    <Phone dark={dark}>
      <div className="qs-screen">
        {/* header */}
        <div style={{ padding: '14px 20px 8px' }}>
          <BrandMark size={14}/>
          <h1 className="qs-serif" style={{
            margin: '14px 0 4px', fontSize: 28, fontWeight: 500, color: 'var(--ink)',
            letterSpacing: '-0.01em',
          }}>Библиотека</h1>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-soft)' }}>
            568 вопросов · 12 подборок
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px 20px' }}>
          {/* section label */}
          <div style={{
            fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--hint)',
            letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500,
            margin: '8px 0 10px',
          }}>Категории</div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}>
            {LIBRARY_CATS.map(t => <LibraryTile key={t.c} category={t.c} name={t.name} desc={t.desc} count={t.count}/>)}
          </div>

          <div style={{
            fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--hint)',
            letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500,
            margin: '24px 0 4px',
          }}>Подборки</div>
          <div>
            {PLAYLISTS.map(p => <PlaylistRow key={p.name} name={p.name} desc={p.desc} count={p.count}/>)}
          </div>
        </div>
        <BottomNav active="library"/>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// /saved
// ─────────────────────────────────────────────────────────────
const SAVED_ITEMS = [
  { text: 'Назови десять вещей, которые ты замечаешь только утром.', cat: 'morning',     cx: 1, when: 'вчера' },
  { text: 'О чём ты молчишь чаще всего — и почему именно об этом?',  cat: 'reflection',  cx: 3, when: '3 дня назад' },
  { text: 'Что отличает «достаточно» от «мало»?',                    cat: 'philosophy',  cx: 3, when: 'на прошлой неделе' },
  { text: 'Семь предметов, которые могли бы существовать, но не существуют.', cat: 'imagination', cx: 2, when: '12 апреля' },
];

function SavedCard({ item, peek }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--divider)',
      borderRadius: 'var(--r-card)',
      padding: '16px 18px 18px',
      display: 'flex', flexDirection: 'column', gap: 14,
      minHeight: peek ? 120 : 280,
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <CategoryChip category={item.cat}/>
        <ComplexityPill level={item.cx}/>
      </div>
      <div className="qs-serif" style={{
        fontSize: 22, lineHeight: 1.3, fontWeight: 420, color: 'var(--ink)',
        textWrap: 'balance', flex: 1,
      }}>{item.text}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--hint)' }}>
          сохранено · {item.when}
        </div>
        <div style={{ display: 'flex', gap: 14, color: 'var(--ink-soft)' }}>
          <Icon name="branch" size={16}/>
          <Icon name="more" size={16}/>
        </div>
      </div>
    </div>
  );
}

function SavedScreen({ dark, empty = false }) {
  return (
    <Phone dark={dark}>
      <div className="qs-screen">
        <div style={{ padding: '14px 20px 8px' }}>
          <BrandMark size={14}/>
          <h1 className="qs-serif" style={{
            margin: '14px 0 4px', fontSize: 28, fontWeight: 500, color: 'var(--ink)',
            letterSpacing: '-0.01em',
          }}>Сохранённое</h1>
          {!empty && (
            <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-soft)' }}>
              {SAVED_ITEMS.length} вопросов
            </div>
          )}
        </div>
        {empty ? (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 48px',
          }}>
            <div className="qs-serif" style={{
              fontSize: 18, fontWeight: 400, color: 'var(--ink-soft)',
              fontStyle: 'italic', textAlign: 'center', lineHeight: 1.4,
              textWrap: 'balance',
            }}>
              Сохрани вопрос на ленте — он появится здесь.
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SavedCard item={SAVED_ITEMS[0]}/>
            <SavedCard item={SAVED_ITEMS[1]} peek/>
            <SavedCard item={SAVED_ITEMS[2]} peek/>
          </div>
        )}
        <BottomNav active="library"/>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// /me
// ─────────────────────────────────────────────────────────────
function CategoryBar({ category, label, value, max }) {
  const pct = (value / max) * 100;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
      borderBottom: '1px solid var(--divider)',
    }}>
      <div style={{ flex: '0 0 90px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 6, height: 6, borderRadius: 999,
          background: `var(--acc-${category})`,
        }}/>
        <span className="qs-serif" style={{ fontSize: 14, color: 'var(--ink)' }}>{label}</span>
      </div>
      <div style={{
        flex: 1, height: 4,
        background: 'var(--divider)', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `var(--acc-${category})`,
        }}/>
      </div>
      <span className="qs-tnum" style={{
        fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-soft)',
        minWidth: 32, textAlign: 'right',
      }}>{value}</span>
    </div>
  );
}

function MeScreen({ dark, name = 'Аня' }) {
  return (
    <Phone dark={dark}>
      <div className="qs-screen">
        <div style={{ padding: '14px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BrandMark size={14}/>
          <Icon name="more" size={18} style={{ color: 'var(--ink-soft)' }}/>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 16px' }}>
          <h1 className="qs-serif" style={{
            margin: 0, fontSize: 26, lineHeight: 1.25, fontWeight: 420,
            color: 'var(--ink)', letterSpacing: '-0.005em', textWrap: 'balance',
          }}>
            Доброе утро, {name}.
          </h1>
          <div style={{
            fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-soft)',
            marginTop: 6,
          }}>уже пятый день подряд.</div>

          {/* streak */}
          <div style={{ marginTop: 28 }}>
            <div style={{
              fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--hint)',
              letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500,
              marginBottom: 12,
            }}>Серия</div>
            <StreakStrip
              data={[true,true,false,true,true,true,false,true,true,true,true,true,false,false,true,true,true,false,true,true,true,true,true,true,true,false,true,true,true,true]}
              category="morning"/>
          </div>

          {/* numbers */}
          <div style={{
            marginTop: 28,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          }}>
            <StatTile label="Сегодня" value="7"/>
            <StatTile label="Эта неделя" value="42"/>
            <StatTile label="Всего" value="358"/>
            <StatTile label="Серия" value="5" unit="дней"/>
          </div>

          {/* top categories */}
          <div style={{ marginTop: 28 }}>
            <div style={{
              fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--hint)',
              letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500,
              marginBottom: 4,
            }}>Чаще всего</div>
            <CategoryBar category="morning"     label="утро"      value={84} max={100}/>
            <CategoryBar category="reflection"  label="рефлексия" value={61} max={100}/>
            <CategoryBar category="creative"    label="творчество" value={42} max={100}/>
          </div>
        </div>
        <BottomNav active="me"/>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// /questions/new
// ─────────────────────────────────────────────────────────────
function NewQuestionScreen({ dark }) {
  const cats = ['morning','memory','work','creative','reflection','children','social','philosophy','imagination'];
  return (
    <Phone dark={dark}>
      <div className="qs-screen">
        <div style={{
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid var(--divider)',
        }}>
          <button type="button" style={{ background: 'transparent', color: 'var(--ink-soft)', fontFamily: 'var(--sans)', fontSize: 14 }}>
            Отмена
          </button>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
            Новый вопрос
          </div>
          <button type="button" style={{
            background: 'transparent', color: 'var(--ink-soft)',
            fontFamily: 'var(--sans)', fontSize: 14, opacity: 0.4,
          }}>Сохранить</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 28px' }}>
          {/* Big serif input */}
          <div style={{
            fontFamily: 'var(--serif)', fontSize: 24, lineHeight: 1.3, fontWeight: 420,
            color: 'var(--ink)', minHeight: 90,
            borderBottom: '1px solid var(--divider)', paddingBottom: 14,
          }}>
            Назови пять способов остаться внимательным,
            <span style={{ color: 'var(--hint)' }}> когда устал.</span>
            <span style={{
              display: 'inline-block', width: 1, height: 22, marginLeft: 2,
              background: 'var(--ink)', verticalAlign: 'text-bottom',
              animation: 'qs-pulse 1s var(--easing) infinite',
            }}/>
          </div>

          {/* Target count */}
          <div style={{ marginTop: 24 }}>
            <div style={{
              fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--hint)',
              letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500,
              marginBottom: 10,
            }}>Сколько ответов</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[3,5,7,10].map(n => (
                <button key={n} type="button" style={{
                  flex: 1, height: 44,
                  background: n === 5 ? 'var(--ink)' : 'transparent',
                  color: n === 5 ? 'var(--bg)' : 'var(--ink)',
                  boxShadow: n === 5 ? 'none' : 'inset 0 0 0 1px var(--divider)',
                  borderRadius: 'var(--r-button)',
                  fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 15,
                  fontVariantNumeric: 'tabular-nums',
                }}>{n}</button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div style={{ marginTop: 24 }}>
            <div style={{
              fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--hint)',
              letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500,
              marginBottom: 10,
            }}>Категория</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {cats.map(c => {
                const active = c === 'reflection';
                return (
                  <span key={c} className="qs-chip" style={{
                    height: 28, fontSize: 12.5, padding: '0 10px',
                    background: active ? `var(--acc-${c})` : `var(--acc-${c}-bg)`,
                    color: active ? 'var(--bg)' : `var(--acc-${c})`,
                    cursor: 'pointer', fontWeight: 500,
                  }}>
                    {CATEGORIES[c].ru}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Complexity slider */}
          <div style={{ marginTop: 24 }}>
            <div style={{
              fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--hint)',
              letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500,
              marginBottom: 10, display: 'flex', justifyContent: 'space-between',
            }}>
              <span>Сложность</span>
              <span style={{
                color: 'var(--ink)', textTransform: 'none', letterSpacing: 0,
                fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12.5,
              }}>развивающий</span>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', height: 28 }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{
                  flex: 1, height: i <= 2 ? 8 : 4,
                  background: i <= 2 ? 'var(--ink)' : 'var(--divider)',
                  borderRadius: 1.5,
                }}/>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div style={{
            marginTop: 24,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 0',
            borderTop: '1px solid var(--divider)',
            borderBottom: '1px solid var(--divider)',
          }}>
            <div>
              <div className="qs-serif" style={{ fontSize: 15, color: 'var(--ink)' }}>Видимость</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                только мне
              </div>
            </div>
            {/* Toggle */}
            <div style={{
              width: 44, height: 26, borderRadius: 999,
              background: 'var(--divider)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 3, left: 3,
                width: 20, height: 20, borderRadius: 999,
                background: 'var(--bg-card)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}/>
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// /auth
// ─────────────────────────────────────────────────────────────
function AuthScreen({ dark }) {
  return (
    <Phone dark={dark}>
      <div className="qs-screen" style={{ justifyContent: 'center' }}>
        <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <BrandMark size={16}/>
          <div>
            <h1 className="qs-serif" style={{
              margin: 0, fontSize: 32, lineHeight: 1.2, fontWeight: 420,
              color: 'var(--ink)', letterSpacing: '-0.01em',
            }}>Зайди в qs4.me.</h1>
            <div style={{
              fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink-soft)',
              marginTop: 10, lineHeight: 1.5, textWrap: 'balance',
            }}>
              Один вопрос. Тихий счёт. Никаких лент.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Email" value="anya@qs4.me"/>
            <Field label="Пароль" value="••••••••" type="password"/>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
            <button type="button" className="qs-primary">Войти</button>
            <button type="button" style={{
              background: 'transparent', color: 'var(--ink-soft)',
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 450,
              padding: 8,
            }}>или продолжи как гость</button>
          </div>
        </div>
      </div>
    </Phone>
  );
}

function Field({ label, value, type }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{
        fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--hint)',
        letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500,
      }}>{label}</span>
      <div style={{
        height: 40, padding: '0 0 8px',
        borderBottom: '1px solid var(--divider)',
        display: 'flex', alignItems: 'flex-end',
      }}>
        <span style={{
          fontFamily: type === 'password' ? 'var(--sans)' : 'var(--serif)',
          fontSize: type === 'password' ? 16 : 17,
          color: 'var(--ink)',
          letterSpacing: type === 'password' ? '0.2em' : '-0.005em',
        }}>{value}</span>
      </div>
    </label>
  );
}

// ─────────────────────────────────────────────────────────────
// Onboarding — 3-card walkthrough
// ─────────────────────────────────────────────────────────────
function OnboardingScreen({ dark, step = 1 }) {
  const isStep1 = step === 1;
  const isStep2 = step === 2;
  const isStep3 = step === 3;
  return (
    <Phone dark={dark}>
      <div className="qs-screen">
        {/* Progress */}
        <div style={{
          padding: '14px 20px 0', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {[1,2,3].map(s => (
              <div key={s} style={{
                width: s === step ? 24 : 6, height: 4, borderRadius: 1,
                background: s <= step ? 'var(--ink)' : 'var(--divider)',
                transition: 'width 200ms var(--easing)',
              }}/>
            ))}
          </div>
          <button type="button" style={{
            background: 'transparent', color: 'var(--ink-soft)',
            fontFamily: 'var(--sans)', fontSize: 13,
          }}>пропустить</button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 32px' }}>
          {isStep1 && (
            <>
              <h1 className="qs-serif" style={{
                margin: 0, fontSize: 28, lineHeight: 1.25, fontWeight: 420,
                color: 'var(--ink)', textWrap: 'balance', letterSpacing: '-0.005em',
              }}>
                Назови три вещи, которые ты замечаешь прямо сейчас.
              </h1>
              <div style={{
                marginTop: 14, fontFamily: 'var(--sans)', fontSize: 13.5,
                color: 'var(--ink-soft)', lineHeight: 1.5,
              }}>
                Не записывай. Просто посчитай в голове. Когда заметишь — нажми «+».
              </div>
            </>
          )}
          {isStep2 && (
            <>
              <h1 className="qs-serif" style={{
                margin: 0, fontSize: 26, lineHeight: 1.3, fontWeight: 420,
                color: 'var(--ink)', textWrap: 'balance',
              }}>
                Хорошо. Так и работает qs4.me.
              </h1>
              <div style={{
                marginTop: 14, fontFamily: 'var(--sans)', fontSize: 13.5,
                color: 'var(--ink-soft)', lineHeight: 1.55, textWrap: 'balance',
              }}>
                Один вопрос — целый экран. Считаешь ответы в голове, проводишь пальцем дальше. Никто не считает за тебя.
              </div>
            </>
          )}
          {isStep3 && (
            <>
              <h1 className="qs-serif" style={{
                margin: 0, fontSize: 26, lineHeight: 1.3, fontWeight: 420,
                color: 'var(--ink)', textWrap: 'balance',
              }}>
                Когда нужен сдвиг — нажми «иначе» или лампочку.
              </h1>
              <div style={{
                marginTop: 14, fontFamily: 'var(--sans)', fontSize: 13.5,
                color: 'var(--ink-soft)', lineHeight: 1.55, textWrap: 'balance',
              }}>
                «Иначе» переформулирует вопрос. Лампочка даёт мягкую подсказку — пару направлений, чтобы сдвинуться.
              </div>
            </>
          )}
        </div>

        {isStep1 && (
          <div style={{ padding: '0 24px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <PracticeCounter count={2} target={3} category="morning" state="counting"/>
            <button type="button" className="qs-primary" disabled>Готово</button>
          </div>
        )}
        {!isStep1 && (
          <div style={{ padding: '0 24px 8px' }}>
            <button type="button" className="qs-primary">
              {isStep3 ? 'Начать' : 'Дальше'}
            </button>
          </div>
        )}

        <div style={{ padding: '14px 20px 12px', display: 'flex', justifyContent: 'center' }}>
          <BrandMark size={12}/>
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// Filter bottom sheet
// ─────────────────────────────────────────────────────────────
function FilterSheetScreen({ dark }) {
  const cats = Object.keys(CATEGORIES);
  return (
    <Phone dark={dark}>
      {/* Dim background — show feed underneath */}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)' }}>
        <div style={{ padding: '14px 20px 0', display: 'flex', justifyContent: 'space-between' }}>
          <BrandMark size={14}/>
          <Icon name="filter" size={18} style={{ color: 'var(--ink)' }}/>
        </div>
        <div style={{ padding: '24px 32px', opacity: 0.35 }}>
          <CategoryChip category="morning"/>
          <h1 className="qs-serif" style={{ marginTop: 16, fontSize: 26, lineHeight: 1.3, color: 'var(--ink)' }}>
            Назови десять вещей, которые ты замечаешь только утром.
          </h1>
        </div>
        {/* Dim */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(20, 20, 25, 0.32)',
        }}/>
      </div>

      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'var(--bg-card)',
        borderRadius: '14px 14px 0 0',
        padding: '8px 0 24px',
        boxShadow: '0 -1px 0 var(--divider)',
        maxHeight: '80%',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--divider)' }}/>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 20px 14px',
        }}>
          <div className="qs-serif" style={{ fontSize: 18, fontWeight: 500, color: 'var(--ink)' }}>Фильтры</div>
          <button type="button" style={{
            background: 'transparent', color: 'var(--ink-soft)',
            fontFamily: 'var(--sans)', fontSize: 13,
          }}>сбросить</button>
        </div>
        <div style={{ overflow: 'auto', padding: '0 20px', flex: 1 }}>
          <div style={{
            fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--hint)',
            letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500,
            marginBottom: 10,
          }}>Категории</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
            {cats.map((c, i) => {
              const active = i < 4;
              return (
                <span key={c} className="qs-chip" style={{
                  height: 28, fontSize: 12.5, padding: '0 10px',
                  background: active ? `var(--acc-${c})` : `var(--acc-${c}-bg)`,
                  color: active ? 'var(--bg)' : `var(--acc-${c})`,
                  fontWeight: 500,
                }}>{CATEGORIES[c].ru}</span>
              );
            })}
          </div>

          <div style={{
            fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--hint)',
            letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500,
            marginBottom: 10,
          }}>Сложность</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {COMPLEXITY.map((l, i) => (
              <span key={l} className="qs-chip" style={{
                flex: 1, justifyContent: 'center',
                height: 30, fontSize: 12, padding: 0,
                background: i <= 2 ? 'var(--ink)' : 'transparent',
                color: i <= 2 ? 'var(--bg)' : 'var(--ink-soft)',
                boxShadow: i <= 2 ? 'none' : 'inset 0 0 0 1px var(--divider)',
                fontWeight: 500,
              }}>{l}</span>
            ))}
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 0', borderTop: '1px solid var(--divider)',
          }}>
            <span className="qs-serif" style={{ fontSize: 14, color: 'var(--ink)' }}>только team-safe</span>
            <div style={{
              width: 44, height: 26, borderRadius: 999, background: 'var(--ink)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 3, right: 3,
                width: 20, height: 20, borderRadius: 999,
                background: 'var(--bg-card)',
              }}/>
            </div>
          </div>
        </div>
        <div style={{ padding: '12px 20px 0' }}>
          <button type="button" className="qs-primary">Показать 142 вопроса</button>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  SAMPLE_QUESTIONS, HINT_EXAMPLE,
  Phone,
  FeedScreen, LibraryScreen, SavedScreen, MeScreen,
  NewQuestionScreen, AuthScreen, OnboardingScreen, FilterSheetScreen,
});
