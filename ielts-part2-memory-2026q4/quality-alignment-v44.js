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
  const semanticCueRows = {"Q01":[["K11","downtown Guangzhou","weekdays","shops","office floors"],["friend","art","design","public spaces","cool art","photo spots","new exhibition"],["outside","modern tower","landmark","Inside","artworks","colourful lights","design displays","creative","different style"],["don't","buy","iced coffee","window","chat","photos"],["brings art","everyday place","metro","basement","easy","after work"]],"Q02":[["Dafu Mountain","Forest Park","Guangzhou","friend","don't","afternoon"],["cycling","weekends","morning","cooler","after lunch","don't enjoy"],["rent bikes","gate","lake","trees","chat","busy","deeper","crowds"],["afternoon heat","super hot","twenty minutes","tired","sweaty","bugs","itchy","uncomfortable","shade"],["spending time","hot afternoons","rather","cool café"]],"Q03":[["K11","crowded","downtown Guangzhou","weekend afternoon"],["shops","offices","art displays","stairs","lifts","food area","packed","slowly","bumping","impossible","seat"],["floor to floor","chain stores","under repair","tighter"],["two hours","almost nothing","long line","twenty minutes","coffee","straight home","loud noise","hard to chat"],["don't mind","stressful","slowed","weekday mornings"]],"Q04":[["Chinese pottery history","studio","curious","bowls","shapes","patterns","dynasties"],["studies history","museums","Song","Ming","takes notes","time period","curve","glaze"],["own work","history books","traditional detail","modern cup","clay figure","by hand","hot oven","never","copying"],["loves history","different eras","boring","far away","real","easy"]],"Q05":[["kid","snow-skin mooncakes"],["Mid-Autumn Festival","mum","at home","together","instead"],["wrap","sweet filling","soft skin","close","mould","pattern","easy","try"],["too hard","strange shape","gently","sticky","messy","few tries"],["neat mooncake","fridge","together","proud","myself","patient"]],"Q06":[["pottery studio","weekend workshop","stayed in touch","older","pieces"],["studio","small animal","clay","rabbit","too round","start over","round ears","bear"],["didn't","fix","explained","try again","wasn't perfect","proud","myself"],["drink tea","chat","new pieces","never","silly","patient","mistakes"]],"Q07":[["noisy","K-pop concert","Hong Kong","last year"],["two close friends","fans","excited","dinner","venue","songs","photos"],["lights","cheering","music","singing along","hardly hear","quieter songs","clapped","shouted","screens","bright lights"],["loudest moment","mics","crowd","louder","lyrics","bass","floor"],["noise","tired","shouting","thousands","stress","fun","not","annoying"]],"Q08":[["environmental rule","rewards","plastic bottles","recycling"],["Germany","bottle-return system","deposit","bottled drinks","empty bottles","machines","supermarkets","money back"],["scan","phone app","points","shopping discount","choices","strict"],["plastic waste","easy","Supermarkets","front doors","empty bottles","weekly shopping"],["happy","recycling","everyday shopping","chore"]],"Q09":[["tech problem","smartwatch","battery","running out"],["exercise","sleep","steps","rely","twenty percent","before dinner","one hundred percent","overnight"],["getting old","charging","restarting","turning off","lost power","broken","new one","free fix"],["searched online","same bug","updating","system","installed"],["update","lasted","all day","relieved","didn't","spend money"]],"Q10":[["local news","pottery market","Guangzhou"],["social media","after work","scrolled past","boring","old-fashioned","colourful pieces","caught my eye"],["local makers","wet clay","by hand","tables","colourful cups","clay figures","animal-shaped pieces","address","opening hours"],["local people","traditional crafts","local artists","show","sell","young people","weekend"],["changed my view","traditional crafts","sent","local people","supported","local artists","city"]],"Q11":[["long-term goal","online art platform","few years"],["Claire","online art business","independent artists","preview","wall","before paying"],["upload","living room","pick","painting","size","colours","match","product photo"],["start small","five or ten","artists","test","branding","teamwork","business skills","basic version","user feedback"],["goal","art","design","tech","independent artists","more buyers"]],"Q12":[["former classmate","doctor","school","calm","patient","well organised"],["medicine","medical drama","stay cool","fast decisions","help people","respect"],["volunteer work","neighbourhood","health checks","health tips","older people","other volunteers","organise"],["care","practical","medical training","many years","study plans","never","giving up"],["great doctor","patient","organised","help others"]],"Q13":[["K11","Guangzhou","boring","weekend afternoon"],["shopping centre","shops","offices","art displays","modern","stylish","ordinary mall"],["floor to floor","chain stores","under repair","art displays","none","caught our eye"],["two hours","almost nothing","long line","phones","twenty minutes","coffee","straight home"],["boring","same","nothing","attention","new exhibition"]],"Q14":[["improved","exercise","sleep habits"],["smartwatch","daily steps","sleep","data","sat","hours","too late","routine"],["gentle buzz","sit still","activity rings","hardly moved","twenty-minute walk","sleep app","relax"],["tiny habits","strict timetable","nearby shops","bus ride","phone","desk","bed","keep up"],["healthier","sleep better","more energy"]],"Q15":[["fan gathering","K-pop concert","Hong Kong","small party","impressed"],["two close friends","fans","same group","excited","same music"],["café","venue","nine","shy","didn't know","drinks","chatting"],["strangers","became friends","other cities","losing","voices","concert clips","favourite songs","social media","stay in touch"],["don't","strangers","special","shared hobby","new friends"]],"Q16":[["Dafu Mountain","Forest Park","peaceful lake","Guangzhou"],["twice a month","weekend morning","fresh","cool","green hills","tall trees","quiet paths","reflects","mirror"],["rent bikes","front gate","lake","birds","cool breeze","photos","wooden bridges","chat"],["hour or two","whole day","before lunch"],["exercise","nature","without leaving","city","relaxing","noisy mall"]],"Q17":[["daily habit","wastes","scrolling","short videos","social media"],["after work","smartwatch","hardly moved","walk","sofa","phone","K-pop updates","art","design"],["useful","pottery market","design ideas","random videos","nothing","interests","watching"],["playing","by itself","swiping","curiosity","five minutes","midnight","two hours"],["waste of time","lose track","timer","phone down"]],"Q18":[["pottery","shape clay","by hand","older","studio","skilled","patient"],["studio","small animal","clay","rabbit","too round","start over","round ears","bear"],["didn't","fix","hands steady","gently","soft","beginners","step","practise"],["wasn't perfect","proud","myself","basic pottery","patient","lesson"]],"Q19":[["Claire","taking photos","school","ten years","tiny details","miss"],["weekend morning","rented bikes","lake","water","green hills","quiet","morning light","waited","angle"],["camera","travel","famous sights","shadows","street signs","reflections","K11","art displays","pose","scenery shots"],["digital photo album","sent","notice","details","missed"],["patience","everyday beauty","simple place","special"]],"Q20":[["saved up","smartwatch"],["exercise","sleep","didn't","right away","fixed amount","salary","payday"],["cut back","online shopping","cooked","at home","takeout","effort","savings grow"],["few months","Apple Store","models","exercise","heart-rate","sleep","choosing","compared prices","reviews","sizes","lightest","cheaper models","didn't push"],["proud","own savings"]],"Q21":[["Germany","bottle-deposit system","environmental rule"],["online","deposit","bottled drinks","empty bottles","machines","supermarkets","money back","smart","simple"],["don't need","special trip","front doors","empty bottles","weekly shopping","scans","ticket","checkout"],["clear reason","keep","throwing","better habits","plastic waste"],["win-win","deposit back","cleaner","similar system","my country"]],"Q22":[["picture storybook","Zootopia","movie","characters","book form"],["Judy","rabbit","police officer","bigger animals","size","Nick","fox","judged unfairly","never","trusted"],["teaming up","tough case","don't trust","argue","work together","different skills","solve"],["unfair ideas","proves","background","colourful pages","funny jokes"],["memorable","rabbit","fox","fixed ideas","true friends"]],"Q23":[["stressful","over an hour","reply","concert-ticket seller"],["two close friends","Hong Kong","K-pop group","group chat","split up","tickets","hotel","flights"],["second-hand app","message","still free","send it over","replied","fast"],["went quiet","selling out","refreshing","few minutes","worried","miss","more than","no reply","other listings","new seller"],["answered","right away","smoothly","nervous","extra time","depends"]],"Q24":[["Mid-Autumn Festival","Yuqi","Chinese member","K-pop group"],["social media","DIY mooncake set","ready-made","at home","ingredients","mould","special logo"],["opened","box","sweet filling","soft skin","press","stamp","logo","unboxing video","cooking class"],["fan","twice","ordered","made mooncakes","messy","smiled","logo","food ad"],["clever","same","activity","singer","instead"]],"Q25":[["small team","two close friends","concert trip"],["Hong Kong","busy","group chat","split up","tickets","hotel","flights"],["second-hand app","message","still free","send it over","replied","fast"],["went quiet","selling out","refreshing","worried","miss","no reply","other listings","new seller","double-checked","flights","hotel"],["answered","smoothly","splitting","saved","solved","together"]],"Q26":[["new law","rewards","plastic bottles","recycling"],["Germany","bottle-return system","deposit","bottled drinks","empty bottles","machines","supermarkets","money back"],["scan","phone app","points","shopping discount","choices","strict"],["support","small reward","useful","Supermarkets","front doors","empty bottles","weekly shopping"],["plastic waste","think twice","single-use drinks","realistic","join in"]],"Q27":[["three","morning","concert trip","Hong Kong"],["working overtime","favourite","might not","stay together","hotel","decided"],["urgent work","team","day off","high-speed trains","sold out","early flight"],["three","packed","night before","three alarms","half asleep","airport","hot coffee","tiring","expensive"],["on time","work could wait","wouldn't","again","worth it"]],"Q28":[["Claire","friendly","popular","school","ten years","get along"],["tough homework","math question","step by step","simple","patient","help"],["kind","thoughtful","trips","hotels","transport","listens","remembers","drink","busy week"],["never","centre of attention","relaxed","busy","replies","stressed","checks in"],["warm","helpful","easy-going","trusts"]],"Q29":[["good service","Apple Store","smartwatch"],["Guangzhou","exercise","sleep","lost","model"],["staff member","asked","exercise","heart-rate","sleep","sizes","wiped","screen"],["cheaper models","didn't push","expensive","rush","explained","differences","tech words"],["set up","basic settings","sleep data","first smartwatch"],["well looked after","happy","confident"]],"Q30":[["K-pop concert","Hong Kong","two close friends"],["fans","excited","dinner","venue","songs","light sticks","photos"],["lights","cheering","music","singing along","hardly hear","old hit","every single word","crowd"],["nine","fans","café","concert videos","favourite songs","laughed"],["tired","happy","close friends","new friends","unforgettable"]],"Q31":[["didn't enjoy","Zootopia 2","home","first movie"],["Judy","Nick","brand-new case","new","characters","high hopes","fresh","warm","easy to follow"],["too long","old history","new names","background details","lost track"],["missed","funny jokes","argument","split up","fewer","jokes","less fun"],["colourful animal city","cute","too slow","wouldn't","again"]],"Q32":[["friend","pottery","technical details","wasn't","interested"],["creative pottery","colourful cups","animal figures","clay types","oven temperatures","technical words","hard to follow","finished pieces","mixed","heated"],["excited","eyes lit up","cut her off","nodding","mind","drift","ten minutes","making process","couldn't follow"],["impatient","politely","finished","water","didn't","weekend plans","relieved"]],"Q33":[["Claire","organised","school","group projects"],["checklist","split","tiny steps","drawings","ticked off","on time","late night"],["to-do list","laptop","weekend trip","trains","hotels","early","must-do things","open time","tired"],["stay calm","delayed","rains","adjusts","instead","panicking","organised","matters most","flexible"]],"Q34":[["younger sister","solo trip","abroad","shy","challenge"],["fan meeting","South Korea","nervous","airport","hotel","venue","Nobody","alone"],["safe hotel","visa steps","route","hotel address","Korean","passport","booking papers","English phrases","customs"],["map apps","by herself","selfie","hotel","problem","calmly","giving up"],["confident","proud","fear","succeeding"]],"Q35":[["Claire's apartment","Guangzhou","love visiting","wouldn't","live"],["one-bedroom flat","sunny balcony","tomato plants","clay pots","green plants","drawings","art supplies","warm","creative"],["balcony","cold drink","talk","sketches","tomatoes","excited","photos"],["too tight","crowded","sketchbooks","coffee table","paintbrushes","sink","closet space"],["relax","catch up","bigger space","storage","separate desk"]],"Q36":[["Claire","languages","school","English","confidently","Japanese"],["doesn't","memorising","word lists","Friends","repeats","out loud","overseas friends","hotel check-in","English","understood"],["Japanese","phone app","fifteen minutes","notebook","daily phrases","real life","ordering ramen"],["mistakes","misses","calmly","say it again","shy","pretending"],["languages","connect","daily habit"]],"Q37":[["live sports event","ice hockey","Canada","United States","Vancouver","last winter"],["chilly","thick coats","hot chocolate","team jerseys","crowd","cheered","goal"],["first time","ice hockey","puck","fast","barely follow","basic rules","understood"],["falling behind","calm","cheering","teammates","pushing forward","attacks","lost","never","give up"],["energy","amazing","more ice hockey"]],"Q38":[["weekend schedule","change","last minute","K-pop concert","Hong Kong"],["working overtime","favourite","might not","stay together","hotel","decided"],["urgent work","team","day off","high-speed trains","sold out","early flight"],["three","packed","night before","three alarms","half asleep","airport","tiring","expensive"],["on time","great night","remaining work","worth it"]],"Q39":[["Claire","growing tomatoes","balcony","small flat","green corner"],["first time","real fruit","thrilled","photo","tiny","grapes","proud","herself"],["Every morning","watering can","soil","leaves","bugs","morning sun","isn't big","few pots","bright red","salad"],["satisfying","taste","tiny seed","cold drinks","chat","joy"],["peaceful","daily hobby","rewards"]],"Q40":[["short clip","local pottery market","Guangzhou"],["social media","after work","scrolled past","boring","old-fashioned","colourful pieces","caught my eye"],["local makers","wet clay","by hand","wooden tables","colourful cups","clay figures","animal-shaped pieces","background music","warm"],["curious","plain","clay","finished cup","process","makers' hands","gently","twice","favourites"],["old bowls","young makers","visit","in person"]],"Q41":[["interview","Soyeon","leader","K-pop group","YouTube"],["concert","Hong Kong","two close friends","fans","curious","behind the scenes"],["2022 comeback","subtitles","pressure","member left","team","write","record","brand-new album"],["calm","steady","starting over","zero","tough","strong","moving forward","honest","pretending"],["stage shows","real story","respect","meaningful"]],"Q42":[["pottery studio","by hand","traditional Chinese pottery"],["old Chinese bowls","plain clay","colourful cups","clay figures","animal-shaped pieces","traditional patterns","modern colours","fresh"],["by hand","shapes","glaze","thin brush","hot oven","bottom","flat","small mistakes","heating","fix","seconds"],["old pottery","museums","never","copies","own","shapes","colours"],["skilled","careful","simple clay","special"]],"Q43":[["Claire","happiest","cheerful","school","simple","everyday things"],["tiny tomatoes","balcony","picture","happy","small thing","excitement"],["big smile","coffee","bike ride","never","plans change","bus","delayed","rain","complaining","warm-tea stop"],["huge events","happy","draws","tomato plants","stickers","cheer","rainy days"],["good mood","spreads","lighter"]],"Q44":[["younger sister","succeeded","solo trip","abroad","shy","huge step"],["fan meeting","South Korea","nervous","airport","hotel","venue","Nobody","alone"],["safe hotel","visa steps","route","hotel address","Korean","passport","booking papers","folder"],["map apps","by herself","selfie","hotel","problem","calmly","giving up"],["confident","prepared","brave"]],"Q45":[["day off","K-pop concert","Hong Kong","happy","result"],["working overtime","favourite","might not","stay together","hotel","decided"],["urgent work","team","day off","high-speed trains","sold out","early flight"],["three","packed","night before","three alarms","half asleep","airport","tiring","expensive"],["on time","enjoyed","caught up","never","again","glad"]],"Q46":[["changed","important opinion","last year","time off","work"],["work","come first","day off","concert","wrong","might not","stay together","hotel","decided"],["urgent work","team","day off","high-speed trains","sold out","early flight","three"],["tiring","on time","lights","cheering","music","singing along","glad"],["remaining work","one day off","wasn't wrong","willing","happy plans","outside work"]],"Q47":[["Dafu Mountain","Forest Park","peaceful lake","Guangzhou","recommend","relaxing trip"],["weekend morning","fresh","cool","green hills","tall trees","quiet paths","reflects","mirror"],["rent bikes","front gate","lake","birds","cool breeze","photos","view"],["shady benches","don't like","cycling","gentle walk","rest","chatting","catching up"],["early","morning","water","no need","rush","own pace"]],"Q48":[["important decision","last year","day off","K-pop concert","Hong Kong"],["working overtime","favourite","might not","stay together","hotel","decided"],["urgent work","team","day off","high-speed trains","sold out","early flight"],["three","packed","night before","three alarms","half asleep","airport","tiring","expensive"],["on time","glad","choice","not","say no","routine"]],"Q49":[["snow-skin mooncakes","special treat","Mid-Autumn Festival"],["baked mooncakes","soft","cool skin","sweet filling","red bean","fresh mango","mould","pattern","round shape","family reunion"],["mum","wrap","sweet filling","soft skin","close","mould","pattern","too hard","strange shape","gently"],["small pieces","hot tea","different flavours","soft","cool","not too sweet"],["special","one bite","warm evenings","family"]],"Q50":[["Claire","successful","online art platform","school","drawing","business"],["common problem","painting","couldn't","picture","own wall","independent artists","upload","room photo","preview"],["started","small","few artists","social media","customer messages","felt helped","happy","young painter","first piece"],["grew","team","art shows","overseas","user feedback","simpler"],["business","artists","buyers","real problem","improving"]],"Q51":[["childhood friend","Claire","school","ten years","draw","after class"],["art projects","classroom floor","snacks","coloured pencils","checklist","drawings","after school","shared","ideas"],["busy jobs","coffee","cycling","lake","pictures","green hills","quiet paths","photo album"],["don't see","awkward","catch up","laugh","old school photos","working on"],["close","creating","together","new moments"]],"Q52":[["K11","tall modern building","downtown Guangzhou","weekdays","new exhibition","shops","office floors"],["outside","modern tower","stands out","lower buildings","landmark","artworks","colourful lights","design displays","creative"],["don't","buy","iced coffee","window","chat","photos","metro","basement","easy","special trip"],["different artists","fresh exhibitions","art displays","changing","few months","go back","don't","shop"]],"Q53":[["picture storybook","Zootopia","good mood","movie","characters","on paper"],["Judy","rabbit","police officer","bigger animals","size","Nick","fox","judged unfairly","never","trusted"],["teaming up","tough case","don't trust","argue","work together","different skills","solve"],["unfair ideas","proves","background","bright pages","funny jokes","cheer me up"],["happiest","true friends","crack the case","sweet ending","smile"]],"Q54":[["Claire","healthy habits","daily routine","keep up","school","simple","lifestyle"],["warm water","stretching","ten minutes","sunny window","short workout","busy","doesn't","stress out","afternoon","skipping"],["phone away","reads","to-do list","relax","worrying","balanced meals","enough sleep"],["never","strict diets","gym","small habits","tiring workdays"],["flexible","realistic","simple","years"]],"Q55":[["helped","younger sister","solo trip","South Korea"],["fan meeting","South Korea","nervous","airport","hotel","venue","Nobody","alone"],["encouraged","safe hotel","visa steps","route","getting lost","hotel address","Korean","passport","booking papers","phone on"],["map apps","by herself","selfie","hotel","whole journey","confident"],["support","without","taking over","independent"]],"Q56":[["Poulin","Canadian team captain","ice hockey","admire","Canada","United States","Vancouver"],["first time","ice hockey","puck","fast","barely follow","basic rules","understood"],["falling behind","calm","cheering","teammates","pushing forward","attacks","lost","never","give up"],["attitude","looked her up","three","Olympic gold medals","Off the ice","local programmes","kids","sports"],["admire","athlete","win games","team","tough"]],"Q57":[["pottery studio","creative pieces","by hand","weekend workshop","craft market"],["traditional","pottery patterns","never","copies","tiny detail","colourful cups","clay figures","animal-shaped pieces","by hand","glaze","oven","fix","seconds"],["studio","small animal","clay","rabbit","too round","start over","round ears","bear"],["creative","mistakes","brand-new ideas","designer","admire"]],"Q58":[["smartwatch","hard to use","at first"],["Apple Store","year ago","exercise","sleep","basic buttons","set it up","confused"],["tiny icons","hidden settings","accidentally","watch face","sleeve","vibrating","turn them off","activity rings","sleep reports"],["first week","check the time","beginner guides","one feature"],["confident","frustrating","helpful","daily routine"]]};
  // Anchor the cues to their *source* paragraph positions, not the display index.
  // final-answers-v2.js may join adjacent source paragraphs into a single visible one.
  // This leaves original text, user's own bold offsets, and audio untouched.
  const priorRecommendedRanges = window.recommendedRanges;
  window.recommendedRanges = function(text, topic) {
    if (!text) return [];
    const source = topic?.recallSourceParagraphs;
    const displayed = (topic?.reviewed || []).map(p => p.text);
    const rows = semanticCueRows[topic?.q];
    if (!Array.isArray(source) || !Array.isArray(rows) || rows.length !== source.length) {
      return typeof priorRecommendedRanges === 'function' ? priorRecommendedRanges(text, topic) : [];
    }
    const paragraphIndex = displayed.findIndex(part => part === text);
    // Merging and sentence-boundary splitting must preserve the exact complete answer.
    if (paragraphIndex < 0 || source.join(' ') !== displayed.join(' ')) {
      return typeof priorRecommendedRanges === 'function' ? priorRecommendedRanges(text, topic) : [];
    }
    let displayStart = 0;
    for (let i = 0; i < paragraphIndex; i++) displayStart += displayed[i].length + 1;
    const displayEnd = displayStart + text.length;
    const ranges = [];
    let sourceStart = 0;
    for (let i = 0; i < source.length; i++) {
      const originalText = source[i], lower = originalText.toLowerCase();
      let cursor = 0;
      for (const cue of rows[i]) {
        if (!cue || cue.length > 40) continue;
        const needle = cue.toLowerCase();
        let at = lower.indexOf(needle, cursor);
        if (at < 0) at = lower.indexOf(needle);
        if (at < 0) continue;
        const before = at ? lower[at - 1] : '';
        const after = lower[at + cue.length] || '';
        if (/[a-z0-9]/.test(before) || /[a-z0-9]/.test(after)) continue;
        cursor = at + cue.length;
        const absoluteStart = sourceStart + at;
        const absoluteEnd = absoluteStart + cue.length;
        if (absoluteStart < displayStart || absoluteEnd > displayEnd) continue;
        const relativeStart = absoluteStart - displayStart;
        const relativeEnd = absoluteEnd - displayStart;
        if (!ranges.some(([a, b]) => relativeStart < b && relativeEnd > a)) {
          ranges.push([relativeStart, relativeEnd]);
        }
      }
      sourceStart += originalText.length + 1;
    }
    return typeof window.normalizeRanges === 'function'
      ? window.normalizeRanges(ranges, text.length)
      : ranges.sort((a, b) => a[0] - b[0]);
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
