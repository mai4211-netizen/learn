const GROUPS=window.P2_2026Q4_GROUPS||[];
const storage={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const BOLD_KEY='p2-2026q4-bold-ranges';
let selectedGroup=storage.get('p2-2026q4-group')||GROUPS[0]?.id;
let selectedQ=storage.get('p2-2026q4-q')||GROUPS[0]?.topics?.[0]?.q;
let boldOnly=false,boldSource=storage.get('p2-2026q4-bold-source')||'mine',selectionInfo=null,boldState={},selectionTimer=null;
try{boldState=JSON.parse(storage.get(BOLD_KEY)||'{}')||{}}catch(e){boldState={}}

function group(){return GROUPS.find(g=>g.id===selectedGroup)||GROUPS[0]}
function topic(){const g=group();return g.topics.find(t=>t.q===selectedQ)||g.topics[0]}
function save(){storage.set('p2-2026q4-group',selectedGroup);storage.set('p2-2026q4-q',selectedQ);storage.set('p2-2026q4-bold-source',boldSource)}
function parts(g,t){
  if(Array.isArray(t.reviewed)&&t.reviewed.length){
    return t.reviewed.filter(p=>p?.text).map((p,i)=>({
      text:p.text,
      type:p.type||'own',
      adjusted:!!p.adjusted,
      source:'reviewed-'+i
    }));
  }
  const omit=new Set(t.omit||[]);
  const out=[{text:t.intro,type:'own',source:'intro'}];
  g.shared.forEach((baseText,i)=>{
    if(omit.has(i))return;
    const changed=t.overrides&&Object.prototype.hasOwnProperty.call(t.overrides,i);
    out.push({text:changed?t.overrides[i]:baseText,type:'shared',adjusted:changed,source:'shared-'+i});
    if(i===0&&t.middle)out.push({text:t.middle,type:'own',source:'middle'});
  });
  (t.extra||[]).forEach((text,i)=>out.push({text,type:'own',source:'extra-'+i}));
  if(t.ending)out.push({text:t.ending,type:'own',source:'ending'});
  return out.filter(p=>p.text);
}
function fullText(g,t){return parts(g,t).map(x=>x.text).join(' ')}
function wordCount(g,t){return (fullText(g,t).match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)||[]).length}
function uniqueStories(){return new Set(GROUPS.map(g=>g.story.split('·')[0].trim())).size}

