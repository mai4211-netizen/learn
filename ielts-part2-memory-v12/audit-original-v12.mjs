import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const context={window:{},document:{querySelectorAll(){return[]},querySelector(){return null}}};
vm.createContext(context);
for(const file of ['data1.js','data2.js','data3.js','data4.js','data5.js','patch-v5.js','patch-v6.js','patch-v7.js','patch-v10.js','patch-v11.js','patch-v12.js','groups-v12.js']){
  vm.runInContext(fs.readFileSync(path.join(here,file),'utf8'),context,{filename:file});
}

const clean=html=>String(html||'')
  .replace(/<mark\b[^>]*>/gi,'').replace(/<\/mark>/gi,'')
  .replace(/<[^>]+>/g,' ')
  .replace(/&#x27;|&#39;/gi,"'").replace(/&quot;/gi,'"').replace(/&amp;/gi,'&')
  .replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&nbsp;/gi,' ')
  .replace(/\s+/g,' ').trim();
const tokens=text=>(text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g)||[]);
function lcsLength(a,b){
  const previous=new Uint16Array(b.length+1);
  const current=new Uint16Array(b.length+1);
  for(let i=1;i<=a.length;i++){
    for(let j=1;j<=b.length;j++)current[j]=a[i-1]===b[j-1]?previous[j-1]+1:Math.max(previous[j],current[j-1]);
    previous.set(current);current.fill(0);
  }
  return previous[b.length];
}
function originalQuestions(){
  const html=fs.readFileSync(path.join(here,'..','ielts-speaking-review','index.html'),'utf8');
  const starts=[];
  for(let n=1;n<=59;n++){
    const marker=`<article class="card" id="q${n}"`;
    const index=html.indexOf(marker);
    if(index<0)throw new Error(`Missing original Q${n}`);
    starts.push(index);
  }
  const out=[];
  for(let n=1;n<=59;n++){
    const chunk=html.slice(starts[n-1],n<59?starts[n]:html.length);
    const answerMatch=chunk.match(new RegExp(`<div class="answer" id="answer-${n}">([\\s\\S]*?)<\\/div>`));
    const titleMatch=chunk.match(/<h3>([\s\S]*?)<\/h3>/);
    const promptMatch=chunk.match(/<(?:div|p) class="question">([\s\S]*?)<\/(?:div|p)>/);
    const storyMatch=chunk.match(new RegExp(`<span id="story-cn-${n}">([\\s\\S]*?)<\\/span>`));
    if(!answerMatch||!promptMatch)throw new Error(`Could not parse original Q${n}`);
    const paragraphs=[...answerMatch[1].matchAll(/<p>([\s\S]*?)<\/p>/g)].map(match=>clean(match[1]));
    out.push({n,q:`Q${String(n).padStart(2,'0')}`,title:clean(titleMatch?.[1]),prompt:clean(promptMatch[1]),story:clean(storyMatch?.[1]),text:paragraphs.join(' '),paragraphs});
  }
  return out;
}
function currentQuestions(){
  const out=[];
  for(const template of context.window.P2_DATA_PARTS||[]){
    for(const topic of template.topics){
      const omitted=new Set(topic.omitSharedIndexes||[]);const parts=[];
      if(topic.intro)parts.push(topic.intro);
      template.shared.forEach((text,index)=>{if(omitted.has(index))return;parts.push(text);if(index===0&&topic.middle)parts.push(topic.middle)});
      if(topic.ending)parts.push(topic.ending);
      out.push({n:Number(topic.q.slice(1)),q:topic.q,title:topic.zh,prompt:topic.en,text:parts.join(' '),template:template.id,templateTitle:template.title});
    }
  }
  return out.sort((a,b)=>a.n-b.n);
}

const original=originalQuestions();
const current=currentQuestions();
const rows=current.map((now,index)=>{
  const old=original[index];const oldTokens=tokens(old.text);const currentTokens=tokens(now.text);const lcs=lcsLength(oldTokens,currentTokens);
  const group=(context.window.P2_SIMILARITY_GROUPS||[]).find(item=>item.topics.includes(now.n));
  return {...now,group:group?.id,groupTitle:group?.title,originalTitle:old.title,originalPrompt:old.prompt,originalStory:old.story,originalText:old.text,oldWords:oldTokens.length,currentWords:currentTokens.length,lcsRetention:Number((lcs/oldTokens.length).toFixed(3)),sequenceSimilarity:Number((2*lcs/(oldTokens.length+currentTokens.length)).toFixed(3))};
});

const fromArg=process.argv.find(arg=>arg.startsWith('--from='));
const toArg=process.argv.find(arg=>arg.startsWith('--to='));
const from=fromArg?Number(fromArg.split('=')[1]):1;
const to=toArg?Number(toArg.split('=')[1]):59;
if(process.argv.includes('--summary')){
  console.log(JSON.stringify({
    lowestSequenceSimilarity:rows.slice().sort((a,b)=>a.sequenceSimilarity-b.sequenceSimilarity).slice(0,20).map(({q,originalTitle,template,oldWords,currentWords,lcsRetention,sequenceSimilarity})=>({q,originalTitle,template,oldWords,currentWords,lcsRetention,sequenceSimilarity})),
    lowestOriginalRetention:rows.slice().sort((a,b)=>a.lcsRetention-b.lcsRetention).slice(0,20).map(({q,originalTitle,template,oldWords,currentWords,lcsRetention,sequenceSimilarity})=>({q,originalTitle,template,oldWords,currentWords,lcsRetention,sequenceSimilarity}))
  },null,2));
}else{
  for(const row of rows.filter(row=>row.n>=from&&row.n<=to)){
    console.log(`\n## ${row.q} ${row.originalTitle}`);
    console.log(`Prompt: ${row.originalPrompt}`);
    console.log(`Group: ${row.groupTitle} | Core: ${row.templateTitle}`);
    console.log(`Words: old ${row.oldWords} -> current ${row.currentWords} | retention ${row.lcsRetention} | similarity ${row.sequenceSimilarity}`);
    console.log(`Original story: ${row.originalStory}`);
    console.log(`OLD: ${row.originalText}`);
    console.log(`NOW: ${row.text}`);
  }
}
