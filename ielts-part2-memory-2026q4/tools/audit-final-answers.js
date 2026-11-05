/* Read exactly the scripts the live page loads, before app.js; report all final Cue Card answers for a one-time relevance audit. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const folder=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(folder,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script\\s+src="([^"]+)"\\s*>\\s*<\\/script>/g)].map(m=>m[1].split('?')[0]);
const ctx=vm.createContext({window:{},console});
for(const name of scripts){
  if(name==='app.js')break;
  if(name.startsWith('audio/'))continue;
  vm.runInContext(fs.readFileSync(path.join(folder,name),'utf8'),ctx,{filename:name,timeout:10000});
}
const groups=ctx.window.P2_2026Q4_GROUPS||[];
const flat=groups.flatMap(g=>g.topics.map(t=>({g,t}))).sort((a,b)=>a.t.q.localeCompare(b.t.q));
if(flat.length!==58)throw Error('Expected 58 questions, got '+flat.length);
for(const {g,t} of flat){
  const paragraphs=(t.reviewed||[]).map(p=>p.text).filter(Boolean);
  console.log('[IELTS-AUDIT]'+JSON.stringify({q:t.q,zh:t.zh,card:t.en,cue:t.cue,story:g.title,paragraphs,flex:t.flex?.text||'',zhText:ctx.window.P2_2026Q4_ZH_TRANSLATIONS?.[t.q]||''}));
}
