const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
const storage={
  get(k){try{return localStorage.getItem(k)}catch(e){return null}},
  set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
};
let GROUPS=[];
let selectedGroup=storage.get('p2-v10-group')||'';
let selectedQ=storage.get('p2-v10-q')||'';
let plain=false;

function getGroup(){return GROUPS.find(g=>g.id===selectedGroup)||GROUPS[0]}
function getTopic(){
  const g=getGroup();
  let t=g.topics.find(x=>x.q===selectedQ);
  if(!t){t=g.topics[0];selectedQ=t.q}
  return t;
}
function countWords(t){
  return (t.segments.map(s=>s.text).join(' ').match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)||[]).length;
}
function sharedWords(t){
  const all=t.segments.flatMap(s=>s.text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)||[]);
  const core=t.segments.filter(s=>s.kind==='core').flatMap(s=>s.text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)||[]);
  return all.length?Math.round(core.length/all.length*100):0;
}
function save(){storage.set('p2-v10-group',selectedGroup);storage.set('p2-v10-q',selectedQ)}

function buildNav(filter=''){
  const nav=$('#nav');nav.innerHTML='';let last='',shown=0;
  GROUPS.forEach((g,i)=>{
    const hay=[g.title,g.reason,g.memory,...g.topics.flatMap(t=>[t.q,t.zh,t.en,...t.segments.map(s=>s.text)])].join(' ').toLowerCase();
    if(filter&&!hay.includes(filter.toLowerCase()))return;
    if(g.category!==last){
      const h=document.createElement('div');h.className='nav-group';h.textContent=g.category;nav.appendChild(h);last=g.category;
    }
    const b=document.createElement('button');
    b.className='nav-btn'+(g.id===selectedGroup?' on':'');
    b.innerHTML=`<span class="nav-num">${String(i+1).padStart(2,'0')}</span><span class="nav-title">${esc(g.title)}</span><span class="nav-count">${g.topics.length}题</span>`;
    b.onclick=()=>{selectedGroup=g.id;selectedQ=g.topics[0].q;save();render()};
    nav.appendChild(b);shown++;
  });
  $('#empty').style.display=shown?'none':'block';
  $('#card').style.display=shown?'block':'none';
}
function render(){
  const g=getGroup(),t=getTopic();
  buildNav($('#search').value.trim());
  const idx=GROUPS.indexOf(g)+1;
  $('#index').textContent=`相似组 ${String(idx).padStart(2,'0')} / ${GROUPS.length}`;
  $('#category').textContent=`${g.topics.length} 题`;
  $('#title').textContent=g.title;
  $('#memory').innerHTML='<span class="memory-title">中文母稿记忆链</span><div class="memory-steps">'+g.memory.split('→').map((s,i,a)=>`<span class="memory-step">${esc(s.trim())}</span>${i<a.length-1?'<span class="memory-arrow">→</span>':''}`).join('')+'</div>';
  $('#note').innerHTML=`<b>为什么放一起：</b>${esc(g.reason)}`;
  const topics=$('#topics');topics.innerHTML='';
  g.topics.forEach(x=>{
    const b=document.createElement('button');b.className='topic'+(x.q===t.q?' on':'');
    b.innerHTML=`<b>${x.q}</b>${esc(x.zh)}`;
    b.onclick=()=>{selectedQ=x.q;save();render()};
    topics.appendChild(b);
  });
  $('#prompt').innerHTML=`<b>${t.q} · ${esc(t.zh)}</b><br>${esc(t.en)}`;
  $('#answerTitle').textContent=`完整答案 · ${countWords(t)} words · 母稿语料约 ${sharedWords(t)}%`;
  const ans=$('#answer');ans.className='answer'+(plain?' plain':'');
  ans.innerHTML=t.segments.map(s=>`<div class="seg ${s.kind==='core'?'shared':'local'}"><span class="seg-label">${s.kind==='core'?'母稿语料':'本题调整'}</span><p>${esc(s.text)}</p></div>`).join('');
  document.title=`${t.q} ${t.zh}｜IELTS Part 2 v10`;
}
function fullText(){return getTopic().segments.map(s=>s.text).join('\n\n')}

async function loadData(){
  const txt=await fetch('data-v10.txt?v=10',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.text()});
  const bytes=Uint8Array.from(atob(txt.trim()),c=>c.charCodeAt(0));
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  GROUPS=JSON.parse(await new Response(stream).text());

  const topics=GROUPS.flatMap(g=>g.topics);
  const qs=topics.map(t=>Number(t.q.slice(1)));
  const missing=Array.from({length:59},(_,i)=>i+1).filter(n=>!qs.includes(n));
  const dup=[...new Set(qs.filter((n,i)=>qs.indexOf(n)!==i))];
  const badLen=topics.filter(t=>countWords(t)<130||countWords(t)>180).map(t=>`${t.q}:${countWords(t)}`);
  if(GROUPS.length!==22||topics.length!==59||missing.length||dup.length||badLen.length){
    throw new Error(`数据校验失败 ${JSON.stringify({groups:GROUPS.length,count:topics.length,missing,dup,badLen})}`);
  }
  if(!selectedGroup||!GROUPS.some(g=>g.id===selectedGroup))selectedGroup=GROUPS[0].id;
  if(!selectedQ)selectedQ=GROUPS[0].topics[0].q;
  render();
}

$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(fullText());$('#copy').textContent='已复制';setTimeout(()=>$('#copy').textContent='复制答案',1000)}catch(e){alert('浏览器未允许复制，请手动选择正文。')}};
$('#mode').onclick=()=>{plain=!plain;$('#mode').textContent=plain?'模拟口述：显示标记':'模拟口述：关闭标记';render()};
$('#search').addEventListener('input',e=>GROUPS.length&&buildNav(e.target.value.trim()));

loadData().catch(err=>{
  console.error(err);
  $('#card').style.display='none';
  $('#empty').style.display='block';
  $('#empty').textContent='页面数据加载失败，请刷新重试。';
});