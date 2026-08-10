const DATA=window.P2_DATA_PARTS||[];
const storage={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
let selectedTemplate=storage.get('p2-template')||DATA[0].id;
let selectedTopic=storage.get('p2-topic')||DATA[0].topics[0].q;
let plain=false;
const $=s=>document.querySelector(s);
function esc(s){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function buildNav(filter=''){
  const nav=$('#nav');nav.innerHTML='';let last='';let shown=0;
  DATA.forEach((t,i)=>{const hay=[t.title,t.category,t.memory,...t.topics.flatMap(x=>[x.q,x.zh,x.en])].join(' ').toLowerCase();if(filter&&!hay.includes(filter.toLowerCase()))return;
    if(t.category!==last){const g=document.createElement('div');g.className='nav-group';g.textContent=t.category;nav.appendChild(g);last=t.category}
    const b=document.createElement('button');b.className='nav-btn'+(t.id===selectedTemplate?' on':'');b.innerHTML=`<span class="nav-num">${String(i+1).padStart(2,'0')}</span><span class="nav-title">${esc(t.title)}</span><span class="nav-count">${t.topics.length}题</span>`;b.onclick=()=>{selectedTemplate=t.id;selectedTopic=t.topics[0].q;save();render();};nav.appendChild(b);shown++;
  });$('#empty').style.display=shown?'none':'block';$('#card').style.display=shown?'block':'none';
}
function getCurrent(){let t=DATA.find(x=>x.id===selectedTemplate)||DATA[0];let topic=t.topics.find(x=>x.q===selectedTopic)||t.topics[0];return[t,topic]}
function answerParts(t,topic){let a=[['local','本题开头',topic.intro],['shared','固定故事 1',t.shared[0]]];if(topic.middle)a.push(['local','本题补充',topic.middle]);for(let i=1;i<t.shared.length;i++)a.push(['shared',`固定故事 ${i+1}`,t.shared[i]]);if(topic.ending)a.push(['local','本题收尾',topic.ending]);return a}
function save(){storage.set('p2-template',selectedTemplate);storage.set('p2-topic',selectedTopic)}
function render(){const [t,topic]=getCurrent();buildNav($('#search').value.trim());const idx=DATA.indexOf(t)+1;$('#index').textContent=`模板 ${String(idx).padStart(2,'0')} / ${DATA.length}`;$('#category').textContent=t.category;$('#title').textContent=t.title;$('#memory').innerHTML='<span class="memory-title">中文记忆链</span><div class="memory-steps">'+t.memory.split('→').map((s,i,a)=>`<span class="memory-step">${esc(s.trim())}</span>${i<a.length-1?'<span class="memory-arrow">→</span>':''}`).join('')+'</div>';$('#note').textContent=t.note||'';$('#note').style.display=t.note?'block':'none';
  const topics=$('#topics');topics.innerHTML='';t.topics.forEach(x=>{const b=document.createElement('button');b.className='topic'+(x.q===topic.q?' on':'');b.innerHTML=`<b>${x.q}</b>${esc(x.zh)}`;b.onclick=()=>{selectedTopic=x.q;save();render()};topics.appendChild(b)});
  $('#prompt').innerHTML=`<b>${topic.q} · ${esc(topic.zh)}</b><br>${esc(topic.en)}`;$('#answerTitle').textContent=`完整答案 · ${wordCount(t,topic)} words`;
  const ans=$('#answer');ans.className='answer'+(plain?' plain':'');ans.innerHTML=answerParts(t,topic).map(([cls,label,text])=>`<div class="seg ${cls}"><span class="seg-label">${label}</span><p>${esc(text)}</p></div>`).join('');
  document.title=`${topic.q} ${topic.zh}｜IELTS Part 2 压缩版`;
}
function fullText(t,topic){return answerParts(t,topic).map(x=>x[2]).join(' ')}
function wordCount(t,topic){return (fullText(t,topic).match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)||[]).length}
$('#copy').onclick=async()=>{const[t,topic]=getCurrent();try{await navigator.clipboard.writeText(fullText(t,topic));$('#copy').textContent='已复制';setTimeout(()=>$('#copy').textContent='复制答案',1200)}catch(e){alert('浏览器未允许复制，请手动选择正文。')}};
$('#mode').onclick=()=>{plain=!plain;$('#mode').textContent=plain?'模拟口述：显示标记':'模拟口述：关闭标记';render()};
$('#search').addEventListener('input',e=>buildNav(e.target.value.trim()));
render();