function normalizeRanges(ranges,len){
  const clean=(ranges||[]).map(([a,b])=>[Math.max(0,Math.min(a,len)),Math.max(0,Math.min(b,len))]).filter(([a,b])=>b>a).sort((a,b)=>a[0]-b[0]);
  const merged=[];for(const r of clean){const last=merged[merged.length-1];if(last&&r[0]<=last[1])last[1]=Math.max(last[1],r[1]);else merged.push([...r])}return merged;
}
function mineRanges(key,len){return normalizeRanges(boldState[key]||[],len)}
const RECALL_STOP=new Set(("a an the and or but so because if when while where who which that this these those i you he she it we they me him her us them my your his our their is am are was were be been being do does did have has had can could will would should may might must to of in on at for from with by as than then very really just also still only much more most some any one two there here about into over after before during each every own same other another something anything someone people person place thing time way part kind good bad nice big small new old first last later now today yesterday tomorrow get got getting make made making go went gone going come came coming see saw seen seeing know knew known think thought thinking feel felt feeling like liked liking want wanted wanting need needed needing use used using look looked looking say said saying tell told telling talk talked talking work worked working").split(/\s+/));
const RECALL_WEAK=new Set(("friend friends group place thing person people story movie film activity experience idea problem reason result way part time day week year area city home work").split(/\s+/));
function sentenceSpans(text){
  const out=[];let start=0;
  const re=/[^.!?]+[.!?]?/g;let m;
  while((m=re.exec(text))){
    const raw=m[0],lead=raw.search(/\S/);if(lead<0)continue;
    const s=m.index+lead,e=m.index+raw.length;
    out.push([s,e]);
  }
  return out;
}
function overlapsRange(a,b,ranges){return ranges.some(([x,y])=>Math.max(a,x)<Math.min(b,y))}
function fallbackRecallRanges(text,baseRanges){
  const ranges=[...baseRanges],sentences=sentenceSpans(text);
  for(const [s,e] of sentences){
    const sent=text.slice(s,e),words=[...sent.matchAll(/[A-Za-z][A-Za-z'-]*/g)].map(m=>({w:m[0],a:s+m.index,b:s+m.index+m[0].length}));
    const wordCount=words.length;
    const desired=wordCount>=22?4:wordCount>=11?3:wordCount>=6?2:1;
    let current=ranges.filter(([a,b])=>a<e&&b>s).length;
    if(current>=desired)continue;
    const candidates=[];
    for(let i=0;i<words.length;i++){
      const x=words[i],low=x.w.toLowerCase();
      if(low.length<4||RECALL_STOP.has(low)||RECALL_WEAK.has(low))continue;
      let a=x.a,b=x.b,label=x.w,score=low.length>=7?3:2;
      const n=words[i+1],gap=n?text.slice(x.b,n.a):'';
      if(n){
        const nl=n.w.toLowerCase();
        if(gap===' '&&!RECALL_STOP.has(nl)&&!RECALL_WEAK.has(nl)&&nl.length>=4&&b-a+n.w.length+1<=28){
          b=n.b;label=text.slice(a,b);score+=2;
        }
      }
      if(/^[A-Z]/.test(x.w))score+=2;
      if(/ing$|ed$|ly$/.test(low))score+=1;
      candidates.push({a,b,label,score,pos:(a-s)/Math.max(1,e-s)});
    }
    candidates.sort((p,q)=>q.score-p.score||Math.abs(p.pos-.5)-Math.abs(q.pos-.5));
    while(current<desired&&candidates.length){
      let pickIndex=-1,best=-1;
      for(let i=0;i<candidates.length;i++){
        const c=candidates[i];if(overlapsRange(c.a,c.b,ranges))continue;
        const local=ranges.filter(([a,b])=>a<e&&b>s);
        const minDist=local.length?Math.min(...local.map(([a,b])=>Math.abs((a+b)/2-(c.a+c.b)/2))):999;
        const spreadBonus=Math.min(4,minDist/18);
        const total=c.score+spreadBonus;
        if(total>best){best=total;pickIndex=i}
      }
      if(pickIndex<0)break;
      const c=candidates.splice(pickIndex,1)[0];ranges.push([c.a,c.b]);current++;
    }
  }
  return normalizeRanges(ranges,text.length);
}
function recommendedRanges(text,t){
  if(!text)return[];
  const lower=text.toLowerCase(),ranges=[];
  for(const raw of (t?.keywords||[])){
    const needle=String(raw||'').trim().toLowerCase();
    if(!needle)continue;
    let from=0;
    while(from<lower.length){
      const at=lower.indexOf(needle,from);
      if(at<0)break;
      const before=at===0?'':lower[at-1],after=at+needle.length>=lower.length?'':lower[at+needle.length];
      if(!/[a-z]/.test(before)&&!/[a-z]/.test(after))ranges.push([at,at+needle.length]);
      from=at+needle.length;
    }
  }
  return fallbackRecallRanges(text,normalizeRanges(ranges,text.length));
}
function sourceRanges(text,key,t){return boldSource==='recommended'?recommendedRanges(text,t):mineRanges(key,text.length)}
function marked(text,key,t){
  const ranges=sourceRanges(text,key,t);let html='',cursor=0,klass=boldSource==='recommended'?'rec-mark':'mine-mark';
  for(const [a,b] of ranges){html+=esc(text.slice(cursor,a));html+='<strong class="'+klass+'">'+esc(text.slice(a,b))+'</strong>';cursor=b}
  return html+esc(text.slice(cursor));
}
function boldOnlyHtml(text,key,t){
  const ranges=sourceRanges(text,key,t),klass=boldSource==='recommended'?'rec-mark':'mine-mark';
  return ranges.map(([a,b])=>'<strong class="'+klass+'">'+esc(text.slice(a,b))+'</strong>').join('<span class="excerpt-gap">…</span>');
}
function persist(){storage.set(BOLD_KEY,JSON.stringify(boldState))}
function closestP(node){const el=node?.nodeType===1?node:node?.parentElement;return el?.closest?.('.answer-paragraph')||null}
function captureSelection(){
  if(boldSource!=='mine'||boldOnly)return null;
  const s=window.getSelection();if(!s||s.rangeCount!==1||s.isCollapsed)return null;
  const range=s.getRangeAt(0),a=closestP(range.startContainer),b=closestP(range.endContainer),answer=$('#answer');
  if(!a||!b||!answer.contains(a)||!answer.contains(b)||!range.toString().trim())return null;
  const ps=[...answer.querySelectorAll('.answer-paragraph')],ai=ps.indexOf(a),bi=ps.indexOf(b);if(ai<0||bi<ai)return null;
  const offset=(p,n,o)=>{const r=document.createRange();r.selectNodeContents(p);r.setEnd(n,o);return r.toString().length};
  const items=[];
  for(let i=ai;i<=bi;i++){const p=ps[i],len=p.textContent.replace(/^微调\s*/,'').length,start=i===ai?offset(p,range.startContainer,range.startOffset):0,end=i===bi?offset(p,range.endContainer,range.endOffset):len;if(end>start)items.push({key:p.dataset.key,start,end,len})}
  return items.length?{items,rect:range.getBoundingClientRect()}:null;
}
function fullyBold(info){return info.items.every(it=>mineRanges(it.key,it.len).some(([a,b])=>a<=it.start&&b>=it.end))}
function hideTools(){selectionInfo=null;$('#selectionTools').hidden=true}
function showTools(){
  const info=captureSelection();if(!info){hideTools();return}selectionInfo=info;
  const tools=$('#selectionTools');$('#boldToggle').textContent=fullyBold(info)?'取消加粗':'加粗';tools.hidden=false;
  if(window.innerWidth<=850)return;
  const w=tools.offsetWidth;tools.style.left=Math.max(8,Math.min(info.rect.left+(info.rect.width-w)/2,window.innerWidth-w-8))+'px';tools.style.top=Math.min(info.rect.bottom+8,window.innerHeight-tools.offsetHeight-8)+'px';
}
function scheduleTools(delay=0){clearTimeout(selectionTimer);selectionTimer=setTimeout(showTools,delay)}
function toggleBold(info){
  if(!info)return;const remove=fullyBold(info);
  for(const it of info.items){const current=mineRanges(it.key,it.len);
    if(remove){const next=[];for(const [a,b] of current){if(b<=it.start||a>=it.end)next.push([a,b]);else{if(a<it.start)next.push([a,it.start]);if(b>it.end)next.push([it.end,b])}}boldState[it.key]=normalizeRanges(next,it.len)}
    else boldState[it.key]=normalizeRanges([...current,[it.start,it.end]],it.len);
    if(!boldState[it.key]?.length)delete boldState[it.key];
  }
  persist();window.getSelection()?.removeAllRanges();render();
}

function buildNav(filter=''){
  const nav=$('#nav');nav.innerHTML='';let last='',shown=0;
  GROUPS.forEach((g,idx)=>{
    const hay=[g.title,g.story,g.category,g.memory,...g.topics.flatMap(t=>[t.q,t.zh,t.en,t.chain||'',...(t.cue||[])])].join(' ').toLowerCase();
    if(filter&&!hay.includes(filter.toLowerCase()))return;
    if(g.category!==last){const label=document.createElement('div');label.className='nav-group';label.textContent=g.category;nav.appendChild(label);last=g.category}
    const b=document.createElement('button');b.className='nav-btn'+(g.id===selectedGroup?' on':'');
    b.innerHTML='<span class="nav-num">'+String(idx+1).padStart(2,'0')+'</span><span class="nav-title">'+esc(g.title)+'</span><span class="nav-count">'+g.topics.length+'题</span>';
    b.onclick=()=>{selectedGroup=g.id;selectedQ=g.topics[0].q;save();render()};nav.appendChild(b);shown++;
  });
  $('#empty').style.display=shown?'none':'block';$('#card').style.display=shown?'block':'none';
}

function render(){
  hideTools();const g=group();if(!g)return;const t=topic();selectedQ=t.q;
  buildNav($('#search').value.trim());
  $('#index').textContent='语料组 '+String(GROUPS.indexOf(g)+1).padStart(2,'0')+' / '+GROUPS.length;
  $('#category').textContent=g.topics.length+' 题';
  $('#title').textContent=g.title;$('#story').textContent='故事母版：'+g.story;
  $('#memory').innerHTML='<span class="memory-title">母版中文链</span>'+esc(g.memory).replaceAll('→',' → ');
  const topics=$('#topics');topics.innerHTML='';
  g.topics.forEach(x=>{const b=document.createElement('button');b.className='topic'+(x.q===t.q?' on':'');b.innerHTML='<b>'+x.q+'</b>'+esc(x.zh);b.onclick=()=>{selectedQ=x.q;save();render()};topics.appendChild(b)});
  const cueHtml=(t.cue||[]).length?'<div class="cue-title">You should say:</div><ul class="cue-list">'+t.cue.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'';
  $('#prompt').innerHTML='<b>'+t.q+' · '+esc(t.zh)+'</b>'+esc(t.en)+cueHtml;
  $('#chain').textContent=t.chain||g.memory;
  $('#answerTitle').textContent=(boldOnly?'加粗内容 · 原答案 ':'完整答案 · ')+wordCount(g,t)+' words';

  $('#mineBoldSource').classList.toggle('on',boldSource==='mine');
  $('#recommendedBoldSource').classList.toggle('on',boldSource==='recommended');
  const btn=$('#boldOnlyToggle');btn.textContent=boldOnly?'显示完整答案':'只看加粗';btn.classList.toggle('on',boldOnly);

  const answer=$('#answer');
  const ps=parts(g,t).map((p,i)=>{
    const key=t.q+':'+p.source;
    if(boldOnly){
      const html=boldOnlyHtml(p.text,key,t);
      return html?'<p class="bold-only-paragraph">'+html+'</p>':'';
    }
    const klass='answer-paragraph '+p.type+(p.adjusted?' adjusted':'');
    return '<p class="'+klass+'" data-key="'+key+'">'+marked(p.text,key,t)+'</p>';
  }).filter(Boolean);
  const emptyText=boldSource==='recommended'?'当前答案没有可生成的推荐加粗。':'当前答案还没有我的加粗内容。请先显示完整答案并选中文字加粗。';
  answer.innerHTML=ps.length?ps.join(''):'<div class="bold-empty">'+emptyText+'</div>';
  document.title=t.q+' '+t.zh+'｜IELTS Part 2 2026 Sep–Dec';
}

function setBoldSource(source){
  boldSource=source;boldOnly=false;save();window.getSelection()?.removeAllRanges();render();
}
function exportBold(){
  const backup={app:'ielts-part2-memory-2026q4',version:1,exportedAt:new Date().toISOString(),boldRanges:boldState};
  const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='ielts-part2-2026q4-bold-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  $('#backupStatus').textContent='已导出加粗记录';
}
async function importBold(file){
  if(!file)return;const backup=JSON.parse(await file.text());if(backup?.app!=='ielts-part2-memory-2026q4'||!backup.boldRanges)throw new Error('不是这个页面导出的备份');
  boldState=backup.boldRanges;persist();boldSource='mine';boldOnly=false;save();render();$('#backupStatus').textContent='已导入加粗记录';
}
function validate(){
  const topics=GROUPS.flatMap(g=>g.topics);if(topics.length!==52)throw new Error('题目数不是 52');
  const ids=topics.map(t=>t.q);if(new Set(ids).size!==52)throw new Error('题号重复');
  for(let i=1;i<=52;i++){const q='Q'+String(i).padStart(2,'0');if(!ids.includes(q))throw new Error('缺少 '+q)}
  const incomplete=topics.filter(t=>!t.chain||!Array.isArray(t.cue)||t.cue.length<3);if(incomplete.length)throw new Error('题目展开不完整：'+incomplete.map(t=>t.q).join(','));
}
try{
  validate();$('#statTopics').textContent='52';$('#statStories').textContent=String(uniqueStories());$('#statGroups').textContent=String(GROUPS.length);
  if(!GROUPS.some(g=>g.id===selectedGroup)){selectedGroup=GROUPS[0].id;selectedQ=GROUPS[0].topics[0].q}
  $('#search').addEventListener('input',e=>buildNav(e.target.value.trim()));
  $('#mineBoldSource').addEventListener('click',()=>setBoldSource('mine'));
  $('#recommendedBoldSource').addEventListener('click',()=>setBoldSource('recommended'));
  $('#boldOnlyToggle').addEventListener('click',()=>{boldOnly=!boldOnly;render()});
  $('#exportBold').addEventListener('click',exportBold);
  $('#importBold').addEventListener('click',()=>$('#importBoldFile').click());
  $('#importBoldFile').addEventListener('change',async e=>{const f=e.target.files?.[0];e.target.value='';try{await importBold(f)}catch(err){$('#backupStatus').textContent=err.message;$('#backupStatus').classList.add('error')}});
  $('#answer').addEventListener('mouseup',()=>scheduleTools(0));$('#answer').addEventListener('touchend',()=>scheduleTools(300),{passive:true});
  document.addEventListener('selectionchange',()=>{const s=window.getSelection();if(s&&!s.isCollapsed)scheduleTools(200)});
  $('#boldToggle').addEventListener('mousedown',e=>e.preventDefault());$('#boldToggle').addEventListener('click',()=>toggleBold(selectionInfo));
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='b'){const info=captureSelection();if(info){e.preventDefault();toggleBold(info)}}});
  document.addEventListener('mousedown',e=>{if(!e.target.closest('#selectionTools')&&!e.target.closest('#answer'))hideTools()});
  render();
}catch(err){console.error(err);$('#card').style.display='none';$('#empty').style.display='block';$('#empty').textContent='加载失败：'+err.message}
