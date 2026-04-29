// Supplementary templates to top up under-quota categories.
// Loaded by build.mjs in addition to templates.mjs.

const N = [3, 5, 7];

export const EXTRA_TEMPLATES = {
  morning: [
    {
      tpl: "{N} {thing}, которые проявляются именно в первые {when} утра.",
      class: "retrieval", complexity: "basic", time: "present",
      N,
      thing: ["мыслей", "ощущений", "намерений", "звуков", "движений"],
      when: ["10 минут", "30 минут", "часы", "полчаса"],
    },
    {
      tpl: "{N} {thing}, к которым я хочу обратиться раньше, чем к ленте новостей.",
      class: "projecting", complexity: "basic", time: "present",
      N,
      thing: ["людей", "вопросов", "ощущений в теле", "мыслей", "практик"],
    },
    {
      tpl: "{N} вариантов «доброго утра», которые я могу сказать сегодня себе.",
      class: "generative", complexity: "basic", time: "present",
      N,
    },
  ],

  reflection: [
    {
      tpl: "{N} {thing}, которые я хочу заметить в себе сегодня — без оценки.",
      class: "reflexive", complexity: "working", time: "present",
      N,
      thing: ["реакций", "решений", "слов", "пауз", "движений", "выборов", "интонаций"],
    },
    {
      tpl: "{N} {thing}, на которые я давно не давал себе права.",
      class: "reflexive", complexity: "advanced", time: "present",
      N,
      thing: ["удовольствий", "ошибок", "слабостей", "пауз", "слёз", "радостей", "капризов"],
    },
    {
      tpl: "{N} {thing}, в которых я живу из чужого сценария.",
      class: "reflexive", complexity: "advanced", time: "present",
      N,
      thing: ["решений", "целей", "ритмов", "разговоров", "отношений", "ролей"],
    },
    {
      tpl: "{N} вопросов, которые я могу задать своему телу прямо сейчас.",
      class: "meta_generative", complexity: "developmental", time: "present",
      N,
    },
    {
      tpl: "{N} {thing}, к которым я хочу относиться к себе помягче.",
      class: "reflexive", complexity: "developmental", time: "present",
      N,
      thing: ["ситуаций", "ошибок", "ожиданий", "ритмов", "ролей"],
    },
  ],

  children: [
    {
      tpl: "{N} {thing}, которые ребёнок придумал бы из {object} вокруг.",
      class: "generative", complexity: "working", time: "present",
      N,
      thing: ["игр", "историй", "имён", "правил", "героев"],
      object: ["вещей", "звуков", "слов взрослых", "светотени", "отражений", "мелких ошибок дня"],
    },
    {
      tpl: "{N} вопросов, которые я бы задал ребёнку, чтобы лучше понять его мир.",
      class: "meta_generative", complexity: "working", time: "present",
      N,
    },
    {
      tpl: "{N} {thing}, которые я должен ребёнку — но забыл.",
      class: "retrieval", complexity: "developmental", time: "past_to_present",
      N,
      thing: ["обещаний", "разговоров", "историй", "извинений", "признаний", "благодарностей"],
    },
    {
      tpl: "{N} {thing}, которые я выучил впервые именно от детей.",
      class: "retrieval", complexity: "developmental", time: "past_to_present",
      N,
      thing: ["правил", "вопросов", "способов смотреть", "способов прощать", "способов плакать", "способов радоваться"],
    },
  ],

  social: [
    {
      tpl: "{N} людей, к которым я возвращаюсь {context}.",
      class: "retrieval", complexity: "working", time: "timeless",
      N,
      context: ["в трудные дни", "в радостные дни", "за советом", "за молчанием", "когда устал", "когда заблудился"],
    },
    {
      tpl: "{N} способов спросить «как ты?» так, чтобы это не было формальностью.",
      class: "generative", complexity: "developmental", time: "timeless",
      N,
    },
    {
      tpl: "{N} {thing}, которые я чаще всего слышу от {who}.",
      class: "retrieval", complexity: "working", time: "present",
      N,
      thing: ["просьб", "обвинений", "комплиментов", "вопросов", "рассказов"],
      who: ["партнёра", "родителей", "детей", "коллег", "друзей", "руководителя"],
    },
    {
      tpl: "{N} мест, в которых я чувствую себя «своим» среди людей.",
      class: "retrieval", complexity: "working", time: "present",
      N,
    },
    {
      tpl: "{N} мест, в которых я чувствую себя «не своим» среди людей.",
      class: "retrieval", complexity: "developmental", time: "present",
      N,
    },
    {
      tpl: "{N} вопросов, которые могли бы помочь нам с {who} понять друг друга глубже.",
      class: "meta_generative", complexity: "developmental", time: "present_to_future",
      N,
      who: ["партнёром", "родителем", "ребёнком", "сестрой/братом", "близким другом", "коллегой"],
    },
    {
      tpl: "{N} людей, перед которыми я снимаю маску — и это спасает.",
      class: "retrieval", complexity: "developmental", time: "present",
      N,
    },
  ],

  meta: [
    {
      tpl: "{N} {thing}, по которым я узнаю, что вопрос «работает» во мне.",
      class: "evaluative", complexity: "advanced", time: "present",
      N,
      thing: ["признаков", "ощущений", "сигналов в теле", "сдвигов внимания"],
    },
    {
      tpl: "{N} вопросов, у которых короткий ответ — это уход от вопроса.",
      class: "evaluative", complexity: "advanced", time: "timeless",
      N,
    },
    {
      tpl: "{N} вопросов, у которых длинный ответ — это уход от вопроса.",
      class: "evaluative", complexity: "advanced", time: "timeless",
      N,
    },
    {
      tpl: "{N} способов задать вопрос так, чтобы услышать чувство, а не мнение.",
      class: "generative", complexity: "advanced", time: "timeless",
      N,
    },
    {
      tpl: "{N} вопросов, на которых начинается доверие.",
      class: "meta_generative", complexity: "developmental", time: "timeless",
      N,
    },
    {
      tpl: "{N} вопросов, после которых полезно молчание.",
      class: "meta_generative", complexity: "advanced", time: "timeless",
      N,
    },
  ],

  modelling: [
    {
      tpl: "{N} {thing}, которые я моделирую в этой задаче, не замечая.",
      class: "reflexive", complexity: "advanced", time: "present",
      N,
      thing: ["людей", "процессов", "интересов", "времени", "ресурсов"],
    },
    {
      tpl: "{N} простых правил, которыми я объясняю эту систему — и их пределы.",
      class: "analytical", complexity: "advanced", time: "present",
      N,
    },
    {
      tpl: "{N} {thing}, в которых эта модель устаревает быстрее, чем я думаю.",
      class: "analytical", complexity: "advanced", time: "future",
      N,
      thing: ["мест", "слоёв", "связей", "ролей"],
    },
  ],

  linguistics: [
    {
      tpl: "{N} {thing}, которые я бы попросил говорить точнее на работе.",
      class: "evaluative", complexity: "developmental", time: "present",
      N,
      thing: ["слов", "формулировок", "обещаний", "оценок", "ярлыков"],
    },
    {
      tpl: "{N} {thing}, которые я бы попросил говорить точнее дома.",
      class: "evaluative", complexity: "developmental", time: "present",
      N,
      thing: ["слов", "формулировок", "обещаний", "оценок", "ярлыков"],
    },
  ],

  senses: [
    {
      tpl: "{N} {sense_object} прямо сейчас, на которые мне приятно обратить внимание.",
      class: "retrieval", complexity: "basic", time: "present",
      N,
      sense_object: ["звуков", "запахов", "касаний", "оттенков", "температурных ощущений", "вкусов", "движений воздуха"],
    },
    {
      tpl: "{N} ощущений в теле, которые я обычно глушу.",
      class: "reflexive", complexity: "developmental", time: "present",
      N,
    },
    {
      tpl: "{N} {sense_object}, через которые я понимаю, что нахожусь именно здесь.",
      class: "retrieval", complexity: "working", time: "present",
      N,
      sense_object: ["звуков", "запахов", "касаний", "вкусов", "ощущений в теле"],
    },
    {
      tpl: "{N} {sense_object}, на которые я хочу опираться сегодня.",
      class: "projecting", complexity: "basic", time: "present_to_future",
      N,
      sense_object: ["звуков", "ощущений", "ритмов", "температур", "запахов"],
    },
    {
      tpl: "{N} «маленьких удовольствий» от тела, которые мне доступны прямо сейчас.",
      class: "retrieval", complexity: "basic", time: "present",
      N,
    },
    {
      tpl: "{N} {thing}, по которым я узнаю, что моё тело хочет паузу.",
      class: "evaluative", complexity: "working", time: "present",
      N,
      thing: ["сигналов", "ощущений", "мыслей", "движений", "интонаций в голосе"],
    },
  ],

  imagination: [
    {
      tpl: "{N} способов, которыми эта ситуация выглядела бы как {genre}.",
      class: "generative", complexity: "developmental", time: "timeless",
      N,
      genre: ["сказка", "детектив", "пьеса", "научный отчёт", "ритуал", "новостная заметка", "кулинарный рецепт", "стих"],
    },
    {
      tpl: "{N} вариантов, как это могло бы развиваться, если бы я доверился {hint}.",
      class: "projecting", complexity: "developmental", time: "future",
      N,
      hint: ["интуиции", "телу", "случаю", "первому импульсу", "тишине", "чужому совету"],
    },
    {
      tpl: "{N} вариантов, как это могло бы развиваться, если бы я не доверился {hint}.",
      class: "projecting", complexity: "developmental", time: "future",
      N,
      hint: ["интуиции", "телу", "случаю", "первому импульсу", "тишине", "чужому совету"],
    },
    {
      tpl: "{N} миров, в которых эта проблема — не проблема, а ресурс.",
      class: "generative", complexity: "advanced", time: "timeless",
      N,
    },
  ],

  absurd: [
    {
      tpl: "{N} {thing}, в которых ответ был у вопроса с самого начала.",
      class: "analytical", complexity: "limit", time: "timeless",
      N,
      thing: ["ситуаций", "разговоров", "решений", "снов", "стихов"],
    },
    {
      tpl: "{N} способов услышать вопрос, который не был задан.",
      class: "meta_generative", complexity: "limit", time: "timeless",
      N,
    },
    {
      tpl: "{N} {thing}, которые истинны и ложны по очереди в течение одного дня.",
      class: "analytical", complexity: "limit", time: "timeless",
      N,
      thing: ["утверждений", "ощущений", "решений", "правил"],
    },
    {
      tpl: "{N} вопросов, на которые «нет» и «да» означают одно и то же.",
      class: "analytical", complexity: "limit", time: "timeless",
      N,
    },
    {
      tpl: "{N} {thing}, которые отвечают на вопрос своим присутствием.",
      class: "evaluative", complexity: "limit", time: "timeless",
      N,
      thing: ["людей", "звуков", "пауз", "взглядов", "запахов", "движений"],
    },
    {
      tpl: "{N} {thing}, которые становятся вопросом, как только ты пытаешься их понять.",
      class: "meta_generative", complexity: "limit", time: "timeless",
      N,
      thing: ["слов", "явлений", "снов", "ответов", "правил"],
    },
    {
      tpl: "{N} {thing}, в которых рассказ о невозможности уже есть возможность.",
      class: "analytical", complexity: "limit", time: "timeless",
      N,
      thing: ["ситуаций", "идей", "признаний", "молчаний"],
    },
    {
      tpl: "{N} парадоксов, через которые мне легче понять себя, чем через определения.",
      class: "reflexive", complexity: "limit", time: "timeless",
      N,
    },
  ],
};

