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
+"prize awards achievements gold silver technology trip village road countryside airplane airport weather rain sun training skill skills tradition history"
).split(/\s+/));
const IELTS_RECALL_CUES={
 Q56:[
  "captain of Canada's women's ice hockey team","match in Vancouver","Canada against the United States",
  "women's ice hockey live","puck moved so fast","basic rules","giving directions to her teammates",
  "organise attacks","three Olympic gold medals","help children try sport",
  "calm and focused","talks about the team","stays calm under pressure","encourages her teammates"
 ],
 Q20:[
  "saved money to buy a smartwatch","track my exercise and sleep","saved some money from my salary",
  "online shopping","Apple Store","tried a few models","heart-rate and sleep functions",
  "cheaper options","read a few reviews","basic functions","still use it every day"
 ]
};
recommendedRanges=function(text,t){
  if(!text)return[];
  const lower=text.toLowerCase(), candidates=[];
  function add(phrase,score){
    phrase=String(phrase||'').trim();
    if(!phrase)return;
    const needle=phrase.toLowerCase();let at=0;
    while((at=lower.indexOf(needle,at))!==-1){
      const pre=lower[at-1]||'',post=lower[at+needle.length]||'';
      if(!/[a-z]/.test(pre)&&!/[a-z]/.test(post))
        candidates.push({a:at,b:at+needle.length,score});
      at+=needle.length;
    }
  }
  (IELTS_RECALL_CUES[t?.q]||[]).forEach(c=>add(c,22));
  for(const raw of (t?.keywords||[])){
    const phrase=String(raw||'').trim();
    const words=(phrase.toLowerCase().match(/[a-z]+(?:['’-][a-z]+)*/g)||[]);
    if(!words.length)continue;
    const hasNoun=words.some(w=>IELTS_RECALL_NOUNS.has(w));
    const isProper=/[A-Z][a-z]{2,}/.test(phrase)||/\d/.test(phrase);
    if(!(hasNoun||isProper))continue;
    if(words.length===1&&!hasNoun&&!isProper)continue;
    add(phrase,words.length>=2?13:9);
  }
  const ranges=[];
  for(const [s,e] of sentenceSpans(text)){
    const sentence=text.slice(s,e);
    const ws=[...sentence.matchAll(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)].map(m=>({
      w:m[0],l:m[0].toLowerCase(),a:s+m.index,b:s+m.index+m[0].length
    }));
    const budget=ws.length>23?3:ws.length>10?2:1;
    const preferred=candidates.filter(c=>c.a>=s&&c.b<=e).sort((a,b)=>b.score-a.score||(b.b-b.a)-(a.b-a.a));
    const picks=[];
    for(const p of preferred){
      if(picks.length>=budget)break;
      if(picks.some(q=>p.a<q.b&&q.a<p.b))continue;
      picks.push(p);
    }
    if(picks.length===0){
      const fallback=[];
      for(let i=0;i<ws.length;i++){
        if(!IELTS_RECALL_NOUNS.has(ws[i].l))continue;
        // Anchor an actual noun; add its immediate qualifiers but never a lone action verb.
        let start=i,end=i;
        if(i>0){
          const prev=ws[i-1].l;
          if(!RECALL_STOP.has(prev)&&!RECALL_WEAK.has(prev)&&!/^(asked|tried|felt|seem|outside|later|started|looked|helped|watched|learned|used|wanted|really)$/.test(prev))start=i-1;
          if(i>1&&start===i-1&&(/^(three|two|first|new|online|good|bad|early|large|small|high|short|young|canada|women's|forest)$/.test(ws[i-2].l)))start=i-2;
        }
        if(i+1<ws.length&&IELTS_RECALL_NOUNS.has(ws[i+1].l)&&sentence.slice(ws[i].b-s,ws[i+1].a-s)===" ")end=i+1;
        const a=ws[start].a,b=ws[end].b,span=text.slice(a,b);
        if(span.length<5||/\b(?:and|that|but|because|which)\b/i.test(span))continue;
        const score=(end-start+1)*3+Math.min(8,b-a)/2+(ws[i].w[0]===ws[i].w[0].toUpperCase()?3:0);
        fallback.push({a,b,score});
      }
      fallback.sort((a,b)=>b.score-a.score||a.a-b.a);
      for(const p of fallback){
        if(picks.length>=budget)break;
        if(picks.some(q=>p.a<q.b&&q.a<p.b))continue;
        picks.push(p);
      }
    }
    picks.forEach(x=>ranges.push(x));
  }
  const cueLimit=text.length>340?5:text.length>200?4:text.length>110?3:2;
  const strongest=ranges.sort((a,b)=>b.score-a.score||(b.b-b.a)-(a.b-a.a)).slice(0,cueLimit);
  return normalizeRanges(strongest.map(x=>[x.a,x.b]),text.length);
};
const recallPos={x:window.scrollX,y:window.scrollY};
render();
window.scrollTo(recallPos.x,recallPos.y);
