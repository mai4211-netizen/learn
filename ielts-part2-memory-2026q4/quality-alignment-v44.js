/* Focused alignment pass: keep word audio selection intact and improve recall cues. */
(() => {
  const groups = window.P2_2026Q4_GROUPS || [];
  const byQ = new Map(groups.flatMap(g => (g.topics || []).map(t => [t.q, t])));

  // Q56: use the role, not a hard-to-recall athlete's name; simplify the long explanation.
  const q56 = byQ.get("Q56");
  if (q56?.reviewed?.[0]) {
    q56.reviewed[0].text = q56.reviewed[0].text.replace(
      /Marie-Philip Poulin, the captain of Canada's women's ice hockey team/g,
      "the captain of Canada's women's ice hockey team"
    ).replace(/Marie-Philip Poulin/g, "the team captain");
  }
  if (q56?.reviewed?.[3]) {
    q56.reviewed[3].text =
      "She has won three Olympic gold medals. Outside matches, she supports programmes that help children try sport. I admire that she cares about young players as well as her own career. In interviews, she seems calm and focused. She often talks about the team, not just herself. I respect her because she takes responsibility for her teammates.";
  }
  if (window.P2_2026Q4_ZH_TRANSLATIONS) {
    window.P2_2026Q4_ZH_TRANSLATIONS.Q56 =
      "我想介绍一位我很钦佩的运动员——加拿大女子冰球队的队长。我第一次注意到她，是在温哥华看加拿大对美国的比赛时。那也是我第一次现场看女子冰球。冰球移动得太快，我几乎跟不上，但这位队长一直很活跃，不断给队友指示。即使美国队进球更多，她仍然专注地组织进攻。后来我了解到，她获得过三枚奥运金牌。比赛之外，她也支持帮助儿童接触运动的项目。我欣赏她关心年轻球员，也认真对待自己的职业生涯。采访中，她显得冷静而专注，谈论的常常是团队，而不只是自己。我钦佩她，因为她会为队友承担责任。即使球队落后，她也能在压力下保持冷静，并鼓励队友。";
  }

  // Keep recall cues tied to the actual story beats in the user's K11 sample.
  if (typeof IELTS_RECALL_CUES !== "undefined") {
    IELTS_RECALL_CUES.Q03 = [
      "crowded shopping centre","weekend afternoon","very crowded",
      "near the escalators","food area","walk slowly","hard to find a seat",
      "chain stores","closed for renovation","less to look at",
      "nearly two hours","bought almost nothing","coffee and left",
      "café area was full","wait before we could order",
      "difficult to have a proper conversation","crowds made everything stressful",
      "prefer visiting on weekday mornings"
    ];
  }

  // Q03: keep the idea, remove the unstable "remember thinking" construction.
  const q03 = byQ.get("Q03");
  if (q03?.reviewed) {
    for (const part of q03.reviewed) {
      part.text = part.text.replace(
        /I remember thinking that a short visit had taken much more time than I planned\./g,
        "A short visit took much longer than I expected."
      );
    }
  }

  // Reusable sentence openings and transitions stay visually quiet (underlined).
  window.weakReuseMarkup = function(segment) {
    const patterns = /\b(?:The person I'd like to talk about is|The person I'd like to talk about|I'd like to talk about|One thing I know is|We met|She is|She usually|One thing she does is|For example|What I remember most is|I like her because|So I think she is|It happened|I went with|It started when|I wanted to|First|Then|After that|The problem was|In the end|I felt|It taught me|It is a|There are|It feels|I usually go with|I like it because|For me|I first heard about|I chose it because|What I like is|It helps|The main reason is|I first noticed|One weekend morning|We could stop whenever we wanted to|I met at school more than ten years ago|more than ten years ago|I had originally planned|At first|After a while|I was worried|I used to think|I realised|I would recommend|It was my first time|That is why|That's why|It reminded me|I really enjoyed|I still remember|One reason is|The best part was|I enjoyed it because|I found it|I was surprised|That made me feel|I would suggest)\b/gi;
    let html = "", last = 0, match;
    while ((match = patterns.exec(segment))) {
      html += (typeof esc === "function" ? esc(segment.slice(last, match.index)) : segment.slice(last, match.index));
      const phrase = typeof esc === "function" ? esc(match[0]) : match[0];
      html += '<span class="reuse-pattern">' + phrase + '</span>';
      last = match.index + match[0].length;
    }
    return html + (typeof esc === "function" ? esc(segment.slice(last)) : segment.slice(last));
  };


  // Recommended: usually one short cue per sentence, focused on a thing, action or feeling.
  // "My highlights" remains independent and is not changed.
  const nouns=new Set(("building buildings centre mall shop shops offices art artists brands exhibition exhibitions displays design " +
   "park forest lake mountain hills trees paths bikes bicycle cycling photos birds view water sunset deer " +
   "k11 guangzhou japan nara tokyo vancouver canada germany city transport street " +
   "concert music group singer fans stage lights hotel airport flight train ticket tickets trip journey bus taxi " +
   "watch smartwatch phone battery screen app technology exercise sleep steps functions data settings " +
   "pottery clay studio cups sculpture sculptures crafts market video film movie book characters judy nick zootopia " +
   "mooncakes mooncake dough filling mould mother sister family children coffee drink restaurant " +
   "bottle bottles deposit refund machine recycling plastic waste environment law discount reward points " +
   "tomatoes tomato plants balcony leaves fruit sunlight garden painting paintings platform website business customers " +
   "team captain player players match game puck hockey sport sports competition medal medals " +
   "project plan interview message work salary job morning evening afternoon weekend hour hours " +
   "problem solution pressure history culture tradition floor floors place places change changes attitude reason result").split(/\s+/));
  const feelings=new Set(("happy proud excited worried nervous relieved calm confident upset disappointed stressed frustrated " +
   "comfortable uncomfortable boring bored interesting interested relaxing relaxed peaceful impressed meaningful " +
   "memorable beautiful creative modern fun difficult challenging surprised surprising successful friendly " +
   "patient tiring tired exhausted afraid grateful stressful confusing practical awkward old-fashioned " +
   "easy hard useful positive personal realistic skilled important").split(/\s+/));
  const actions=new Set(("visited rented rode cycled watched saw took bought walked climbed helped taught learned discovered " +
   "found created designed explained solved decided chose prepared organised organized shared supported " +
   "encouraged practised practiced grew planted watered cooked ate read wrote tried paid returned recycled " +
   "collected waited joined played travelled traveled stayed changed noticed enjoyed admired preferred " +
   "recorded saved won lost finished met started left visited").split(/\s+/));
  const modifiers=new Set(("modern traditional local small large tall quiet green cool colourful colorful beautiful busy " +
   "bright new old young national international public shopping plastic natural online simple soft sweet fresh " +
   "different favourite favorite expensive daily positive realistic").split(/\s+/));
  const weak=new Set(("i we he she it they this that these those my our his her their the a an " +
   "overall finally however therefore also very really quite just only most more good nice things thing " +
   "someone something one people person friend friends family place places time times day days year years " +
   "story stories experience experiences situation situations said thought felt liked wanted have had has " +
   "do does did could would should can will was were is are because about with from into and but to for").split(/\s+/));
  const tokens=s=>[...s.matchAll(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)].map(m=>({w:m[0].toLowerCase(),s:m[0],a:m.index,b:m.index+m[0].length}));
  // Manually checked minimal semantic anchors for each final question and paragraph.
  // Keep cues short: who/what, target, action, reason, result. Do not alter user's own bolds.
  const semanticCueRows = {"Q01":[["K11","downtown Guangzhou","shops","offices"],["friend","art and design","public spaces","visit together"],["modern commercial building","artworks","colourful lights","design displays"],["coffee","take photos","buy anything","walk around"],["brings art","everyday place","public transport","meet a friend"]],"Q02":[["Dafu Mountain","friend","afternoon"],["cycling","weekend","morning","after lunch"],["rent bikes","beside the lake","chat","quieter areas"],["afternoon heat","tired and sweaty","shade","air conditioner"],["spending time","strong sun","morning visits"]],"Q03":[["K11","weekend afternoon","friend"],["escalators","food area","packed","find a seat"],["chain stores","renovation","less to look at"],["two hours","bought almost nothing","coffee","noise"],["busy place","stressful","weekday mornings"]],"Q04":[["Chinese pottery history","small studio","traditional bowls","changed over time"],["old pottery","museums","inspiration","modern design","not simply copy"],["clay by hand","kiln","different periods","small changes"],["connects history","see and use","practical","enjoys history"]],"Q05":[["snow-skin mooncakes","child"],["Mid-Autumn Festival","mother","together"],["sweet filling","soft dough","mould","easy"],["controlling the pressure","too hard","strange shape","gently","sticky"],["looked right","ate the mooncakes","proud","patient"]],"Q06":[["pottery studio","workshop","older"],["invited me","rabbit","too round","round ears","bear"],["did not take","explained","try again","proud"],["visit her studio","share photos","never makes me feel silly"],["respect","patient","mistakes"]],"Q07":[["noisy","K-pop concert","Hong Kong"],["two close friends","fans","dinner","songs"],["crowd","cheering","hardly hear","quieter songs","strong lights"],["loudest moment","sing along","floor"],["volume","enjoyed","cheering","unforgettable"]],"Q08":[["law","returning plastic bottles","recycling"],["Germany","recycling machine","deposit"],["points","shopping discount","choices"],["plastic waste","reduce it","easy to use","signs"],["happy","ordinary shopping trip","plan separately"]],"Q09":[["smartwatch","battery","quickly"],["exercise and sleep","evening","end of the day","every day"],["battery","turning off","lost power","pay"],["searched online","same problem","updating","installed"],["lasted much longer","relieved","without charging"]],"Q10":[["pottery market","Guangzhou"],["social media","old-fashioned","colourful pieces","watch"],["local makers","shaping clay","colourful cups","small sculptures"],["young makers","more local people","visit","learn","show and sell"],["modern and fun","changed my impression","visiting the market"],["local people","supported local artists","community"]],"Q11":[["long-term goal","online art platform","few years"],["Claire","independent artists","preview","own wall"],["choose a painting","fit into a room","size and colours"],["few artists","small group","management","feedback"],["art","design","technology","independent artists"]],"Q12":[["former classmate","doctor","patient and organised"],["Korean medical drama","stay calm","quick decisions","help people"],["volunteer work","health activities","other volunteers"],["care for people","training","many years","help people"],["patient","organised","keep studying"]],"Q13":[["K11","boring","one visit"],["large shopping centre","art displays","ordinary mall"],["weekend afternoon","chain stores","renovation"],["two hours","bought almost nothing","coffee","crowded","clear plan"],["shops felt similar","caught my attention","special exhibition"]],"Q14":[["recent change","exercise and sleep"],["smartwatch","sat for hours","bed too late","daily routine"],["steps","activity rings","short walk","sleep app"],["small changes","walking shoes","phone away","busy day"],["walk more regularly","sleep"]],"Q15":[["fan gathering","Hong Kong","small party"],["two close friends","fans","meeting other people"],["café","nine other fans","shy","chatting"],["strangers","other cities","in common","social media accounts"],["strangers","shared interest","new friendships"]],"Q16":[["Dafu Mountain","lake","Guangzhou"],["green hills","tall trees","lake","reflects the trees","birds"],["once or twice a month","weekend morning","rent bikes","lake"],["taking pictures","pause","hour or two"],["exercise","nature","without leaving the city","relaxing"]],"Q17":[["scrolling","social media"],["smartwatch","walk","K-pop updates","art and design"],["useful","local pottery market","design ideas","unrelated videos"],["automatically","out of curiosity","five minutes","two hours"],["wastes time","lose track","time limit","phone away"]],"Q18":[["pottery","shape clay","older","patient"],["studio","rabbit","too round","round ears","bear"],["steady","pressure","clay","soft"],["beginners","step slowly","practise","proud"],["basic skill","patient","goes wrong"]],"Q19":[["Claire","taking photos","school","small details"],["rented bikes","lake","photograph","natural light"],["travel","shadows","signs","reflections","K11"],["photo album","details","missed"],["patience","ordinary things","simple place"]],"Q20":[["saved money","smartwatch"],["exercise and sleep","salary","each month"],["online shopping","Apple Store","models","heart-rate"],["choosing a model","prices","reviews","comfortable","cheaper options"],["suited my needs","saved","every day"]],"Q21":[["Germany","bottle-deposit system","online"],["bottled drinks","deposit","return","money back"],["special trip","supermarket entrances","weekly shopping"],["keep empty bottles","throwing them away","better habits","plastic waste"],["Customers benefit","environment benefits","similar system","easy to find"]],"Q22":[["Zootopia","storybook","animal characters","book"],["Judy","rabbit","police officer","Nick","fox"],["work together","case","trust","different strengths"],["prejudice","prove","background","humour"],["stereotypes","trust each other"]],"Q23":[["ticket seller","over an hour","reply"],["two friends","Hong Kong","group chat","tickets","hotel"],["second-hand platform","still available","transferred","quickly"],["stopped answering","checking my phone","more than an hour","another seller"],["another seller","replied quickly","ticket transfer"],["relieved","nervous","enough time","reply"]],"Q24":[["Mid-Autumn","advertisement","Yuqi","K-pop"],["social media","mooncake set","personal logo","connected"],["video","snow-skin mooncake","filling","mould"],["fan","watched","tried","ordinary advertisement"],["practical","celebrity","fans"]],"Q25":[["concert trip","two friends"],["Hong Kong","group chat","tickets","hotel and transport"],["booking details","meeting times","before paying"],["ticket seller","stopped replying","more than an hour","another seller"],["another seller","secured the ticket","travel arrangements","division of work"],["teamwork","responsibility","backup plan"]],"Q26":[["law","returning plastic bottles","recycling"],["Germany","recycling machine","deposit"],["points","shopping discount","choices"],["support","small reward","entrances","normal shopping"],["plastic waste","recycling","think more carefully"],["realistic change","ordinary people"]],"Q27":[["three","morning","Hong Kong"],["working overtime","might not stay together","hotel","go"],["urgent work","day off","train","early flight"],["three","sleepy","airport","more expensive"],["concert on time","work","worth it"]],"Q28":[["Claire","popular classmate","school"],["difficult homework","explained","patient","help"],["travel","transport and hotels","listens","remembers"],["centre of attention","comfortable","reply","friend"],["helpful","easy-going","trust","relaxed"]],"Q29":[["good service","Apple Store","smartwatch"],["Guangzhou","exercise and sleep","model"],["staff member","asked","exercise","heart-rate","sleep"],["cheaper options","not push","explained","technical words"],["set up","first smartwatch","start"],["well looked after","listened","time to decide","confident"]],"Q30":[["enjoyable evening","concert","two close friends"],["fans","dinner","songs","photos"],["cheering","hardly hear","favourite moment","lyrics together"],["other fans","café","twelve","shared photos"],["tired","happy","close friends","other fans"]],"Q31":[["Zootopia 2","home","first film"],["Judy and Nick","new case","high expectations","easy to follow"],["city's history","names","background details","lost track"],["funny conversations","jokes","less lively"],["colourful animal city","slow parts","watch it again"],["harder to follow","humour"]],"Q32":[["friend","pottery","technical details"],["clay","firing temperatures","technical words","finished pieces"],["excited","rude","colourful modern pieces","questions","basic idea"],["impatient","polite","firing temperatures","interested"],["listening","respect"]],"Q33":[["Claire","organised","school","class projects"],["difficult homework","short list","smaller steps","explained"],["to-do list","trip","transport and hotels","change the plan"],["stay calm","unexpected","help other people","own work"],["simple and flexible","easy to follow"]],"Q34":[["younger sister","first trip abroad","fan meeting","South Korea"],["airport","hotel","venue","on her own"],["safe hotel","visa","route","maps","message"],["journey herself","confident","problem"],["prepared","brave","proud"]],"Q35":[["Claire's apartment","Guangzhou","would not want"],["balcony","tomatoes","art supplies","creative"],["balcony","drink","drawings","tomato plants","photos"],["comfortable","busy","storage space"],["reflects her personality","larger home","quieter place"]],"Q36":[["Claire","languages","English","Japanese"],["Friends","chats","hotel","receptionist"],["Japanese","learning app","phrases","every day"],["mistakes","repeat","calm","conversation"],["communicate","tests","normal part"]],"Q37":[["ice hockey","Vancouver","best friend"],["Canada","United States","jerseys","crowd"],["puck","difficult to follow","rules","changed direction"],["Canadian player","US","lost","captain"],["atmosphere","new sport","interested"]],"Q38":[["changed","plan","concert"],["working overtime","not stay together","hotel","go"],["urgent work","day off","train","early flight"],["tiring","expensive","three","packed"],["concert on time","happy","special chance"]],"Q39":[["Claire","growing tomatoes","balcony","apartment"],["produced fruit","photo","small","proud"],["every morning","waters","leaves","sunlight","salad"],["satisfying","grown herself","drink","relaxing hobby"],["daily project","progress"]],"Q40":[["video","pottery market","social media"],["after work","old-fashioned","colourful cup","played"],["shaping clay","finished pieces","colourful cups","sculptures"],["plain piece","finished object","process","visiting the market"],["playful designs","view of pottery","traditional bowls"],["young local makers","products","personal"]],"Q41":[["interview","Soyeon","YouTube"],["concert","Hong Kong","curious","story"],["older interview","2022 comeback","member had left","new album"],["starting again","difficult","move forward","openly"],["perform on stage","difficulties","behind the music"],["respected","honest","meaningful"]],"Q42":[["pottery studio","hand","traditional Chinese"],["colourful cups","small sculptures","character-shaped","details"],["clay","kiln","glaze","mistakes","small changes"],["old bowls","not simply copy","new shapes"],["skilled","careful","attention to detail","professional"]],"Q43":[["Claire","cheerful","school","simple things"],["tomatoes","photo","happy","excited"],["smiles","week","coffee","plans change","draws"],["big event","coffee","message","positive moments"],["positive attitude","positive myself"]],"Q44":[["younger sister","trip abroad alone","shy","challenge"],["fan meeting","South Korea","airport","venue","own"],["safe hotel","visa","route","maps","message"],["herself","confident","each step"],["prepared","brave","proud"]],"Q45":[["important decision","day off","concert"],["working overtime","might not stay together","hotel","go"],["urgent work","day off","train","early flight"],["three","packed","tiring","expensive"],["concert on time","catch up","might not happen","worth it"]],"Q46":[["changed my mind","taking time off","last year"],["work","irresponsible","might not stay together","hotel","go"],["urgent work","leave","train","early flight","three"],["tiring","arrived","lights went down","worth"],["responsible at work","important moments","no longer reject"]],"Q47":[["forest park","lake","Guangzhou","weekend"],["morning","rented bikes","lake","photos"],["green hills","tall trees","birds","reflects the trees"],["places to sit","don't like cycling","short walk","sporty"],["chat","catch up","visit with friends"],["early","water","no need to rush","own pace"]],"Q48":[["decision","day off","concert","Hong Kong"],["working overtime","might not stay together","hotel","go"],["urgent work","day off","train","early flight"],["three","sleepy","expensive","on time"],["happy","work","special opportunity"],["decision","not to reject","schedule"]],"Q49":[["snow-skin mooncakes","Mid-Autumn Festival"],["sweet filling","mould","round shape","family reunion"],["mother","wrap","mould","too hard","gently"],["small pieces","soft texture","sweet taste"],["mother","little","taste","family"]],"Q50":[["Claire","online art platform","school","drawing"],["painting","own wall","independent artists","preview"],["few artists","social media","expanded","overseas","feedback"],["both sides","Artists","customers","confident"],["successful business","real problem","improving"]],"Q51":[["childhood friend","Claire","school","draw together"],["music","difficult homework","explained","bad"],["coffee","school","old memories"],["kind","listened","mistakes"],["busier","naturally","close"]],"Q52":[["K11","tall building","Guangzhou","offices"],["modern","lower buildings","artworks","colourful lights","design displays"],["friend","public areas","photos","coffee"],["shop","meet friends","recognise","public transport"],["brands","artists","exhibitions","changing","go back"]],"Q53":[["storybook","Zootopia","film","book"],["Judy","rabbit","police officer","Nick","fox"],["case","trust","cooperate","different strengths"],["animal city","busy streets","neighbourhoods","pictures","real place"],["happy","trust each other","first impressions","colourful"]],"Q54":[["Claire","healthy","daily routine","school"],["morning","work gets busy","afternoon","giving it up"],["bed","reads","to-do list","ordinary meals","enough sleep"],["extreme diet","gym","small habits","busy"],["flexible attitude","realistic","maintain"]],"Q55":[["younger sister","South Korea","helped"],["fan meeting","airport","hotel","nervous","alone"],["encouraged","safe hotel","visa","route","arrive early"],["getting lost","hotel address","booking details","phone"],["maps","message","confident"],["support","without taking over","independent"]],"Q56":[["Maya Chen","ice hockey","captain","Vancouver"],["directing","puck","organise the attacks"],["national team","international championship","captain","successful"],["quiet and friendly","local schools","younger girls","new players"],["skilled","cares","good teammate"]],"Q57":[["pottery studio","creative","workshop","craft market"],["traditional","not simply copy","colourful cups","character-shaped"],["clay by hand","kiln","glaze","adjusting a shape"],["rabbit","too round","round ears","bear","fun"],["creative","new possibilities","design"]],"Q58":[["smartwatch","difficult","first"],["Apple Store","exercise and sleep","set it up","confusing"],["icons","settings","activity rings","numbers","sleep reports"],["instructions","one by one","check the time","steps","sleep data"],["confident","daily routine"]]};
  const priorRecommendedRanges = window.recommendedRanges;
  window.recommendedRanges = function(text, topic) {
    if (!text) return [];
    const paras = topic?.reviewed || [];
    const pIndex = paras.findIndex(p => p?.text === text);
    const cues = semanticCueRows[topic?.q]?.[pIndex];
    if (!cues) return typeof priorRecommendedRanges === 'function' ? priorRecommendedRanges(text, topic) : [];
    const ranges = [], lower = text.toLowerCase();
    let cursor = 0;
    for (const cue of cues) {
      if (!cue || cue.length > 40) continue;
      const needle = cue.toLowerCase();
      let at = lower.indexOf(needle, cursor);
      if (at < 0) at = lower.indexOf(needle);
      if (at < 0) continue;
      const before = at ? lower[at - 1] : '', after = lower[at + cue.length] || '';
      if (/[a-z0-9]/.test(before) || /[a-z0-9]/.test(after)) continue;
      if (!ranges.some(([a,b]) => at < b && at + cue.length > a)) {
        ranges.push([at, at + cue.length]);
        cursor = at + cue.length;
      }
    }
    return typeof window.normalizeRanges === 'function'
      ? window.normalizeRanges(ranges, text.length)
      : ranges.sort((a,b)=>a[0]-b[0]);
  };

  // Optional word pronunciation, separate from the Jenny full-answer player.
  // Preserve native text selection and the user's bold-selection toolbar.
  const wordSpeechToggle = typeof document !== "undefined" && typeof document.getElementById === "function"
    ? document.getElementById("wordSpeechToggle")
    : null;
  const wordSpeechKey = "p2-2026q4-word-speech";
  if (wordSpeechToggle) {
    try {
      const saved = localStorage.getItem(wordSpeechKey);
      if (saved !== null) wordSpeechToggle.checked = saved === "on";
    } catch (_) { /* Private browsing may block storage. */ }
    wordSpeechToggle.addEventListener("change", () => {
      try { localStorage.setItem(wordSpeechKey, wordSpeechToggle.checked ? "on" : "off"); } catch (_) {}
      if (!wordSpeechToggle.checked) window.speechSynthesis?.cancel();
    });
  }
  document.addEventListener("dblclick", event => {
    if (!wordSpeechToggle?.checked) return;
    const paragraph = event.target.closest?.("#answer .answer-paragraph");
    if (!paragraph) return;
    const selected = window.getSelection();
    const word = (selected?.toString().match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/)||[])[0];
    if (!word || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, true);

  if (typeof window.render === "function") window.render();
})();
