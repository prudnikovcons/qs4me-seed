// Template definitions for seed generation.
// Each template is a sentence with {slot} placeholders + per-slot value lists.
// Cartesian product → many candidates per template; we sample to fit per-category quotas.
//
// Style rules:
//  • Russian, RU-first, native phrasing.
//  • Each variant must START with a number (parser pulls target_count from prefix)
//    OR contain a number that the fallback parser catches.
//  • Variants must be countable retrieval/generation, not essay prompts.
//  • No more than ~22 words per variant.

// Shared slot pools (compose per template)
const N_SHORT = [3, 5, 7];
const N_MID = [3, 5, 7, 10];

// ============================================================================
export const TEMPLATES = {
  // ============================== MORNING ==============================
  morning: [
    {
      tpl: "{N} {thing}, которые могут задать тон сегодняшнему дню.",
      class: "generative", complexity: "basic", time: "future",
      N: N_SHORT,
      thing: ["намерений", "мелочей", "решений", "вопросов к себе", "благодарностей", "движений", "звуков утра", "телесных ощущений", "взглядов в окно", "первых мыслей"],
    },
    {
      tpl: "Вспомни {N} {thing}, на которые ты обычно не обращаешь внимания утром.",
      class: "retrieval", complexity: "basic", time: "present",
      N: N_MID,
      thing: ["запахов", "звуков", "движений", "ощущений в теле", "мыслей", "взглядов на знакомые вещи", "мелких удовольствий", "касаний", "температурных перепадов"],
    },
    {
      tpl: "{N} вещей, которые я хочу пронести через сегодняшний день.",
      class: "projecting", complexity: "working", time: "present_to_future",
      N: N_SHORT,
    },
    {
      tpl: "Назови {N} способов мягко начать день, не открывая телефон.",
      class: "generative", complexity: "basic", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {scope}, которым стоит сказать «доброе утро» внутри себя.",
      class: "reflexive", complexity: "basic", time: "present",
      N: N_SHORT,
      scope: ["частей тела", "ролей, в которые ты войдёшь сегодня", "людей, кого ты вспомнил с утра", "мест, где ты будешь сегодня", "задач, которые тебя ждут", "страхов, что просыпаются вместе с тобой"],
    },
    {
      tpl: "{N} {thing}, по которым ты узнаёшь, что день начался хорошо.",
      class: "evaluative", complexity: "working", time: "present",
      N: N_SHORT,
      thing: ["признаков", "ощущений", "мелочей", "внутренних маркеров", "движений", "слов", "звуков"],
    },
    {
      tpl: "{N} простых ритуалов, которые помогают тебе вернуться к себе утром.",
      class: "retrieval", complexity: "working", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "Какие {N} вопросов задаёт себе утро, прежде чем стать днём?",
      class: "meta_generative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {body_part}, через которые ты сейчас чувствуешь, что проснулся.",
      class: "descriptive", complexity: "basic", time: "present",
      N: N_SHORT,
      body_part: ["мест в теле", "ощущений", "точек напряжения", "точек тепла", "точек холода", "лёгких пробуждений"],
    },
    {
      tpl: "Назови {N} {thing}, без которых сегодняшний день уже не будет твоим.",
      class: "evaluative", complexity: "working", time: "present_to_future",
      N: N_SHORT,
      thing: ["встреч", "решений", "разговоров", "дел", "звонков", "коротких пауз"],
    },
    {
      tpl: "{N} вопросов, которые я хочу удержать в фоне на этот день.",
      class: "meta_generative", complexity: "developmental", time: "present_to_future",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, на которые ты опираешься, когда ещё не вошёл в день.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
      thing: ["опор", "людей", "образов", "фраз", "телесных привычек", "звуков", "ритмов"],
    },
    {
      tpl: "{N} {thing}, на которые я хочу обратить внимание до полудня.",
      class: "projecting", complexity: "basic", time: "present_to_future",
      N: N_SHORT,
      thing: ["сигналов тела", "встреч", "слов", "идей", "людей", "мест", "пауз"],
    },
    {
      tpl: "{N} мелочей, которые могут смягчить сегодняшнее утро.",
      class: "generative", complexity: "basic", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вещей, которым я благодарен ещё до завтрака.",
      class: "retrieval", complexity: "basic", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, которые я хочу убрать из своего утра.",
      class: "evaluative", complexity: "working", time: "present_to_future",
      N: N_SHORT,
      thing: ["привычек", "звуков", "сообщений", "тревог", "мелких дел", "автоматизмов"],
    },
  ],

  // ============================== MEMORY ==============================
  memory: [
    {
      tpl: "Вспомни {N} {thing} {time_ago}.",
      class: "retrieval", complexity: "basic", time: "past",
      N: N_MID,
      thing: ["событий", "разговоров", "встреч", "решений", "переключений внимания", "коротких эпизодов", "мыслей", "ощущений", "запоминающихся фраз"],
      time_ago: ["вчерашнего дня", "последней недели", "сегодняшнего утра", "позавчерашнего вечера", "последних трёх дней", "прошлого выходного", "прошлого месяца", "прошлой пятницы"],
    },
    {
      tpl: "{N} человек, которых ты помнишь {memory_axis}, но больше не встречал.",
      class: "retrieval", complexity: "working", time: "past",
      N: N_MID,
      memory_axis: ["из детства", "из школы", "с первой работы", "со студенческих лет", "из старого двора", "из переходного периода", "из лагеря", "из старого проекта"],
    },
    {
      tpl: "Назови {N} {sense_object}, которые мгновенно возвращают тебя в детство.",
      class: "retrieval", complexity: "basic", time: "past",
      N: N_MID,
      sense_object: ["запахов", "звуков", "вкусов", "тактильных ощущений", "мелодий", "цветов", "интонаций", "погодных запахов"],
    },
    {
      tpl: "{N} мест, в которых ты когда-то чувствовал себя {state}.",
      class: "retrieval", complexity: "developmental", time: "past_to_present",
      N: N_SHORT,
      state: ["сильнее, чем сейчас", "своим", "впервые взрослым", "впервые свободным", "впервые понятым", "впервые одиноким"],
    },
    {
      tpl: "{N} фраз, которые тебе говорили в детстве и которые ещё работают внутри.",
      class: "reflexive", complexity: "developmental", time: "past_to_present",
      N: N_MID,
    },
    {
      tpl: "{N} воспоминаний, которые появились только после второго усилия.",
      class: "retrieval", complexity: "developmental", time: "past",
      N: N_SHORT,
    },
    {
      tpl: "Какие {N} {thing} {month_ago} ты теперь видишь иначе?",
      class: "reflexive", complexity: "developmental", time: "past_to_present",
      N: N_SHORT,
      thing: ["решений", "встреч", "разговоров", "ошибок", "выборов", "поворотов", "конфликтов"],
      month_ago: ["прошлого месяца", "прошлого года", "пять лет назад", "десять лет назад", "недавнего времени", "юности"],
    },
    {
      tpl: "{N} {thing}, которые ты обычно забываешь рассказать о себе.",
      class: "retrieval", complexity: "working", time: "timeless",
      N: N_SHORT,
      thing: ["фактов", "историй", "мест", "имён", "поворотов", "увлечений", "странностей", "детских боёв"],
    },
    {
      tpl: "{N} учителей — формальных и нет — которых ты помнишь.",
      class: "retrieval", complexity: "working", time: "past",
      N: N_MID,
    },
    {
      tpl: "{N} {thing} последней недели, которые уже стираются.",
      class: "retrieval", complexity: "basic", time: "past",
      N: N_MID,
      thing: ["мелочей", "разговоров", "впечатлений", "встреч", "мыслей", "коротких побед", "малых поражений"],
    },
    {
      tpl: "Какие {N} вещей я сегодня сделал впервые — или впервые осознанно?",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} мест, где я бывал в детстве и которых, возможно, уже нет.",
      class: "retrieval", complexity: "developmental", time: "past",
      N: N_SHORT,
    },
    {
      tpl: "Вспомни {N} раз, когда ты {feeling} — и забыл об этом.",
      class: "retrieval", complexity: "working", time: "past",
      N: N_SHORT,
      feeling: ["сильно радовался", "был полностью спокоен", "впервые что-то понял", "был кому-то очень благодарен", "удивлялся себе", "чувствовал тёплую близость", "видел красоту", "ловил поток", "был храбрым"],
    },
    {
      tpl: "{N} {object}, которые ты унёс из своей первой квартиры — буквально или внутри.",
      class: "retrieval", complexity: "developmental", time: "past_to_present",
      N: N_SHORT,
      object: ["вещей", "привычек", "образов", "запахов", "правил", "ритуалов"],
    },
    {
      tpl: "{N} имён, которые имели для меня значение в разные периоды жизни.",
      class: "retrieval", complexity: "developmental", time: "past",
      N: N_MID,
    },
    {
      tpl: "{N} {thing}, которые я не хотел бы забыть из {span}.",
      class: "evaluative", complexity: "working", time: "past_to_present",
      N: N_SHORT,
      thing: ["разговоров", "взглядов", "мелочей", "звуков", "касаний", "случаев"],
      span: ["этой недели", "этого месяца", "этого лета", "последнего года", "последнего проекта"],
    },
    {
      tpl: "{N} {thing}, в которых я вижу себя совсем юным.",
      class: "retrieval", complexity: "developmental", time: "past",
      N: N_SHORT,
      thing: ["реакций", "интонаций", "страхов", "восторгов", "поз", "выборов одежды"],
    },
    {
      tpl: "{N} людей, у которых я жил в гостях и которых хочу вспомнить.",
      class: "retrieval", complexity: "working", time: "past",
      N: N_SHORT,
    },
    {
      tpl: "{N} вещей, которые я выкинул и о которых иногда вспоминаю.",
      class: "retrieval", complexity: "working", time: "past",
      N: N_SHORT,
    },
  ],

  // ============================== WORK ==============================
  work: [
    {
      tpl: "{N} {thing}, которые я знаю о {scope}.",
      class: "retrieval", complexity: "working", time: "present",
      N: [5, 7, 10],
      thing: ["фактов", "ограничений", "допущений", "критериев успеха", "стейкхолдеров", "рисков", "связей", "зависимостей", "сильных сторон"],
      scope: ["текущей задаче", "этом проекте", "этой команде", "этой клиентской ситуации", "следующем релизе", "стратегии на квартал"],
    },
    {
      tpl: "{N} {thing}, которые я пока НЕ знаю об этой задаче.",
      class: "clarifying", complexity: "developmental", time: "present",
      N: N_SHORT,
      thing: ["фактов", "критериев", "ограничений", "стейкхолдеров", "решений до меня", "альтернатив", "предыдущих провалов"],
    },
    {
      tpl: "Назови {N} способов сформулировать эту задачу иначе.",
      class: "generative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} людей, которые могли бы помочь мне в {scope}, если бы я попросил.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_MID,
      scope: ["этой задаче", "этом проекте", "этом этапе", "этом решении", "этой роли"],
    },
    {
      tpl: "{N} критериев успеха для {scope}.",
      class: "evaluative", complexity: "working", time: "present_to_future",
      N: N_SHORT,
      scope: ["сегодняшнего дня", "этой недели", "этой задачи", "этой встречи", "этого решения", "этого этапа проекта", "квартала", "первого полугодия"],
    },
    {
      tpl: "{N} рисков, которые я пока недооцениваю в {scope}.",
      class: "analytical", complexity: "developmental", time: "present",
      N: N_SHORT,
      scope: ["этой задаче", "этом проекте", "своём плане", "переговорах", "найме", "запуске"],
    },
    {
      tpl: "{N} допущений, которые мы пока приняли без проверки.",
      class: "analytical", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые я хочу задать команде до начала работы.",
      class: "meta_generative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} первых шагов, которые можно сделать без идеального плана.",
      class: "projecting", complexity: "working", time: "present_to_future",
      N: N_SHORT,
    },
    {
      tpl: "{N} вещей, которые я могу убрать из плана, не теряя смысла.",
      class: "evaluative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} признаков, что я делаю не свою задачу.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing} в работе, которые я повторяю чаще, чем замечаю.",
      class: "retrieval", complexity: "developmental", time: "timeless",
      N: N_SHORT,
      thing: ["шаблонов", "ошибок", "формулировок", "решений", "движений", "избеганий", "оправданий", "ярлыков"],
    },
    {
      tpl: "Какие {N} вопросов помогут команде понять задачу до поиска решения?",
      class: "meta_generative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} людей, чьё мнение об этой задаче я ещё не спросил.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} способов проверить эту идею до того, как вкладывать время.",
      class: "generative", complexity: "developmental", time: "present_to_future",
      N: N_SHORT,
    },
    {
      tpl: "{N} мест, где мой план может развалиться раньше всего.",
      class: "analytical", complexity: "developmental", time: "future",
      N: N_SHORT,
    },
    {
      tpl: "{N} вещей, которые я делегировал бы, если бы доверял.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} писем, которые я откладываю, и причина каждого.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, которые я могу зафиксировать, чтобы не повторять одно и то же на встречах.",
      class: "projecting", complexity: "developmental", time: "present_to_future",
      N: N_SHORT,
      thing: ["правил", "договорённостей", "артефактов", "шаблонов", "вопросов", "форматов"],
    },
    {
      tpl: "{N} процессов, которые в моей работе действительно работают.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} процессов, которые в моей работе только делают вид, что работают.",
      class: "evaluative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые могли бы превратить эту встречу из формальной в нужную.",
      class: "meta_generative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} ситуаций, где мне стоит сказать «нет» на работе.",
      class: "evaluative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, которые помогли бы новичку быстрее понять эту задачу.",
      class: "generative", complexity: "developmental", time: "present_to_future",
      N: N_SHORT,
      thing: ["артефактов", "вопросов", "ссылок", "разговоров", "примеров", "анти-примеров"],
    },
    {
      tpl: "{N} {thing}, на которые я ссылаюсь, не перечитав давно.",
      class: "reflexive", complexity: "working", time: "present",
      N: N_SHORT,
      thing: ["документов", "цифр", "договорённостей", "мнений людей", "выводов прошлого квартала"],
    },
    {
      tpl: "{N} вопросов, на которые мой руководитель пока не отвечал.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые я ещё ни разу не задавал своей команде.",
      class: "retrieval", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} ритмов в моей работе, которые мне сейчас вредят.",
      class: "evaluative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} ритмов в моей работе, которые мне сейчас помогают.",
      class: "evaluative", complexity: "working", time: "present",
      N: N_SHORT,
    },
  ],

  // ============================== CREATIVE ==============================
  creative: [
    {
      tpl: "{N} способов посмотреть на {scope} глазами {persona}.",
      class: "generative", complexity: "developmental", time: "present",
      N: N_SHORT,
      scope: ["эту ситуацию", "эту задачу", "эту проблему", "этот текст", "этот продукт", "это решение"],
      persona: ["ребёнка", "иностранца", "археолога будущего", "человека, который видит её впервые", "поэта", "учёного-критика", "врача", "журналиста расследования", "пятилетнего гения", "своего наставника", "конкурента"],
    },
    {
      tpl: "{N} необычных метафор, которыми можно описать {scope}.",
      class: "generative", complexity: "developmental", time: "present",
      N: N_SHORT,
      scope: ["эту проблему", "эту задачу", "эту команду", "этот этап жизни", "эту сложную чувство"],
    },
    {
      tpl: "{N} вариантов, как {scope} могла бы выглядеть, если бы была {medium}.",
      class: "generative", complexity: "developmental", time: "present",
      N: N_SHORT,
      scope: ["эта задача", "эта проблема", "эта идея", "эта команда"],
      medium: ["песней", "архитектурой", "блюдом", "настольной игрой", "коротким фильмом", "обрядом", "детской сказкой", "танцем", "ремеслом"],
    },
    {
      tpl: "{N} ограничений, которые могли бы сделать эту работу интереснее.",
      class: "generative", complexity: "developmental", time: "present_to_future",
      N: N_SHORT,
    },
    {
      tpl: "Назови {N} плохих идей, которые могут открыть дорогу к хорошей.",
      class: "generative", complexity: "working", time: "present",
      N: N_MID,
    },
    {
      tpl: "{N} названий, которыми можно было бы переименовать {scope}.",
      class: "generative", complexity: "working", time: "present",
      N: N_SHORT,
      scope: ["эту задачу", "этот проект", "этот этап", "этот месяц", "эту встречу"],
    },
    {
      tpl: "{N} {thing}, которые я могу позаимствовать у {field}.",
      class: "generative", complexity: "advanced", time: "present",
      N: N_SHORT,
      thing: ["приёмов", "форм", "правил", "ритмов", "ритуалов", "метафор", "пауз"],
      field: ["театра", "медицины", "плотничества", "кулинарии", "спорта", "монастырской традиции", "архитектуры", "детских игр"],
    },
    {
      tpl: "Какие {N} «правил жанра» я нарушаю, и что от этого происходит?",
      class: "analytical", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вариантов, как сделать это {scale}.",
      class: "generative", complexity: "developmental", time: "present",
      N: N_SHORT,
      scale: ["в десять раз меньше", "в десять раз больше", "вдвое короче", "втрое медленнее", "вдвое тише", "в один шаг", "за один кадр"],
    },
    {
      tpl: "{N} деталей, которые могли бы сделать это запоминающимся.",
      class: "generative", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые задал бы этой задаче режиссёр.",
      class: "meta_generative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} образов, которые приходят в голову раньше слов о ней.",
      class: "retrieval", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вариантов первой строки, с которой можно начать рассказ об этом.",
      class: "generative", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые задал бы этой задаче {role}.",
      class: "meta_generative", complexity: "developmental", time: "present",
      N: N_SHORT,
      role: ["детский писатель", "хореограф", "плотник", "повар", "следователь", "композитор", "архитектор", "садовник", "хирург", "клоун"],
    },
    {
      tpl: "{N} вариантов, как рассказать об этом {audience}.",
      class: "generative", complexity: "working", time: "present",
      N: N_SHORT,
      audience: ["пятилетнему ребёнку", "соседу в лифте", "иностранцу", "критику", "своему «через десять лет»", "своему «двадцать лет назад»", "коту", "учёному", "бабушке"],
    },
    {
      tpl: "{N} «а что если» к {scope}.",
      class: "generative", complexity: "developmental", time: "present",
      N: N_SHORT,
      scope: ["этой работе", "этому проекту", "этому продукту", "этому общению", "этому ритму", "этой роли"],
    },
    {
      tpl: "{N} приёмов, которые я хочу попробовать ровно один раз.",
      class: "projecting", complexity: "developmental", time: "future",
      N: N_SHORT,
    },
    {
      tpl: "{N} провалов, которые могли бы научить меня в этой области.",
      class: "projecting", complexity: "developmental", time: "future",
      N: N_SHORT,
    },
    {
      tpl: "{N} вариантов финала этой истории, которые я не выбрал.",
      class: "generative", complexity: "developmental", time: "future",
      N: N_SHORT,
    },
  ],

  // ============================== REFLECTION ==============================
  reflection: [
    {
      tpl: "{N} {thing}, в которых я сегодня узнаю себя.",
      class: "reflexive", complexity: "working", time: "present",
      N: N_SHORT,
      thing: ["реакций", "решений", "слов", "избеганий", "интонаций", "взглядов в зеркало", "выборов", "поз тела"],
    },
    {
      tpl: "Какие {N} вопросов ты задавал себе в последние {span}?",
      class: "retrieval", complexity: "working", time: "past",
      N: N_MID,
      span: ["7 дней", "три дня", "месяц", "сутки", "час", "две недели"],
    },
    {
      tpl: "{N} {thing}, за которые я благодарен сегодня — даже мелких.",
      class: "retrieval", complexity: "basic", time: "present",
      N: N_MID,
      thing: ["вещей", "людей", "мелочей", "встреч", "коротких моментов", "звуков", "движений"],
    },
    {
      tpl: "{N} раз, когда я сегодня выбрал не то, что хотел на самом деле.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} ситуаций, где я сейчас живу не из своих ценностей.",
      class: "reflexive", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, которые я уже долго откладываю — и почему именно сейчас.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
      thing: ["разговоров", "решений", "признаний", "звонков", "извинений", "просьб", "отказов"],
    },
    {
      tpl: "{N} {thing}, в которых я в последнее время вырос.",
      class: "reflexive", complexity: "working", time: "past_to_present",
      N: N_SHORT,
      thing: ["сторон", "способностей", "тонкостей", "отношений", "областей", "ролей"],
    },
    {
      tpl: "{N} вещей, которые перестали быть для меня важными за {span}.",
      class: "reflexive", complexity: "developmental", time: "past_to_present",
      N: N_SHORT,
      span: ["последний год", "пять лет", "последние месяцы", "недавнее время"],
    },
    {
      tpl: "{N} {thing}, к которым я возвращаюсь, когда теряюсь.",
      class: "retrieval", complexity: "working", time: "timeless",
      N: N_SHORT,
      thing: ["опор", "образов", "фраз", "людей", "мест", "практик", "книг", "песен"],
    },
    {
      tpl: "Какие {N} страхов я сегодня замечаю в себе — и насколько они мои?",
      class: "reflexive", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} обещаний, которые я давал себе и которым ещё верен.",
      class: "retrieval", complexity: "developmental", time: "past_to_present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вещей, в которых я сейчас себе вру.",
      class: "reflexive", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, которыми я мог бы гордиться, но почему-то не позволяю себе.",
      class: "reflexive", complexity: "advanced", time: "past_to_present",
      N: N_SHORT,
      thing: ["шагов", "решений", "результатов", "качеств", "разговоров", "отказов"],
    },
    {
      tpl: "{N} вопросов, которые я отказываюсь себе задавать.",
      class: "meta_generative", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, без которых я уже не я.",
      class: "reflexive", complexity: "developmental", time: "timeless",
      N: N_SHORT,
      thing: ["людей", "вещей", "практик", "мест", "идей", "ритуалов", "слов"],
    },
    {
      tpl: "{N} {thing}, в которых я бываю слишком серьёзен.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
      thing: ["разговоров", "решений", "ролей", "ситуаций", "отношений"],
    },
    {
      tpl: "{N} {thing}, в которых я бываю слишком лёгок.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
      thing: ["разговоров", "решений", "ролей", "ситуаций", "отношений"],
    },
    {
      tpl: "{N} вопросов, которые я могу задать себе перед сном.",
      class: "meta_generative", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые я могу задать себе после трудного дня.",
      class: "meta_generative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые я могу задать себе после хорошего дня.",
      class: "meta_generative", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, в которых я повторяюсь, и это уже скучно мне самому.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
      thing: ["реакций", "историй", "обид", "побед", "сюжетов"],
    },
    {
      tpl: "{N} ролей, между которыми я переключаюсь за день.",
      class: "classifying", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, которые я ценю в себе тихо, не вслух.",
      class: "reflexive", complexity: "developmental", time: "timeless",
      N: N_SHORT,
      thing: ["качеств", "привычек", "решений", "выборов", "побед"],
    },
  ],

  // ============================== CHILDREN ==============================
  children: [
    {
      tpl: "{N} вопросов, которые ребёнок мог бы задать о {scope}.",
      class: "meta_generative", complexity: "working", time: "present",
      N: N_MID,
      scope: ["этой ситуации", "этой задаче", "этом разговоре", "этой работе", "этом мире", "этом дне", "этой проблеме"],
    },
    {
      tpl: "{N} {thing}, которые становятся интереснее, если смотреть на них как ребёнок.",
      class: "generative", complexity: "working", time: "timeless",
      N: N_SHORT,
      thing: ["вещей вокруг", "звуков", "слов", "людей", "правил", "движений", "ритуалов"],
    },
    {
      tpl: "{N} «почему», которыми ребёнок пробьёт любой ответ {target}.",
      class: "meta_generative", complexity: "developmental", time: "timeless",
      N: N_SHORT,
      target: ["взрослого", "учителя", "родителя", "начальника", "политика", "учёного"],
    },
    {
      tpl: "{N} вещей, в которых ребёнок умнее меня.",
      class: "evaluative", complexity: "working", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые я бы задал {age}-летнему себе.",
      class: "meta_generative", complexity: "developmental", time: "past_to_present",
      N: N_SHORT,
      age: ["пяти", "семи", "десяти", "четырнадцати", "трёх", "восьми", "двенадцати"],
    },
    {
      tpl: "Назови {N} игр, которые я бы придумал именно сегодня для ребёнка рядом.",
      class: "generative", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} страхов детства, которые я узнаю в себе и сейчас.",
      class: "reflexive", complexity: "developmental", time: "past_to_present",
      N: N_SHORT,
    },
    {
      tpl: "{N} способов сказать ребёнку, что я его слышу — без нравоучений.",
      class: "generative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} простых тайн вокруг, которые ребёнок заметит раньше взрослого.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые ребёнок задал тебе — и ты до сих пор думаешь над ними.",
      class: "retrieval", complexity: "developmental", time: "past_to_present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вещей, которым ребёнок мог бы научить меня сегодня.",
      class: "generative", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing} в моём детстве, которыми я по-прежнему живу.",
      class: "reflexive", complexity: "developmental", time: "past_to_present",
      N: N_SHORT,
      thing: ["правил", "образов", "фраз", "героев книг", "обид", "побед", "игр"],
    },
    {
      tpl: "{N} вопросов, которые я давно не задавал самому маленькому в семье.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} мест в детстве, где я был полностью собой.",
      class: "retrieval", complexity: "developmental", time: "past",
      N: N_SHORT,
    },
    {
      tpl: "{N} взрослых правил, которые ребёнок во мне всё ещё не принял.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} «а почему так?», которые я перестал себе задавать, когда вырос.",
      class: "reflexive", complexity: "developmental", time: "past_to_present",
      N: N_SHORT,
    },
  ],

  // ============================== SOCIAL ==============================
  social: [
    {
      tpl: "{N} людей, которым я давно хотел {action}.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_MID,
      action: ["что-то сказать", "написать", "позвонить", "сказать спасибо", "извиниться", "задать один вопрос", "признать что-то", "просто помолчать рядом"],
    },
    {
      tpl: "{N} {thing}, которые я слышал сегодня от других.",
      class: "retrieval", complexity: "basic", time: "present",
      N: N_MID,
      thing: ["важных фраз", "сильных формулировок", "просьб", "мнений", "историй", "интонаций", "вопросов", "пауз"],
    },
    {
      tpl: "{N} способов начать разговор, которого ты избегаешь.",
      class: "generative", complexity: "developmental", time: "present_to_future",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые я хотел бы услышать от {who} — но никто не задаёт.",
      class: "retrieval", complexity: "developmental", time: "timeless",
      N: N_SHORT,
      who: ["близких", "родителей", "коллег", "детей", "друзей", "себя", "своего руководителя"],
    },
    {
      tpl: "{N} людей, которые сейчас «отзеркаливают» во мне что-то важное.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вещей, которые мне сложно попросить.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} ролей, в которых меня видят разные люди.",
      class: "classifying", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} разговоров за {span}, которые меня изменили.",
      class: "retrieval", complexity: "developmental", time: "past",
      N: N_SHORT,
      span: ["последний месяц", "последний год", "последнюю неделю", "последний квартал", "последний разговорный сезон"],
    },
    {
      tpl: "{N} людей, чьё внимание мне кажется важнее моего собственного.",
      class: "reflexive", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые я не задаю, потому что боюсь ответа.",
      class: "meta_generative", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} способов слушать так, чтобы говорящий услышал сам себя.",
      class: "generative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} людей, благодаря которым я сегодня не сорвался.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, которые я говорю чаще, чем имею в виду.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
      thing: ["комплиментов", "согласий", "извинений", "благодарностей", "обещаний"],
    },
    {
      tpl: "{N} людей, чей телефон у меня есть и которым я пишу слишком редко.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} способов сказать «нет» так, чтобы не разрушить отношения.",
      class: "generative", complexity: "developmental", time: "present_to_future",
      N: N_SHORT,
    },
    {
      tpl: "{N} способов сказать «да», которые я давно потерял.",
      class: "generative", complexity: "developmental", time: "present_to_future",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, по которым я узнаю, что человеку рядом плохо.",
      class: "evaluative", complexity: "developmental", time: "present",
      N: N_SHORT,
      thing: ["сигналов", "интонаций", "пауз", "движений", "слов", "взглядов"],
    },
    {
      tpl: "{N} {thing}, по которым я узнаю, что человеку рядом хорошо.",
      class: "evaluative", complexity: "working", time: "present",
      N: N_SHORT,
      thing: ["сигналов", "интонаций", "пауз", "движений", "слов", "взглядов"],
    },
    {
      tpl: "{N} конфликтов, в которых я был неправ — и до сих пор не сказал об этом.",
      class: "reflexive", complexity: "advanced", time: "past_to_present",
      N: N_SHORT,
    },
    {
      tpl: "{N} людей, чья поддержка меня сильно держит сейчас.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые могут изменить разговор за минуту.",
      class: "meta_generative", complexity: "developmental", time: "timeless",
      N: N_SHORT,
    },
  ],

  // ============================== PHILOSOPHY ==============================
  philosophy: [
    {
      tpl: "{N} различений, которые я обычно склеиваю в одно слово «{lump}».",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
      lump: ["счастье", "успех", "знание", "любовь", "свобода", "справедливость", "истина", "польза", "взрослость", "забота", "смысл", "правда", "сила", "красота", "мужество"],
    },
    {
      tpl: "{N} границ слова «{word}», которые становятся видны только в крайних случаях.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
      word: ["друг", "выбор", "правда", "помощь", "ответственность", "талант", "норма", "семья", "взрослый", "взаимность"],
    },
    {
      tpl: "{N} вещей, которые я считаю само собой разумеющимися — и это, возможно, не так.",
      class: "analytical", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} способов проверить, что я не путаю «полезное» и «правильное».",
      class: "evaluative", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, в которых здравый смысл оказался хуже, чем странный смысл.",
      class: "retrieval", complexity: "advanced", time: "past",
      N: N_SHORT,
      thing: ["исторических случаев", "личных эпизодов", "решений", "выборов", "семейных историй"],
    },
    {
      tpl: "{N} философских вопросов, которые сегодня решаются обычным разговором.",
      class: "meta_generative", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {scope}, у которых нет финального ответа — и это не делает их бесполезными.",
      class: "evaluative", complexity: "advanced", time: "timeless",
      N: N_SHORT,
      scope: ["вопросов", "споров", "проблем", "тем", "разговоров"],
    },
    {
      tpl: "{N} следствий из идеи «{idea}» — и {N} причин не доверять ей.",
      class: "analytical", complexity: "limit", time: "timeless",
      N: [3, 5],
      idea: ["всё взаимосвязано", "каждый получает по делам", "природа добра", "человек разумен", "история повторяется", "правда одна на всех", "у меня есть свободная воля"],
    },
    {
      tpl: "{N} разных способов спросить «что значит {word}?» и получить разные ответы.",
      class: "meta_generative", complexity: "advanced", time: "timeless",
      N: N_SHORT,
      word: ["знать", "понимать", "хотеть", "выбрать", "помнить", "быть", "любить", "помогать", "доверять"],
    },
    {
      tpl: "{N} {thing}, в которых философия оказалась практичной для меня лично.",
      class: "retrieval", complexity: "developmental", time: "past_to_present",
      N: N_SHORT,
      thing: ["случаев", "решений", "разговоров", "конфликтов", "выборов"],
    },
    {
      tpl: "{N} вопросов, которые перестают быть моими, если я прислушиваюсь к телу.",
      class: "reflexive", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} утверждений, которые звучат истинно — и {N} ситуаций, где они врут.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} различий между «{word_a}» и «{word_b}», которые я обычно не делаю.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
      word_a: ["знать", "хотеть", "выбирать", "понимать", "слышать"],
      word_b: ["верить", "надеяться", "соглашаться", "догадываться", "слушать"],
    },
    {
      tpl: "{N} ситуаций, в которых «правильное» и «доброе» расходятся.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} понятий, без которых эта проблема не существует.",
      class: "analytical", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, ответы на которые меняют моё представление о том, кто я.",
      class: "meta_generative", complexity: "advanced", time: "timeless",
      N: N_SHORT,
    },
  ],

  // ============================== META ==============================
  meta: [
    {
      tpl: "{N} {thing} о вопросах, которые редко задают.",
      class: "meta_generative", complexity: "advanced", time: "timeless",
      N: N_SHORT,
      thing: ["вопросов", "наблюдений", "различий", "ловушек", "критериев"],
    },
    {
      tpl: "{N} признаков, что вопрос задан {timing}.",
      class: "evaluative", complexity: "developmental", time: "timeless",
      N: N_SHORT,
      timing: ["слишком рано", "слишком поздно", "не тому человеку", "не в той форме", "из страха", "из любопытства", "ради вежливости", "ради давления"],
    },
    {
      tpl: "{N} признаков, что вопрос звучит {quality}.",
      class: "evaluative", complexity: "developmental", time: "timeless",
      N: N_SHORT,
      quality: ["бережно", "острым", "формально", "по-домашнему", "честно", "хитро", "детски", "наивно"],
    },
    {
      tpl: "{N} вопросов, которые расширяют мышление.",
      class: "classifying", complexity: "developmental", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые сужают или блокируют мышление.",
      class: "classifying", complexity: "developmental", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} способов переформулировать «{from}» в «{to}».",
      class: "generative", complexity: "developmental", time: "timeless",
      N: N_SHORT,
      from: ["почему", "кто виноват", "сколько это стоит", "это правильно?"],
      to: ["что", "что делать", "что это даёт", "чему это служит"],
    },
    {
      tpl: "Назови {N} типов вопросов по тому, какой ответ они допускают.",
      class: "classifying", complexity: "developmental", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые лучше не задавать сейчас — и чем их заменить.",
      class: "evaluative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые становятся другими, если задать их {channel}.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
      channel: ["вслух", "молча", "по-русски", "по-английски", "ребёнку", "врачу", "себе утром", "себе ночью"],
    },
    {
      tpl: "{N} вопросов, которые ребёнок задал бы {target}.",
      class: "meta_generative", complexity: "advanced", time: "timeless",
      N: N_SHORT,
      target: ["вопросу", "ответу", "молчанию", "разговору", "правилу", "учителю", "телу"],
    },
    {
      tpl: "{N} вопросов, которые задают сами себя в конце практики.",
      class: "meta_generative", complexity: "advanced", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые меняют человека, который их задаёт.",
      class: "meta_generative", complexity: "advanced", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, по которым я узнаю «настоящий» вопрос — а не социальный.",
      class: "evaluative", complexity: "advanced", time: "timeless",
      N: N_SHORT,
      thing: ["признаков", "ощущений", "сигналов", "критериев"],
    },
    {
      tpl: "{N} вопросов, которые задают тишина, пауза и взгляд.",
      class: "meta_generative", complexity: "advanced", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} способов задать вопрос так, чтобы на него хотелось ответить.",
      class: "generative", complexity: "developmental", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} «маскирующихся» вопросов, которые на деле — утверждения.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
    },
  ],

  // ============================== EPISTEMOLOGY ==============================
  epistemology: [
    {
      tpl: "{N} способов понять, что я действительно знаю это, а не повторяю чужое.",
      class: "evaluative", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, в которых я не отличаю «{a}» от «{b}».",
      class: "reflexive", complexity: "advanced", time: "past_to_present",
      N: N_SHORT,
      thing: ["воспоминаний", "историй", "фактов", "цитат", "ситуаций", "ощущений"],
      a: ["помню", "знаю", "понимаю", "видел", "слышал"],
      b: ["придумал", "слышал от других", "чувствую", "думаю", "повторяю"],
    },
    {
      tpl: "{N} убеждений, которые я не пересматривал давно.",
      class: "retrieval", complexity: "advanced", time: "past_to_present",
      N: N_SHORT,
    },
    {
      tpl: "{N} признаков, что я меняю мнение, а не его имитирую.",
      class: "evaluative", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, после которых я обновил картину мира.",
      class: "retrieval", complexity: "advanced", time: "past_to_present",
      N: N_SHORT,
      thing: ["разговоров", "книг", "случаев", "ошибок", "путешествий", "встреч", "конфликтов"],
    },
    {
      tpl: "{N} тем, в которых я уверен сильнее, чем имею право.",
      class: "reflexive", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} тем, в которых я слишком осторожен и теряю опору.",
      class: "reflexive", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} способов отличить факт, мнение и интерпретацию в одном высказывании.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} «очевидностей», которые я никогда не проверял эмпирически.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, в которых я готов ошибиться, чтобы научиться.",
      class: "projecting", complexity: "advanced", time: "future",
      N: N_SHORT,
      thing: ["областей", "тем", "решений", "разговоров", "проектов"],
    },
    {
      tpl: "{N} вопросов, ответ на которые я уже подбирал до того, как услышал.",
      class: "reflexive", complexity: "advanced", time: "past_to_present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, в которых я уверен только потому, что слышал часто.",
      class: "analytical", complexity: "advanced", time: "present",
      N: N_SHORT,
      thing: ["мнений", "фактов", "правил", "историй", "цифр"],
    },
    {
      tpl: "{N} источников знания, которым я доверяю больше, чем стоит.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} источников знания, которым я доверяю меньше, чем они заслуживают.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, которые я знаю «одним способом», и других способов узнать это пока не пробовал.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
      thing: ["фактов", "явлений", "людей", "процессов", "правил"],
    },
    {
      tpl: "{N} способов задать вопрос так, чтобы он не подсказывал ответ.",
      class: "meta_generative", complexity: "advanced", time: "timeless",
      N: N_SHORT,
    },
  ],

  // ============================== MODELLING ==============================
  modelling: [
    {
      tpl: "{N} карт реальности, которыми я пользуюсь в {scope}.",
      class: "analytical", complexity: "developmental", time: "present",
      N: N_SHORT,
      scope: ["этой задаче", "этом проекте", "разговоре с командой", "семейной ситуации", "финансовом решении"],
    },
    {
      tpl: "{N} мест, где моя карта может врать.",
      class: "analytical", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} переменных, которые я учитываю в этой системе — и {N}, которые игнорирую.",
      class: "analytical", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} обратных связей, которые я не вижу в этой ситуации.",
      class: "analytical", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} аналогий, которые я подсознательно применяю к этой задаче.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} аналогий, которые могут помочь иначе — и {N}, которые могут запутать.",
      class: "analytical", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} уровней абстракции, на которых эту задачу можно решать.",
      class: "classifying", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, которые при увеличении {scale} ломают модель.",
      class: "analytical", complexity: "advanced", time: "future",
      N: N_SHORT,
      thing: ["параметров", "процессов", "людей", "событий", "запросов", "связей"],
      scale: ["в 10 раз", "в 100 раз", "вдвое", "втрое", "на порядок"],
    },
    {
      tpl: "{N} {thing}, которые при уменьшении {scale} ломают модель.",
      class: "analytical", complexity: "advanced", time: "future",
      N: N_SHORT,
      thing: ["параметров", "процессов", "людей", "событий", "запросов", "связей"],
      scale: ["в 10 раз", "в 100 раз", "вдвое", "втрое", "на порядок"],
    },
    {
      tpl: "{N} вопросов, которые задал бы этой модели {role}.",
      class: "meta_generative", complexity: "advanced", time: "present",
      N: N_SHORT,
      role: ["системный аналитик", "детский психолог", "врач", "архитектор", "фермер", "юрист", "историк"],
    },
    {
      tpl: "{N} {thing}, которые я считал шумом — а это сигнал.",
      class: "analytical", complexity: "advanced", time: "past_to_present",
      N: N_SHORT,
      thing: ["явлений", "слов", "сигналов", "поведений", "цифр"],
    },
    {
      tpl: "{N} {thing}, которые я считал сигналом — а это шум.",
      class: "analytical", complexity: "advanced", time: "past_to_present",
      N: N_SHORT,
      thing: ["явлений", "слов", "сигналов", "поведений", "цифр"],
    },
    {
      tpl: "{N} «как-будто»-допущений, на которых держится моя текущая модель.",
      class: "analytical", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} способов разрушить эту модель — конструктивно.",
      class: "generative", complexity: "advanced", time: "present_to_future",
      N: N_SHORT,
    },
    {
      tpl: "{N} ситуаций, в которых эта модель работает хорошо.",
      class: "evaluative", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} ситуаций, в которых эта модель опасна.",
      class: "evaluative", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} объектов в этой системе, между которыми я не вижу связи — а она, возможно, есть.",
      class: "analytical", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
  ],

  // ============================== LINGUISTICS ==============================
  linguistics: [
    {
      tpl: "{N} слов, которыми я называю {scope}.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
      scope: ["эту проблему", "этого человека", "это чувство", "эту работу", "эту ситуацию", "этот период"],
    },
    {
      tpl: "{N} слов, которые я использую, не до конца понимая.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, которые меняются, если поменять глагол с {a} на {b}.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
      thing: ["формулировок", "ощущений", "оценок", "решений"],
      a: ["пассивного", "повелительного", "сослагательного"],
      b: ["активный", "вопросительный", "изъявительный"],
    },
    {
      tpl: "{N} вещей, которые сложно сказать на родном языке — и легко на чужом.",
      class: "retrieval", complexity: "developmental", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} слов, которыми я заменяю чувство, которое не хочу называть.",
      class: "reflexive", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} имён, которые я даю себе в разные годы, и что они говорили обо мне.",
      class: "retrieval", complexity: "developmental", time: "past_to_present",
      N: N_SHORT,
    },
    {
      tpl: "{N} клише, которые я повторяю и которые перестают что-то значить.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} слов, у которых разный вес {context}.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
      context: ["в семье", "на работе", "в интернете", "в детстве", "в дружбе", "в конфликте", "в близости"],
    },
    {
      tpl: "Назови {N} способов сказать {what} — мягче.",
      class: "generative", complexity: "developmental", time: "timeless",
      N: N_SHORT,
      what: ["«нет»", "«я не согласен»", "«мне больно»", "«мне нужна помощь»", "«я устал»", "«мне страшно»"],
    },
    {
      tpl: "Назови {N} способов сказать {what} — точнее.",
      class: "generative", complexity: "developmental", time: "timeless",
      N: N_SHORT,
      what: ["«хорошо»", "«нормально»", "«сложно»", "«интересно»", "«странно»", "«важно»"],
    },
    {
      tpl: "{N} слов, которые звучат одинаково, но означают разное в разных моих ролях.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, которые исчезают, если перевести их на «деловой» язык.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
      thing: ["смыслов", "оттенков", "признаний", "связей"],
    },
    {
      tpl: "{N} вопросов, которые я мог бы задать одному только глаголу в важной фразе.",
      class: "meta_generative", complexity: "advanced", time: "timeless",
      N: N_SHORT,
    },
  ],

  // ============================== SENSES ==============================
  senses: [
    {
      tpl: "{N} {sense_object}, которые я могу различить прямо сейчас.",
      class: "retrieval", complexity: "basic", time: "present",
      N: N_MID,
      sense_object: ["звуков", "запахов", "оттенков света", "ощущений в теле", "касаний поверхности", "цветов вокруг", "движений воздуха", "вкусов во рту"],
    },
    {
      tpl: "{N} {sense_object}, которые я обычно отфильтровываю и не замечаю.",
      class: "retrieval", complexity: "developmental", time: "present",
      N: N_MID,
      sense_object: ["звуков", "запахов", "движений", "ощущений", "тактильных деталей", "оттенков", "температурных перепадов"],
    },
    {
      tpl: "{N} вещей, которые красивее, если смотреть на них дольше обычного.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вкусов, которые невозможно описать словами.",
      class: "retrieval", complexity: "developmental", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} мест в моей квартире, где звучит иначе, чем в остальных.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} оттенков {color}, которые я могу увидеть отсюда.",
      class: "retrieval", complexity: "developmental", time: "present",
      N: N_SHORT,
      color: ["белого", "серого", "зелёного", "коричневого", "синего"],
    },
    {
      tpl: "{N} ощущений в теле, которым я редко даю имя.",
      class: "reflexive", complexity: "developmental", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} запахов, которые сильно влияют на моё настроение.",
      class: "retrieval", complexity: "working", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} {sense_object}, по которым я узнаю, что устал.",
      class: "evaluative", complexity: "working", time: "present",
      N: N_SHORT,
      sense_object: ["сигналов тела", "признаков в зрении", "признаков в дыхании", "движений мысли", "вкусовых перемен"],
    },
    {
      tpl: "{N} {sense_object}, по которым я узнаю, что мне хорошо.",
      class: "evaluative", complexity: "working", time: "present",
      N: N_SHORT,
      sense_object: ["сигналов тела", "признаков в зрении", "признаков в дыхании", "движений мысли", "вкусовых перемен"],
    },
    {
      tpl: "{N} текстур, которые мне особенно приятно трогать.",
      class: "retrieval", complexity: "basic", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} текстур, которые мне трудно касаться.",
      class: "retrieval", complexity: "working", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} звуков, которые мгновенно успокаивают меня.",
      class: "retrieval", complexity: "basic", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} звуков, которые мгновенно меня раздражают.",
      class: "retrieval", complexity: "working", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} ощущений тела, к которым я могу прислушаться, когда теряюсь.",
      class: "retrieval", complexity: "working", time: "present",
      N: N_SHORT,
    },
  ],

  // ============================== IMAGINATION ==============================
  imagination: [
    {
      tpl: "{N} вариантов, как могла бы пойти эта ситуация, если бы {twist}.",
      class: "generative", complexity: "developmental", time: "future",
      N: N_SHORT,
      twist: ["я был старше на десять лет", "я был младше", "у меня был другой характер", "у меня было больше времени", "у меня было меньше денег", "я знал заранее, чем кончится", "у меня не было слов", "я был один"],
    },
    {
      tpl: "{N} миров, в которых эта проблема не существует.",
      class: "generative", complexity: "developmental", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} вещей, которые я бы взял с собой в параллельную жизнь.",
      class: "retrieval", complexity: "working", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, которые задал бы тебе двойник из соседней реальности.",
      class: "meta_generative", complexity: "developmental", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} вариантов, как эта задача выглядит {era}.",
      class: "projecting", complexity: "developmental", time: "future",
      N: N_SHORT,
      era: ["в 2050 году", "в 1924 году", "в 1700 году", "в 2200 году", "в эпоху Возрождения"],
    },
    {
      tpl: "{N} «что, если» к самым обычным вещам вокруг.",
      class: "generative", complexity: "working", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} историй, которые могла бы рассказать {place}, если бы умела говорить.",
      class: "generative", complexity: "developmental", time: "timeless",
      N: N_SHORT,
      place: ["эта комната", "эта улица", "этот дом", "эта квартира", "эта чашка", "эта книга", "это окно"],
    },
    {
      tpl: "{N} мысленных экспериментов, которые мне сейчас полезно провести.",
      class: "meta_generative", complexity: "advanced", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} {thing}, которые я бы оставил себе, если бы можно было унести только их.",
      class: "evaluative", complexity: "developmental", time: "timeless",
      N: N_SHORT,
      thing: ["воспоминаний", "вещей", "людей", "ощущений", "мест", "ритуалов"],
    },
    {
      tpl: "{N} миров, в которых я был бы счастливее.",
      class: "generative", complexity: "developmental", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} миров, в которых я был бы скучнее.",
      class: "generative", complexity: "developmental", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} ролей, которые я мог бы примерить на эту задачу.",
      class: "generative", complexity: "developmental", time: "present_to_future",
      N: N_SHORT,
    },
    {
      tpl: "{N} вариантов, как этот разговор выглядит в {timeshift}.",
      class: "projecting", complexity: "developmental", time: "future",
      N: N_SHORT,
      timeshift: ["завтра", "через год", "через десять лет", "через пятьдесят лет", "после нашей жизни"],
    },
    {
      tpl: "{N} вопросов, которые задала бы этой ситуации сама будущая версия меня.",
      class: "meta_generative", complexity: "advanced", time: "future",
      N: N_SHORT,
    },
  ],

  // ============================== ABSURD ==============================
  absurd: [
    {
      tpl: "{N} причин, по которым этот вопрос может задавать сам себя.",
      class: "meta_generative", complexity: "limit", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} ответов, которые выглядят правильнее самого вопроса.",
      class: "evaluative", complexity: "limit", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} способов согласиться и не согласиться с {what} одновременно.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N: N_SHORT,
      what: ["одним и тем же", "самим собой", "своим прошлым выбором", "своим телом", "своим желанием"],
    },
    {
      tpl: "{N} вопросов, на которые честный ответ — это другой вопрос.",
      class: "meta_generative", complexity: "limit", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} парадоксов, которые я живу как обычные противоречия.",
      class: "reflexive", complexity: "limit", time: "present",
      N: N_SHORT,
    },
    {
      tpl: "{N} вещей, которые становятся {state}, как только их называют.",
      class: "analytical", complexity: "limit", time: "timeless",
      N: N_SHORT,
      state: ["истинными", "ложными", "проще", "сложнее", "своими", "чужими"],
    },
    {
      tpl: "{N} коанов, которые работают на меня лучше, чем разъяснения.",
      class: "reflexive", complexity: "limit", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} вопросов, ответ на которые отвечает сам себе.",
      class: "meta_generative", complexity: "limit", time: "timeless",
      N: N_SHORT,
    },
    {
      tpl: "{N} ситуаций, в которых я был и не был там одновременно.",
      class: "reflexive", complexity: "limit", time: "past",
      N: N_SHORT,
    },
    {
      tpl: "{N} утверждений, которые ломают сами себя в момент произнесения.",
      class: "analytical", complexity: "limit", time: "timeless",
      N: N_SHORT,
    },
  ],
};

