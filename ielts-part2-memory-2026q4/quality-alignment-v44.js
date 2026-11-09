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
   "easy hard useful special positive personal realistic skilled important").split(/\s+/));
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
  window.recommendedRanges=function(text,topic){
    if(!text)return[];
    const spans=typeof window.sentenceSpans==="function"?window.sentenceSpans(text):[[0,text.length]];
    const hints=[...(typeof IELTS_RECALL_CUES!=="undefined"?IELTS_RECALL_CUES[topic?.q]||[]:[]),...(topic?.keywords||[])];
    const output=[];
    for(const [start,end] of spans){
      const line=text.slice(start,end),ws=tokens(line),pool=[],lower=line.toLowerCase();
      const add=(a,b,score)=>{
        if(a<0||a>=b||b>line.length)return;
        const phrase=line.slice(a,b),pieces=tokens(phrase);
        if(!pieces.length||pieces.length>4||phrase.length>38||weak.has(pieces[0].w))return;
        if(pieces.every(x=>weak.has(x.w)))return;
        if(pieces.length>1&&pieces.length<4)score+=3;
        if(pieces.length===4)score-=3;
        if(pieces.some(x=>weak.has(x.w)))score-=2;
        pool.push({a:start+a,b:start+b,score});
      };
      // Prefer concise, topic-specific cues when present in the exact final sentence.
      for(const raw of hints){
        const word=String(raw||"").trim(),parts=tokens(word);
        if(!parts.length||parts.length>4||word.length>38||weak.has(parts[0].w))continue;
        let from=0,at;
        while((at=lower.indexOf(word.toLowerCase(),from))>=0){
          if(!/[a-z0-9]/.test(lower[at-1]||"")&&!/[a-z0-9]/.test(lower[at+word.length]||""))
            add(at,at+word.length,parts.length>1?26:17);
          from=at+word.length;
        }
      }
      for(let i=0;i<ws.length;i++){
        const w=ws[i],prev=ws[i-1],next=ws[i+1],n2=ws[i+2],n3=ws[i+3];
        if(nouns.has(w.w)){
          add(w.a,w.b,weak.has(w.w)?7:15);
          if(prev&&(modifiers.has(prev.w)||nouns.has(prev.w)||/^\d+$/.test(prev.w))&&line.slice(prev.b,w.a)===" ")add(prev.a,w.b,22);
          if(next&&nouns.has(next.w)&&line.slice(w.b,next.a)===" ")add(w.a,next.b,25);
        }
        if(feelings.has(w.w)){
          add(w.a,w.b,21);
          if(next&&nouns.has(next.w)&&line.slice(w.b,next.a)===" ")add(w.a,next.b,26);
          if(next&&/^(?:about|with|under)$/.test(next.w)&&n2&&n2.b-w.a<=38)add(w.a,n2.b,24);
        }
        if(actions.has(w.w)){
          if(next&&nouns.has(next.w))add(w.a,next.b,21);
          if(next&&/^(?:a|an|the|my|our|some)$/.test(next.w)&&n2&&nouns.has(n2.w))add(w.a,n2.b,21);
          add(w.a,w.b,10);
        }
        if(/^(?:\d+|one|two|three|four|five|nearly|almost)$/.test(w.w)&&next&&/^(?:hours?|days?|years?|minutes?|friends?|tickets?|floors?|times?)$/.test(next.w))add(w.a,next.b,23);
        if(/\d/.test(w.s))add(w.a,w.b,18);
        if(i>0&&/^[A-Z][a-z]+$/.test(w.s)&&!weak.has(w.w)){
          add(w.a,w.b,16);
          if(next&&/^[A-Z][a-z]+$/.test(next.s))add(w.a,next.b,28);
          if(next&&n2&&/^[A-Z][a-z]+$/.test(next.s)&&/^[A-Z][a-z]+$/.test(n2.s))add(w.a,n2.b,30);
          if(next&&n2&&n3&&/^[A-Z][a-z]+$/.test(next.s)&&/^[A-Z][a-z]+$/.test(n2.s)&&/^[A-Z][a-z]+$/.test(n3.s))add(w.a,n3.b,32);
        }
      }
      for(const rule of [/\bgo back\b/gi,/\bcome back\b/gi,/\bgive up\b/gi,/\blook forward\b/gi,/\bchanged my mind\b/gi]){
        for(const m of line.matchAll(rule))add(m.index,m.index+m[0].length,27);
      }
      // A weak sentence may have no mark. Never label "This", "Overall" or fillers.
      pool.sort((a,b)=>b.score-a.score||a.a-b.a||(a.b-a.a)-(b.b-b.a));
      if(pool[0]&&pool[0].score>7)output.push([pool[0].a,pool[0].b]);
    }
    return typeof window.normalizeRanges==="function"?window.normalizeRanges(output,text.length):output;
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