// Extra2: high-fanout templates for the remaining shortfall.
export const EXTRA2_TEMPLATES = {
  reflection: [
    {
      tpl: "{N} {thing}, которые я хочу простить себе сегодня.",
      class: "reflexive", complexity: "developmental", time: "present",
      N,
      thing: ["ошибок", "слов", "избеганий", "моментов слабости", "решений", "пауз"],
    },
    {
      tpl: "{N} {thing}, в которых я хочу побыть просто наблюдателем.",
      class: "reflexive", complexity: "working", time: "present",
      N,
      thing: ["ситуаций", "реакций", "разговоров", "ритмов", "решений"],
    },
  ],
  meta: [
    {
      tpl: "{N} {thing}, которые превращают вопрос в практику.",
      class: "evaluative", complexity: "advanced", time: "timeless",
      N,
      thing: ["условий", "признаков", "форматов", "паузы", "ритмов", "повторений"],
    },
    {
      tpl: "{N} вопросов, которые звучат лучше, если задать их без вопросительной интонации.",
      class: "analytical", complexity: "advanced", time: "timeless",
      N,
    },
    {
      tpl: "{N} {thing}, по которым я отличаю «искренний» вопрос от «риторического».",
      class: "evaluative", complexity: "advanced", time: "timeless",
      N,
      thing: ["признаков", "сигналов", "интонаций", "пауз"],
    },
  ],
  modelling: [
    {
      tpl: "{N} {thing}, которые я бы добавил в эту модель, чтобы её усложнить осмысленно.",
      class: "generative", complexity: "advanced", time: "future",
      N,
      thing: ["переменных", "ролей", "обратных связей", "временных шкал", "ограничений"],
    },
    {
      tpl: "{N} {thing}, которые я бы убрал из этой модели, чтобы её упростить честно.",
      class: "generative", complexity: "advanced", time: "future",
      N,
      thing: ["переменных", "ролей", "обратных связей", "временных шкал", "ограничений"],
    },
  ],
  senses: [
    {
      tpl: "{N} {sense_object}, которые я хочу запомнить именно из сегодняшнего {tod}.",
      class: "retrieval", complexity: "working", time: "present",
      N,
      sense_object: ["звуков", "запахов", "оттенков", "касаний", "вкусов"],
      tod: ["утра", "дня", "вечера", "ночи", "часа"],
    },
    {
      tpl: "{N} способов снизить скорость через {sense}.",
      class: "generative", complexity: "working", time: "timeless",
      N,
      sense: ["слух", "обоняние", "касание", "взгляд", "вкус", "дыхание"],
    },
  ],
  imagination: [
    {
      tpl: "{N} {thing}, которые могли бы измениться в этом дне, если бы у него был автор.",
      class: "generative", complexity: "developmental", time: "present",
      N,
      thing: ["сцен", "диалогов", "ритмов", "поворотов", "героев"],
    },
    {
      tpl: "{N} {thing}, которые могли бы остаться, если бы дня писал я как режиссёр.",
      class: "projecting", complexity: "developmental", time: "present",
      N,
      thing: ["сцен", "пауз", "разговоров", "встреч", "переходов"],
    },
    {
      tpl: "{N} вариантов «эпиграфа» к моей жизни сегодня.",
      class: "generative", complexity: "developmental", time: "present",
      N,
    },
    {
      tpl: "{N} вопросов, которые я задам другу, оказавшись в его теле на день.",
      class: "meta_generative", complexity: "developmental", time: "future",
      N,
    },
    {
      tpl: "{N} вариантов «другой судьбы» этой ситуации, в которые можно поверить хотя бы на минуту.",
      class: "generative", complexity: "developmental", time: "future",
      N,
    },
    {
      tpl: "{N} {thing}, которые я бы взял с собой в воображаемое путешествие на год.",
      class: "evaluative", complexity: "working", time: "future",
      N,
      thing: ["людей", "вещей", "вопросов", "практик", "звуков", "книг"],
    },
    {
      tpl: "{N} миров, в которых эта моя слабость — суперсила.",
      class: "generative", complexity: "advanced", time: "timeless",
      N,
    },
  ],
};