// Default category meta — purpose, domains, answer_form etc per category.
export const CATEGORY_DEFAULTS = {
  morning:      { purpose: ["development","reflection"], domains: ["everyday_practice","self_development"], answer_form: "list", openness: "open", modes: ["individual","card_of_day"], subject_direction: "self", abstraction_level: "concrete" },
  memory:       { purpose: ["reflection","research"], domains: ["memory","self_development"], answer_form: "list", openness: "open", modes: ["individual","journal"], subject_direction: "self", abstraction_level: "situational" },
  work:         { purpose: ["diagnostic","design"], domains: ["work","project","team"], answer_form: "list", openness: "semi_open", modes: ["individual","meeting","group"], subject_direction: "self", abstraction_level: "situational" },
  creative:     { purpose: ["creative","development"], domains: ["creativity","thinking"], answer_form: "idea", openness: "radically_open", modes: ["individual","pair"], subject_direction: "self", abstraction_level: "conceptual" },
  reflection:   { purpose: ["reflection","development"], domains: ["self_development","emotions"], answer_form: "self_analysis", openness: "open", modes: ["individual","journal","deep_session"], subject_direction: "self", abstraction_level: "situational" },
  children:     { purpose: ["learning","communication"], domains: ["children","relationships"], answer_form: "list", openness: "open", modes: ["pair","group"], subject_direction: "other", abstraction_level: "concrete" },
  social:       { purpose: ["communication","reflection"], domains: ["relationships","speech"], answer_form: "list", openness: "open", modes: ["individual","pair"], subject_direction: "self", abstraction_level: "situational" },
  philosophy:   { purpose: ["research","learning"], domains: ["philosophy","thinking"], answer_form: "description", openness: "radically_open", modes: ["individual","deep_session"], subject_direction: "system", abstraction_level: "philosophical" },
  meta:         { purpose: ["research","learning"], domains: ["thinking"], answer_form: "classification", openness: "open", modes: ["individual","deep_session"], subject_direction: "circular", abstraction_level: "meta" },
  epistemology: { purpose: ["research","reflection"], domains: ["thinking","learning"], answer_form: "self_analysis", openness: "open", modes: ["individual","deep_session"], subject_direction: "self", abstraction_level: "conceptual" },
  modelling:    { purpose: ["design","research"], domains: ["thinking","work","project"], answer_form: "classification", openness: "open", modes: ["individual","meeting"], subject_direction: "system", abstraction_level: "conceptual" },
  linguistics:  { purpose: ["research","communication"], domains: ["speech","thinking"], answer_form: "list", openness: "open", modes: ["individual"], subject_direction: "self", abstraction_level: "conceptual" },
  senses:       { purpose: ["development","reflection"], domains: ["everyday_practice"], answer_form: "list", openness: "open", modes: ["individual","card_of_day"], subject_direction: "self", abstraction_level: "concrete" },
  imagination:  { purpose: ["creative","research"], domains: ["creativity","thinking"], answer_form: "idea", openness: "radically_open", modes: ["individual","pair"], subject_direction: "system", abstraction_level: "conceptual" },
  absurd:       { purpose: ["research","creative"], domains: ["thinking","philosophy"], answer_form: "description", openness: "radically_open", modes: ["individual","deep_session"], subject_direction: "circular", abstraction_level: "philosophical" },
};

// Mapping category → first playlist slug (where templated questions land by default)
export const CATEGORY_PRIMARY_PLAYLIST = {
  morning: "morning_reset",
  memory: "memory_sparks",
  reflection: "reflection_loop",
  work: "work_clarity",
  creative: "creative_breakout",
  children: "children_curiosity",
  social: "social_mirror",
  philosophy: "question_about_questions",
  meta: "meta_questions",
  epistemology: "epistemology_deep",
  modelling: "systems_thinking",
  linguistics: "language_lens",
  senses: "sensory_sharpening",
  imagination: "thought_experiments",
  absurd: "paradox_lab",
};

// Per-category quotas (must sum to 1500).
export const CATEGORY_QUOTA = {
  morning: 90, memory: 135, work: 150, creative: 120, reflection: 150,
  children: 90, social: 105, philosophy: 105, meta: 90, epistemology: 90,
  modelling: 105, linguistics: 75, senses: 75, imagination: 75, absurd: 45,
};
