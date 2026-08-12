const DATA=window.P2_DATA_PARTS||[];
const GROUPS=window.P2_SIMILARITY_GROUPS||[];
const storage={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const qid=n=>`Q${String(n).padStart(2,'0')}`;
let selectedGroup=storage.get('p2-v11-group')||GROUPS[0]?.id;
let selectedQ=Number(storage.get('p2-v11-q'))||GROUPS[0]?.topics[0];
let plain=false;

function recordFor(n){
  const q=qid(n);
  for(const template of DATA){
    const topic=template.topics.find(x=>x.q===q);
    if(topic)return {template,topic};
  }
  return null;
}
function currentGroup(){return GROUPS.find(g=>g.id===selectedGroup)||GROUPS[0]}
function currentRecord(){
  const group=currentGroup();
  if(!group.topics.includes(selectedQ))selectedQ=group.topics[0];
  return recordFor(selectedQ);
}
function save(){storage.set('p2-v11-group',selectedGroup);storage.set('p2-v11-q',String(selectedQ))}
function answerParts(template,topic){
  const omitted=new Set(topic.omitSharedIndexes||[]);
  const parts=[];
  if(topic.intro)parts.push(['local','本题开头',topic.intro]);
  template.shared.forEach((text,index)=>{
    if(omitted.has(index))return;
    parts.push(['shared',`核心母稿 ${index+1}`,text]);
    if(index===0&&topic.middle)parts.push(['local','本题调整',topic.middle]);
  });
  if(topic.ending)parts.push(['local','本题收尾',topic.ending]);
  return parts;
}
function fullText(template,topic){return answerParts(template,topic).map(x=>x[2]).join(' ')}
function wordCount(template,topic){return (fullText(template,topic).match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)||[]).length}

function buildNav(filter=''){
  const nav=$('#nav');nav.innerHTML='';let last='';let shown=0;
  GROUPS.forEach((group,index)=>{
    const records=group.topics.map(recordFor).filter(Boolean);
    const hay=[group.title,group.category,group.memory,group.reason,...records.flatMap(r=>[r.topic.q,r.topic.zh,r.topic.en])].join(' ').toLowerCase();
    if(filter&&!hay.includes(filter.toLowerCase()))return;
    if(group.category!==last){const label=document.createElement('div');label.className='nav-group';label.textContent=group.category;nav.appendChild(label);last=group.category;}
    const button=document.createElement('button');button.className='nav-btn'+(group.id===selectedGroup?' on':'');
    button.innerHTML=`<span class="nav-num">${String(index+1).padStart(2,'0')}</span><span class="nav-title">${esc(group.title)}</span><span class="nav-count">${group.topics.length}题</span>`;
    button.onclick=()=>{selectedGroup=group.id;selectedQ=group.topics[0];save();render();};
    nav.appendChild(button);shown++;
  });
  $('#empty').style.display=shown?'none':'block';
  $('#card').style.display=shown?'block':'none';
}

function render(){
  const group=currentGroup();const record=currentRecord();if(!group||!record)return;
  const {template,topic}=record;
  buildNav($('#search').value.trim());
  $('#index').textContent=`相似组 ${String(GROUPS.indexOf(group)+1).padStart(2,'0')} / ${GROUPS.length}`;
  $('#category').textContent=`${group.topics.length} 题`;
  $('#title').textContent=group.title;
  $('#memory').innerHTML='<span class="memory-title">本组共用骨架</span><div class="memory-steps">'+group.memory.split('→').map((step,index,all)=>`<span class="memory-step">${esc(step.trim())}</span>${index<all.length-1?'<span class="memory-arrow">→</span>':''}`).join('')+'</div>';
  $('#note').innerHTML=`<b>为什么放一起：</b>${esc(group.reason)}`;
  $('#note').style.display='block';

  const topics=$('#topics');topics.innerHTML='';
  group.topics.forEach(n=>{
    const item=recordFor(n);if(!item)return;
    const button=document.createElement('button');button.className='topic'+(n===selectedQ?' on':'');
    button.innerHTML=`<b>${item.topic.q}</b>${esc(item.topic.zh)}`;
    button.onclick=()=>{selectedQ=n;save();render();};topics.appendChild(button);
  });
  $('#prompt').innerHTML=`<b>${topic.q} · ${esc(topic.zh)}</b><br>${esc(topic.en)}`;
  $('#answerTitle').textContent=`完整答案 · ${wordCount(template,topic)} words · 核心分支：${template.title}`;
  const answer=$('#answer');answer.className='answer'+(plain?' plain':'');
  answer.innerHTML=answerParts(template,topic).map(([cls,label,text])=>`<div class="seg ${cls}"><span class="seg-label">${label}</span><p>${esc(text)}</p></div>`).join('');
  document.title=`${topic.q} ${topic.zh}｜IELTS Part 2 相似语料 v11`;
}

function validate(){
  const topics=DATA.flatMap(template=>template.topics.map(topic=>topic.q));
  const grouped=GROUPS.flatMap(group=>group.topics.map(qid));
  const expected=Array.from({length:59},(_,index)=>qid(index+1));
  const missing=expected.filter(q=>!topics.includes(q)||!grouped.includes(q));
  const duplicate=list=>[...new Set(list.filter((q,index)=>list.indexOf(q)!==index))];
  if(topics.length!==59||grouped.length!==59||missing.length||duplicate(topics).length||duplicate(grouped).length){
    throw new Error(`59 题覆盖校验失败：${JSON.stringify({topics:topics.length,grouped:grouped.length,missing,topicDuplicate:duplicate(topics),groupDuplicate:duplicate(grouped)})}`);
  }
}

try{
  validate();
  const stats=document.querySelectorAll('.stat b');
  if(stats[0])stats[0].textContent='59';
  if(stats[1])stats[1].textContent=String(GROUPS.length);
  if(stats[2])stats[2].textContent='✓';
  const foot=document.querySelector('.foot');
  if(foot)foot.textContent='v11 · 原稿优先 · 扣题优先 · 高相似内容同 tab · 59 题逐题复查';
  if(!GROUPS.find(g=>g.id===selectedGroup)){selectedGroup=GROUPS[0].id;selectedQ=GROUPS[0].topics[0];}
  $('#copy').onclick=async()=>{const {template,topic}=currentRecord();try{await navigator.clipboard.writeText(fullText(template,topic));$('#copy').textContent='已复制';setTimeout(()=>$('#copy').textContent='复制答案',1200)}catch(e){alert('浏览器未允许复制，请手动选择正文。')}};
  $('#mode').onclick=()=>{plain=!plain;$('#mode').textContent=plain?'模拟口述：显示标记':'模拟口述：关闭标记';render();};
  $('#search').addEventListener('input',event=>buildNav(event.target.value.trim()));
  render();
}catch(error){
  console.error(error);
  $('#card').style.display='none';$('#empty').style.display='block';
  $('#empty').innerHTML='<b>加载失败</b><br>内容校验没有通过，因此没有显示可能出错的答案。';
}
