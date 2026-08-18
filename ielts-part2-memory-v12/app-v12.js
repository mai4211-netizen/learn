const DATA=window.P2_DATA_PARTS||[];
const GROUPS=window.P2_SIMILARITY_GROUPS||[];
const storage={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const qid=n=>`Q${String(n).padStart(2,'0')}`;
const BOLD_KEY='p2-v12-bold-ranges';
let selectedGroup=storage.get('p2-v12-group')||GROUPS[0]?.id;
let selectedQ=Number(storage.get('p2-v12-q'))||GROUPS[0]?.topics[0];
let selectionInfo=null;
let boldOnly=false;
let boldState={};
try{boldState=JSON.parse(storage.get(BOLD_KEY)||'{}')||{}}catch(e){boldState={}}

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
function save(){storage.set('p2-v12-group',selectedGroup);storage.set('p2-v12-q',String(selectedQ))}
function answerParts(template,topic){
  const omitted=new Set(topic.omitSharedIndexes||[]);
  const parts=[];
  if(topic.intro)parts.push(topic.intro);
  template.shared.forEach((text,index)=>{
    if(omitted.has(index))return;
    parts.push(text);
    if(index===0&&topic.middle)parts.push(topic.middle);
  });
  if(topic.ending)parts.push(topic.ending);
  return parts;
}
function fullText(template,topic){return answerParts(template,topic).join(' ')}
function wordCount(template,topic){return (fullText(template,topic).match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)||[]).length}

function normalizeRanges(ranges,textLength){
  const clean=(ranges||[])
    .map(([start,end])=>[Math.max(0,Math.min(start,textLength)),Math.max(0,Math.min(end,textLength))])
    .filter(([start,end])=>end>start)
    .sort((a,b)=>a[0]-b[0]);
  const merged=[];
  for(const range of clean){
    const last=merged[merged.length-1];
    if(last&&range[0]<=last[1])last[1]=Math.max(last[1],range[1]);
    else merged.push([...range]);
  }
  return merged;
}
function rangesFor(key,textLength){return normalizeRanges(boldState[key]||[],textLength)}
function renderMarkedText(text,key){
  const ranges=rangesFor(key,text.length);
  let html='',cursor=0;
  for(const [start,end] of ranges){
    html+=esc(text.slice(cursor,start));
    html+=`<strong>${esc(text.slice(start,end))}</strong>`;
    cursor=end;
  }
  return html+esc(text.slice(cursor));
}
function renderBoldOnlyText(text,key){
  const ranges=rangesFor(key,text.length);
  if(!ranges.length)return '';
  return ranges.map(([start,end])=>`<strong>${esc(text.slice(start,end))}</strong>`).join('<span class="excerpt-gap">…</span>');
}
function persistBoldState(){storage.set(BOLD_KEY,JSON.stringify(boldState))}
function closestParagraph(node){
  const element=node?.nodeType===1?node:node?.parentElement;
  return element?.closest?.('.answer-paragraph')||null;
}
function captureSelection(){
  const selection=window.getSelection();
  if(!selection||selection.rangeCount!==1||selection.isCollapsed)return null;
  const range=selection.getRangeAt(0);
  const startParagraph=closestParagraph(range.startContainer);
  const endParagraph=closestParagraph(range.endContainer);
  const answer=$('#answer');
  if(!startParagraph||!endParagraph||!answer.contains(startParagraph)||!answer.contains(endParagraph))return null;
  const paragraphs=[...answer.querySelectorAll('.answer-paragraph')];
  const startIndex=paragraphs.indexOf(startParagraph);
  const endIndex=paragraphs.indexOf(endParagraph);
  if(startIndex<0||endIndex<startIndex||!range.toString().trim())return null;
  const characterOffset=(paragraph,node,offset)=>{
    const prefix=document.createRange();
    prefix.selectNodeContents(paragraph);
    prefix.setEnd(node,offset);
    return prefix.toString().length;
  };
  const items=[];
  for(let index=startIndex;index<=endIndex;index++){
    const paragraph=paragraphs[index];
    const textLength=paragraph.textContent.length;
    const start=index===startIndex?characterOffset(paragraph,range.startContainer,range.startOffset):0;
    const end=index===endIndex?characterOffset(paragraph,range.endContainer,range.endOffset):textLength;
    if(end>start)items.push({key:paragraph.dataset.key,start,end,textLength});
  }
  return items.length?{items,rect:range.getBoundingClientRect()}:null;
}
function isFullyBold(info){return info.items.every(item=>rangesFor(item.key,item.textLength).some(([start,end])=>start<=item.start&&end>=item.end))}
function hideSelectionTools(){
  selectionInfo=null;
  const tools=$('#selectionTools');
  if(tools)tools.hidden=true;
}
function showSelectionTools(){
  const info=captureSelection();
  if(!info){hideSelectionTools();return}
  selectionInfo=info;
  const tools=$('#selectionTools');
  const button=$('#boldToggle');
  button.textContent=isFullyBold(info)?'取消加粗':'加粗';
  tools.hidden=false;
  const width=tools.offsetWidth;
  tools.style.left=`${Math.max(8,Math.min(info.rect.left+(info.rect.width-width)/2,window.innerWidth-width-8))}px`;
  tools.style.top=`${Math.min(info.rect.bottom+8,window.innerHeight-tools.offsetHeight-8)}px`;
}
function toggleBold(info){
  if(!info)return;
  const remove=isFullyBold(info);
  for(const item of info.items){
    const ranges=rangesFor(item.key,item.textLength);
    if(remove){
      const next=[];
      for(const [start,end] of ranges){
        if(end<=item.start||start>=item.end)next.push([start,end]);
        else{
          if(start<item.start)next.push([start,item.start]);
          if(end>item.end)next.push([item.end,end]);
        }
      }
      boldState[item.key]=normalizeRanges(next,item.textLength);
    }else{
      boldState[item.key]=normalizeRanges([...ranges,[item.start,item.end]],item.textLength);
    }
    if(!boldState[item.key]?.length)delete boldState[item.key];
  }
  persistBoldState();
  window.getSelection()?.removeAllRanges();
  render();
}

