/* Recall cues: meaningful events and nouns only; faint reusable speaking patterns. */
function weakReuseMarkup(segment){
 const re=/\b(?:I'd like to talk about|The person I'd like to talk about|At first|After a while|In the end|For example|For me|So I think|I think)\b/gi;
 let result='',from=0,m;
 while((m=re.exec(segment))){
   result+=esc(segment.slice(from,m.index))+'<span class="reuse-pattern">'+esc(m[0])+'</span>';
   from=m.index+m[0].length;
 }
 return result+esc(segment.slice(from));
}
recommendedRanges=function(text,t){
 if(!text)return [];
 const emptyWords=new Set(("asked tried felt looked started showed helped watched pressed moved noticed walked came left went had got bought made took thought realised realized liked enjoyed wanted talked remembered planned learned learnt").split(' '));
 const semantic=w=>{
   const x=w.toLowerCase();
   return x.length>=4&&!RECALL_STOP.has(x)&&!RECALL_WEAK.has(x)&&!emptyWords.has(x);
 };
 const lower=text.toLowerCase(),matches=[];
 for(const raw of (t?.keywords||[])){
   const phrase=String(raw||'').trim();
   const words=phrase.match(/[A-Za-z][A-Za-z'-]*/g)||[];
   if(!words.some(semantic))continue;
   if(words.length===1&&/^(?:ing|ed)$/.test(words[0]))continue;
   const needle=phrase.toLowerCase();let cursor=0,index;
   while((index=lower.indexOf(needle,cursor))!==-1){
     const before=lower[index-1]||'',after=lower[index+needle.length]||'';
     if(!/[a-z]/.test(before)&&!/[a-z]/.test(after))
       matches.push({a:index,b:index+needle.length,score:10+Math.min(words.length*2,6)});
     cursor=index+needle.length;
   }
 }
 const result=[];
 for(const [s,e] of sentenceSpans(text)){
   const words=[...text.slice(s,e).matchAll(/[A-Za-z][A-Za-z'-]*/g)].map(m=>({
     w:m[0],a:s+m.index,b:s+m.index+m[0].length
   }));
   const budget=words.length>=24?3:words.length>=10?2:1;
   const chosen=[];
   const pool=matches.filter(x=>x.a>=s&&x.b<=e).sort((a,b)=>
     b.score-a.score||(b.b-b.a)-(a.b-a.a));
   for(const x of pool){
     if(chosen.length>=budget)break;
     if(chosen.some(y=>y.a<x.b&&x.a<y.b))continue;
     chosen.push(x);
   }
   if(!chosen.length){
     const snippets=[];
     for(let i=0;i<words.length;i++){
       const w=words[i];if(!semantic(w.w))continue;
       let end=w.b;
       if(words[i+1]&&text.slice(w.b,words[i+1].a)===' '&&semantic(words[i+1].w))
         end=words[i+1].b;
       if(end===w.b&&/(?:ing|ed)$/.test(w.w.toLowerCase()))continue;
       snippets.push({a:w.a,b:end,score:end-w.a>=12?5:2});
     }
     snippets.sort((a,b)=>b.score-a.score||a.a-b.a);
     if(snippets.length)chosen.push(snippets[0]);
   }
   chosen.forEach(x=>result.push([x.a,x.b]));
 }
 return normalizeRanges(result,text.length);
};
// The initial render occurs in app.js. Refresh once to apply the refined cue
// style while retaining the same question, custom bold ranges and scroll.
const recallY=window.scrollY,recallX=window.scrollX;
render();
window.scrollTo(recallX,recallY);
