/* Recommended recall cues: facts/objects/outcomes, not isolated verbs.
   Faint underlines show templates that can be reused across Cue Cards. */
function weakReuseMarkup(segment){
  const patterns=/\b(?:The person I'd like to talk about|I'd like to talk about|I first noticed|One weekend morning|We could stop whenever we wanted to|I met at school more than ten years ago|more than ten years ago|I had originally planned|In the end|At first|After a while|For example|For me|I think|I was worried|I used to think|I realised|I would recommend|It was my first time|I felt|That is why|That's why|It reminded me|I really enjoyed|I still remember)\b/gi;
  let html='',last=0,m;
  while((m=patterns.exec(segment))){
    html+=esc(segment.slice(last,m.index))+'<span class="reuse-pattern">'+esc(m[0])+'</span>';
    last=m.index+m[0].length;
  }
  return html+esc(segment.slice(last));
}
const IELTS_RECALL_NOUNS=new Set((
"captain team teammates players puck hockey match matches game games olympic medal medals sport sports children programme programmes pressure interviews interview career vancouver canada states rules "
+"forest park lake lakes trees hills paths bikes bike bicycle bicycles trees shadows view views photos photograph photographer city guangzhou nature trip travel weekend morning afternoon "
+"concert tickets ticket train flight flights hotel venue singer songs song fans friends family coffee k pop group audience work overtime decision plan choice reply message "
+"smartwatch watch battery charger charge charging update exercise sleep salary prices price shopping store models model functions steps data walking time "
+"pottery clay glaze studio cups cup sculptures sculpture crafts craft artist artists painting paintings design designs art business platform customers customer home wall preview "
+"mooncakes mooncake dough mould shapes shape mother father sister class classmates school lessons homework project "
+"book books movie films film zootopia judy nick plot story characters "
+"supermarket supermarkets bottle bottles plastic recycling refund deposit scheme germany "
+"photographs photographs camera sunset deer mountain bridge exhibition exhibitions restaurant food plant plants tomatoes balcony "
+"prize awards achievements gold silver technology trip village road countryside airplane airport weather rain sun training skill skills tradition history water birds air market reporter makers"
).split(/\s+/));
const IELTS_RECALL_CUES={
 Q10:[
   "pottery market","social media","old-fashioned","shaping clay",
   "colourful cups","small sculptures","traditional crafts","sell their work",
   "modern and fun","speak in their own words","real community event",
   "understand why local people cared","worth watching"
 ],
 Q32:[
   "hard to follow","did not want to be rude","colourful modern pieces",
   "preferred looking at the final pieces","mattered to her","impatient",
   "stay polite","interested in her work","helped me understand the basic idea"
 ],
 Q56:[
   "captain of Canada's women's ice hockey team","match in Vancouver",
   "Canada against the United States","women's ice hockey live",
   "puck moved so fast","basic rules","giving directions to her teammates",
   "organise attacks","three Olympic gold medals","help children try sport",
   "young players","calm and focused","talks about the team",
   "good example of a team leader","stays calm under pressure",
   "encourages her teammates","positive when things get difficult"
 ],
 Q16:["green hills","tall trees","quiet paths","hear birds","cool air under the trees","water reflects the trees","relaxing than a busy shopping centre"],
 Q47:["green hills","tall trees","quiet paths","hear birds","cool air under the trees","water reflects the trees","relaxing than a busy shopping centre"],
 Q20:[
   "saved money to buy a smartwatch","track my exercise and sleep",
   "saved some money from my salary","online shopping","Apple Store",
   "tried a few models","heart-rate and sleep functions","cheaper options",
   "read a few reviews","basic functions","still use it every day"
 ]
};
const IELTS_RECALL_FEELINGS=new Set((
 "happy proud excited worried nervous relieved calm confident upset disappointed " +
 "frustrated anxious stressed embarrassed comfortable uncomfortable boring bored " +
 "interesting interested enjoyable enjoyable relaxing relaxed peaceful impressed " +
 "impressive important special useful helpful meaningful memorable lovely beautiful " +
 "creative modern fun difficult easy hard challenging surprising surprised successful " +
 "friendly patient tiring tired exhausting inspiring inspired scary scared afraid " +
 "pleasant satisfied grateful thankful stressful enjoyable positive negative " +
 "confusing confused valuable practical fascinating stressful awkward " +
 "old-fashioned traditional"
).split(/\s+/));
const IELTS_RECALL_MEANINGFUL_PHRASES=[
  /\b(?:didn't|did not|don't|do not|wasn't|was not|couldn't|cannot|can't|never)\s+(?:(?!(?:can|could|would|should|but|because|and|so|when|if|then|which|that)\b)[A-Za-z'-]+\s+){0,3}(?!(?:can|could|would|should|but|because|and|so|when|if|then|which|that)\b)[A-Za-z'-]+/gi,
  /\b(?:choose|decide|chose|finish|enjoy|talk|go|work|walk)\s+without\s+[A-Za-z'-]+/gi,
  /\b(?:easy|hard|difficult|happy|proud|relieved|excited|worried|comfortable)\s+to\s+[A-Za-z'-]+/gi,
  /\bthat was enough\b/gi
];
const IELTS_RECALL_ACTIONS=new Set((
 "helped encouraged decided suggested learned learnt understood discovered realised " +
 "realized improved solved solved chose chosen saved supported shared taught recommended " +
 "recommend changed prepared organised organized bought designed created explained " +
 "managed stopped visited admired appreciated remembered rented practised practiced " +
 "watched made felt became noticed collected sold enjoyed preferred preferred"
).split(/\s+/));
recommendedRanges=function(text,t){
  if(!text)return [];
  const lower=text.toLowerCase(), candidates=[];
  function add(phrase,score){
    phrase=String(phrase||'').trim();
    if(!phrase||phrase.length>65)return;
    const needle=phrase.toLowerCase();
    let cursor=0,at;
    while((at=lower.indexOf(needle,cursor))>=0){
      const before=lower[at-1]||'',after=lower[at+needle.length]||'';
      if(!/[a-z]/.test(before)&&!/[a-z]/.test(after))
        candidates.push({a:at,b:at+needle.length,score});
      cursor=at+needle.length;
    }
  }
  (IELTS_RECALL_CUES[t?.q]||[]).forEach(c=>add(c,29));
  for(const raw of (t?.keywords||[])){
    const phrase=String(raw||'').trim();
    const words=(phrase.toLowerCase().match(/[a-z]+(?:['’-][a-z]+)*/g)||[]);
    if(!words.length)continue;
    const isSpecific=words.some(w=>IELTS_RECALL_NOUNS.has(w)||IELTS_RECALL_FEELINGS.has(w)) ||
      /[A-Z][a-z]{2,}/.test(phrase)||/\d/.test(phrase);
    if(!isSpecific)continue;
    add(phrase,words.length>1?17:11);
  }
  const result=[];
  const wordRe=/[A-Za-z]+(?:['’-][A-Za-z]+)*/g;
  for(const [s,e] of sentenceSpans(text)){
    const sentence=text.slice(s,e);
    const ws=[...sentence.matchAll(wordRe)].map(m=>({
      w:m[0],l:m[0].toLowerCase(),a:s+m.index,b:s+m.index+m[0].length
    }));
    if(!ws.length)continue;
    const pool=candidates.filter(c=>c.a>=s&&c.b<=e).map(c=>({...c}));
    for(const rule of IELTS_RECALL_MEANINGFUL_PHRASES){
      // An attitude or outcome remains one compact phrase.
      for(const match of sentence.matchAll(rule)){
        let phrase=match[0].trim(),words=phrase.split(/\s+/);
        if(words.length>6)phrase=words.slice(0,6).join(' ');
        if(phrase.length>52)continue;
        const start=s+match.index;
        pool.push({a:start,b:start+phrase.length,score:24});
      }
    }
    // Sentiment and personal judgement can be as useful as a factual noun.
    // Prefer the evaluative phrase, not a standalone "seem", "felt" or "liked".
    for(let i=0;i<ws.length;i++){
      const w=ws[i],next=ws[i+1],next2=ws[i+2];
      const feeling=IELTS_RECALL_FEELINGS.has(w.l);
      if(feeling){
        let from=w.a,to=w.b;
        if(next&&next.l==='and'&&next2&&IELTS_RECALL_FEELINGS.has(next2.l))to=next2.b;
        else if(next&&IELTS_RECALL_NOUNS.has(next.l)&&text.slice(w.b,next.a)===' ')to=next.b;
        else if(next&&next.l==='to'&&ws[i+2]&&ws[i+3])to=ws[Math.min(i+3,ws.length-1)].b;
        // Keep a meaningful noun phrase attached, e.g. "calm under pressure".
        else if(next&&/^(under|about|with|in)$/.test(next.l)&&next2)to=next2.b;
        if(from>=s&&to<=e)pool.push({a:from,b:to,score:20+(to-from>12?2:0)});
      }
      // Useful attitude phrases that the prior noun-only pass missed.
      if(/^(liked|loved|enjoyed|admired|preferred|appreciated|hated|disliked)$/.test(w.l)
         && ws[i+1]?.l!=='that'){
        const follow=ws.slice(i+1,Math.min(ws.length,i+5));
        const last=follow.slice().reverse().find(x=>IELTS_RECALL_FEELINGS.has(x.l)||IELTS_RECALL_NOUNS.has(x.l));
        if(last&&last.b-w.a<=47)pool.push({a:w.a,b:last.b,score:14});
      }
      // Capture a concrete action + its object when there is no obvious noun phrase.
      if(IELTS_RECALL_ACTIONS.has(w.l)){
        const follow=ws.slice(i+1,Math.min(ws.length,i+6));
        const ending=follow.slice().reverse().find(x=>IELTS_RECALL_NOUNS.has(x.l)||IELTS_RECALL_FEELINGS.has(x.l));
        if(ending&&ending.b-w.a<=45)pool.push({a:w.a,b:ending.b,score:12});
      }
    }
    // Nouns, locations and concrete objects. Use short phrases (not single verbs).
    for(let i=0;i<ws.length;i++){
      const w=ws[i];
      if(!IELTS_RECALL_NOUNS.has(w.l))continue;
      let start=i,end=i;
      if(i>0){
        const prev=ws[i-1];
        if((IELTS_RECALL_FEELINGS.has(prev.l)||IELTS_RECALL_NOUNS.has(prev.l)||
             /^(three|two|first|local|online|young|traditional|modern|green|tall|quiet|cool|blue|bright|short|long|big|small|large|new|good|bad|high|old)$/i.test(prev.l))
            && text.slice(prev.b,w.a)===' ')start=i-1;
      }
      if(i+1<ws.length&&IELTS_RECALL_NOUNS.has(ws[i+1].l)&&text.slice(w.b,ws[i+1].a)===' ')end=i+1;
      const a=ws[start].a,b=ws[end].b;
      pool.push({a,b,score:7+(end-start)*3+(b-a>=12?2:0)});
    }
    // Fall back to a meaningful adjective or short content phrase, never a generic verb.
    if(!pool.length){
      for(let i=0;i<ws.length;i++){
        const w=ws[i];
        if(RECALL_STOP.has(w.l)||RECALL_WEAK.has(w.l)||w.l.length<5)continue;
        if(/^(asked|tried|felt|seems|showed|looked|started|learned|would|could|wanted|liked|said|didn't|don't|can't|wasn't|without|enough)$/.test(w.l))continue;
        pool.push({a:w.a,b:w.b,score:3});
      }
    }
    const long=ws.length>=23;
    const twoIdeas=ws.length>=18&&/\b(?:and|but|because|so|instead of)\b|[,;]/i.test(sentence);
    const limit=long||twoIdeas?2:1;
    const picked=[];
    const sorted=pool.sort((a,b)=>b.score-a.score||(b.b-b.a)-(a.b-a.a)||a.a-b.a);
    for(const item of sorted){
      if(picked.length>=limit)break;
      if(picked.some(x=>item.a<x.b+4&&x.a<item.b+4))continue;
      if(picked.length){
        // Two hints should point to different parts of a sentence.
        const prev=picked[0],distance=Math.abs((item.a+item.b-prev.a-prev.b)/2);
        if(distance<Math.min(16,(e-s)*0.27))continue;
      }
      picked.push(item);
    }
    // Never sacrifice the final sentences merely to limit total paragraph marks.
    picked.forEach(c=>result.push([c.a,c.b]));
  }
  return normalizeRanges(result,text.length);
};
const recallPos={x:window.scrollX,y:window.scrollY};
render();
window.scrollTo(recallPos.x,recallPos.y);