function buildNav(filter=''){
  const nav=$('#nav');nav.innerHTML='';let last='';let shown=0;
  GROUPS.forEach((group,index)=>{
    const records=group.topics.map(recordFor).filter(Boolean);
    const hay=[group.title,group.category,group.memory,...records.flatMap(r=>[r.topic.q,r.topic.zh,r.topic.en])].join(' ').toLowerCase();
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
  hideSelectionTools();
  const group=currentGroup();const record=currentRecord();if(!group||!record)return;
  const {template,topic}=record;
  buildNav($('#search').value.trim());
  $('#index').textContent=`相似组 ${String(GROUPS.indexOf(group)+1).padStart(2,'0')} / ${GROUPS.length}`;
  $('#category').textContent=`${group.topics.length} 题`;
  $('#title').textContent=group.title;
  $('#memory').innerHTML='<span class="memory-title">中文提示</span><div class="memory-steps">'+group.memory.split('→').map((step,index,all)=>`<span class="memory-step">${esc(step.trim())}</span>${index<all.length-1?'<span class="memory-arrow">→</span>':''}`).join('')+'</div>';

  const topics=$('#topics');topics.innerHTML='';
  group.topics.forEach(n=>{
    const item=recordFor(n);if(!item)return;
    const button=document.createElement('button');button.className='topic'+(n===selectedQ?' on':'');
    button.innerHTML=`<b>${item.topic.q}</b>${esc(item.topic.zh)}`;
    button.onclick=()=>{selectedQ=n;save();render();};topics.appendChild(button);
  });
  $('#prompt').innerHTML=`<b>${topic.q} · ${esc(topic.zh)}</b><br>${esc(topic.en)}`;
  $('#answerTitle').textContent=boldOnly?`加粗内容 · 原答案 ${wordCount(template,topic)} words`:`完整答案 · ${wordCount(template,topic)} words`;
  const filterButton=$('#boldOnlyToggle');
  filterButton.textContent=boldOnly?'显示全部':'只看加粗';
  filterButton.classList.toggle('on',boldOnly);
  const answer=$('#answer');
  const paragraphs=answerParts(template,topic).map((text,index)=>{
    const key=`${topic.q}:${index}`;
    if(boldOnly){
      const marked=renderBoldOnlyText(text,key);
      return marked?`<p class="bold-only-paragraph">${marked}</p>`:'';
    }
    return `<p class="answer-paragraph" data-key="${key}">${renderMarkedText(text,key)}</p>`;
  }).filter(Boolean);
  answer.innerHTML=paragraphs.length?paragraphs.join(''):'<div class="bold-empty">当前答案还没有加粗内容。请先点击“显示全部”，选中文字后加粗。</div>';
  document.title=`${topic.q} ${topic.zh}｜IELTS Part 2 相似内容版 v12`;
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
  if(stats[2])stats[2].textContent='B';
  const foot=document.querySelector('.foot');
  if(foot)foot.textContent='v12 · 相似内容尽量共用 · 每题保留扣题角度 · 加粗自动保存在当前浏览器';
  if(!GROUPS.find(g=>g.id===selectedGroup)){selectedGroup=GROUPS[0].id;selectedQ=GROUPS[0].topics[0];}
  $('#search').addEventListener('input',event=>buildNav(event.target.value.trim()));
  $('#answer').addEventListener('mouseup',()=>setTimeout(showSelectionTools,0));
  $('#answer').addEventListener('keyup',()=>setTimeout(showSelectionTools,0));
  $('#boldToggle').addEventListener('mousedown',event=>event.preventDefault());
  $('#boldToggle').addEventListener('click',()=>toggleBold(selectionInfo));
  $('#boldOnlyToggle').addEventListener('click',()=>{boldOnly=!boldOnly;hideSelectionTools();render()});
  document.addEventListener('mousedown',event=>{if(!event.target.closest('#selectionTools')&&!event.target.closest('#answer'))hideSelectionTools()});
  document.addEventListener('keydown',event=>{
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='b'){
      const info=captureSelection();
      if(info){event.preventDefault();toggleBold(info)}
    }
  });
  render();
}catch(error){
  console.error(error);
  $('#card').style.display='none';$('#empty').style.display='block';
  $('#empty').innerHTML='<b>加载失败</b><br>内容校验没有通过，因此没有显示可能出错的答案。';
}
