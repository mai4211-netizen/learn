const GROUPS = [
  {id:'fan-help-switch',title:'见面会旅行：我被帮助 / 我帮助妹妹',reason:'核心事件几乎一样：害羞或不敢独自准备见面会旅行 → 另一方帮做计划、给建议 → 最后成功去成。主要差别是主语和视角。',topics:[1,19,37,38,41]},
  {id:'concert-volunteer-help',title:'演唱会志愿者 / 乐于助人',reason:'都围绕 Claire 帮粉丝、做志愿者以及演唱会现场帮助别人。',topics:[4,22]},
  {id:'concert-plan-team',title:'香港演唱会旅行：找票 / 组织 / 团队分工',reason:'同一次类型的演唱会旅行准备：找票、分工、处理突发情况。每题保留自己的完整旧稿，不互相塞事件。',topics:[5,7,44]},
  {id:'concert-change-early',title:'决定去演唱会 / 改计划 / 凌晨早起',reason:'同一条旅行变化链：决定去演唱会 → 交通计划变化 → 很早出发。',topics:[6,42,43]},
  {id:'concert-live',title:'演唱会现场：微笑 / 禁手机 / 糟糕体验',reason:'都发生在演唱会现场，但题目重点不同，所以只放同一 tab，不共用正文。',topics:[39,40,57]},
  {id:'watch-problem-smart',title:'智能手表故障 / 机智解决',reason:'同一个手表故障与解决过程，只是 Q23 把重点放在“谁用聪明办法解决”。',topics:[2,3,23]},
  {id:'watch-life',title:'智能手表日常：离不开 / 超预算 / 想拥有 / App',reason:'都围绕 Apple Watch、Health / AutoSleep 和健康习惯，主体语料高度重合。',topics:[46,47,48,49]},
  {id:'pottery-make',title:'亲手做陶艺 / 喜欢的传统物品',reason:'都围绕亲手做陶艺、传统工艺与现代设计。',topics:[8,50]},
  {id:'pottery-media',title:'陶艺节目 / 有趣视频 / 本地新闻',reason:'都来自现代陶艺的媒体内容，差别主要是题目把它定义成节目、视频还是本地新闻。',topics:[14,51,52]},
  {id:'k11',title:'K11：姐姐的家 / 少花钱 / 高建筑 / 无聊地方',reason:'地点完全相同，都是 K11；不同题只改变看这个地点的角度。',topics:[9,26,33,34]},
  {id:'tokyo',title:'东京旅行：推荐 / 最喜欢 / 想再去',reason:'同一次东京旅行，题目只改变推荐、喜爱或未来重访的角度。',topics:[10,35,36]},
  {id:'island',title:'日本小岛：骑行 / 改变想法 / 交通堵塞',reason:'同一旅行背景和交通问题；Q11/Q16 共用度很高，Q27 属于同一旅行故事族但保留自己的堵车主线。',topics:[11,16,27]},
  {id:'zootopia',title:'Zootopia：动物故事 / 近期电影',reason:'作品完全相同，主体故事可以高度复用。',topics:[12,13]},
  {id:'mooncake',title:'中秋月饼：名人广告 / 传统习俗',reason:'都围绕中秋与做月饼，但旧稿是两个不同事件，所以只放一起记，不强行合成一篇。',topics:[15,53]},
  {id:'art-business',title:'线上绘画平台：目标 / 工作 / 成功商业 / 公司',reason:'核心业务模型相同：线上卖画、与画家合作、AR 预览、社媒获客；主语在“我想做”与“Claire 已经在做”之间切换。',topics:[17,18,31,32]},
  {id:'claire-learning',title:'Claire：学语言 / 自学 / 发小',reason:'人物相同，Q20/Q24 主体高度重合；Q28 复用人物关系和性格背景。',topics:[20,24,28]},
  {id:'claire-nature',title:'Claire：爱护自然 / 在家种菜',reason:'同一人物、同一类日常行为，种植与环保内容高度相关。',topics:[21,29]},
  {id:'claire-art',title:'Claire：特殊蛋糕 / 画画朋友 / 想见的名人',reason:'都围绕 Claire 的绘画能力与多年关系；Q56 保留自己的蛋糕完整故事，不再插入 Q58/Q59 的人物履历。',topics:[56,58,59]},
  {id:'medical',title:'想从事医疗行业的人',reason:'主线与其他人物稿差异较大，单独保留。',topics:[30]},
  {id:'yellow-river',title:'黄河：重要河流',reason:'题目要求解释“为什么重要”，单独保留避免被旅行语料冲淡。',topics:[25]},
  {id:'penguin-law',title:'帝企鹅 / 环保法律',reason:'法律想法来自企鹅栖息地与全球变暖，因果链可以一起记。',topics:[54,55]},
  {id:'hockey',title:'温哥华冰球比赛',reason:'体育比赛主线独立，单独保留。',topics:[45]}
];

const APPROVED = {
  11: {
    story:'想再去日本小岛骑行 → 上次公交少又错过车 → 临时租自行车 → 海边骑行很舒服 → 下次还想骑车',
    paragraphs:[
      "I'd like to talk about a cycling trip I would like to take again with my friend. We went to a quiet Japanese island last year, and I really enjoyed cycling there.",
      "I'd like to go there again on my next trip to Japan, preferably when the weather is cooler. Public transport on the island is limited, and last time we missed our bus, so we rented bikes instead.",
      "At first, I thought cycling was a bad idea because it was very hot. But once we started riding, I changed my mind. I could see the open view, feel the wind on my face and enjoy the coastline slowly.",
      "That's why I want to go by bicycle again. I can enjoy the scenery at my own pace, and I don't need to worry so much about the bus schedule."
    ]
  },
  16: {
    story:'原以为好旅行一定要按计划 → 小岛错过公交 → 临时改骑自行车 → 反而看到更好的风景 → 改变对旅行计划的看法',
    paragraphs:[
      "I'd like to talk about a trip that changed an important opinion of mine. I used to think that a good trip needed a clear plan and convenient transport. If something went wrong, I thought the whole trip would become worse.",
      "Last year, I went to a quiet Japanese island with my friend. Public transport was limited, and we missed our bus. The next one would not come for hours, so my friend suggested renting bikes instead.",
      "At first, I wasn't happy about the change because it was very hot. But once we started riding, I could see the coastline, the blue sea and the open view. I could also feel the wind on my face.",
      "That experience changed my opinion. I realised that a trip doesn't always need to follow the original plan. Sometimes an unexpected change can make it even better."
    ]
  },
  25: {
    story:'和朋友去黄河 → 中国历史和文化的重要部分 → 过去承担交通作用 → 看到宽阔河面和历史雕塑 → 理解为什么重要',
    paragraphs:[
      "I'd like to talk about the Yellow River, which I visited with a friend last year. We stayed in a rural village near the river because we wanted a break from our busy lives.",
      "I think the Yellow River is important mainly because it has a long history and is closely connected with Chinese culture. In the past, people used it as a transport route between different places. Today, many places along the river are tourist attractions where people can learn about local history.",
      "The river was very wide, and the water looked powerful. When we walked beside it, we also saw a large sculpture built to remember a historical hero. Later, we rented bikes and rode along the river for a while.",
      "For me, it is not only a beautiful river. It also carries a lot of history, and that is why I think it is important."
    ]
  }
};

const storage={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
let QUESTIONS=[];
let selectedGroup=storage.get('p2-v9-group')||GROUPS[0].id;
let selectedQ=Number(storage.get('p2-v9-q'))||GROUPS[0].topics[0];
let plain=false;

function countWords(paragraphs){return ((paragraphs||[]).join(' ').match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)||[]).length}
function parseOldPage(html){
  const doc=new DOMParser().parseFromString(html,'text/html');
  const out=[];
  for(let n=1;n<=59;n++){
    const card=doc.querySelector(`#q${n}`);
    if(!card) throw new Error(`旧版缺少 Q${String(n).padStart(2,'0')}`);
    const answer=card.querySelector(`#answer-${n}`)||card.querySelector('.answer');
    if(!answer) throw new Error(`旧版 Q${n} 没有最终回答`);
    const paragraphs=[...answer.querySelectorAll('p')].map(p=>p.textContent.replace(/\s+/g,' ').trim()).filter(Boolean);
    const prompt=card.querySelector('.prompt .question')?.textContent.trim()||'';
    const title=card.querySelector('.card-head h3')?.textContent.trim()||`Q${n}`;
    const story=card.querySelector(`#story-cn-${n}`)?.textContent.trim()||'';
    const approved=APPROVED[n];
    out.push({n,q:`Q${String(n).padStart(2,'0')}`,title,prompt,story:approved?.story||story,paragraphs:approved?.paragraphs||paragraphs,modified:!!approved});
  }
  return out;
}

function getGroup(){return GROUPS.find(g=>g.id===selectedGroup)||GROUPS[0]}
function getQuestion(){const g=getGroup();if(!g.topics.includes(selectedQ))selectedQ=g.topics[0];return QUESTIONS.find(q=>q.n===selectedQ)}
function save(){storage.set('p2-v9-group',selectedGroup);storage.set('p2-v9-q',String(selectedQ))}

function category(g){
  if(['fan-help-switch','concert-volunteer-help','concert-plan-team','concert-change-early','concert-live'].includes(g.id)) return '演唱会 / 见面会';
  if(['watch-problem-smart','watch-life'].includes(g.id)) return '智能手表 / 科技';
  if(['art-business','claire-learning','claire-nature','claire-art','medical'].includes(g.id)) return '人物 / Claire';
  if(['k11','tokyo','island','yellow-river','hockey'].includes(g.id)) return '地点 / 旅行';
  return '故事 / 物品 / 文化';
}

function buildNav(filter=''){
  const nav=$('#nav');nav.innerHTML='';let shown=0,last='';
  GROUPS.forEach((g,i)=>{
    const qs=g.topics.map(n=>QUESTIONS.find(q=>q.n===n)).filter(Boolean);
    const hay=[g.title,g.reason,...qs.flatMap(q=>[q.q,q.title,q.prompt,q.story])].join(' ').toLowerCase();
    if(filter&&!hay.includes(filter.toLowerCase())) return;
    const cat=category(g);
    if(cat!==last){const d=document.createElement('div');d.className='nav-group';d.textContent=cat;nav.appendChild(d);last=cat;}
    const b=document.createElement('button');b.className='nav-btn'+(g.id===selectedGroup?' on':'');
    b.innerHTML=`<span class="nav-num">${String(i+1).padStart(2,'0')}</span><span class="nav-title">${esc(g.title)}</span><span class="nav-count">${g.topics.length}题</span>`;
    b.onclick=()=>{selectedGroup=g.id;selectedQ=g.topics[0];save();render();};nav.appendChild(b);shown++;
  });
  $('#empty').style.display=shown?'none':'block';$('#card').style.display=shown?'block':'none';
}

function render(){
  const g=getGroup(),q=getQuestion();if(!q)return;
  buildNav($('#search').value.trim());
  const idx=GROUPS.indexOf(g)+1;
  $('#index').textContent=`相似组 ${String(idx).padStart(2,'0')} / ${GROUPS.length}`;
  $('#category').textContent=`${g.topics.length} 题`;
  $('#title').textContent=g.title;
  const memory=q.story||'按旧稿故事顺序复述';
  $('#memory').innerHTML='<span class="memory-title">中文记忆链</span><div class="memory-steps">'+memory.split('→').map((s,i,a)=>`<span class="memory-step">${esc(s.trim())}</span>${i<a.length-1?'<span class="memory-arrow">→</span>':''}`).join('')+'</div>';
  $('#note').textContent='为什么放一起：'+g.reason+' 同组只表示相似，不会把其他题的事件塞进当前答案。';
  $('#note').style.display='block';
  const topics=$('#topics');topics.innerHTML='';
  g.topics.forEach(n=>{const x=QUESTIONS.find(q=>q.n===n);const b=document.createElement('button');b.className='topic'+(n===q.n?' on':'');b.innerHTML=`<b>${x.q}</b>${esc(x.title)}`;b.onclick=()=>{selectedQ=n;save();render()};topics.appendChild(b)});
  $('#prompt').innerHTML=`<b>${q.q} · ${esc(q.title)}</b><br>${esc(q.prompt)}`;
  $('#answerTitle').textContent=`完整答案 · ${countWords(q.paragraphs)} words`;
  $('#answer').className='answer'+(plain?' plain':'');
  const cls=q.modified?'local':'shared';
  $('#answer').innerHTML=q.paragraphs.map((p,i)=>`<div class="seg ${cls}"><span class="seg-label">${q.modified?'已确认局部修正':'旧稿完整回答'} ${i+1}</span><p>${esc(p)}</p></div>`).join('');
  document.title=`${q.q} ${q.title}｜IELTS Part 2 相似组 v9`;
}

function fullText(){const q=getQuestion();return q.paragraphs.join('\n\n')}

async function init(){
  try{
    const res=await fetch('../ielts-speaking-review/?source=v9',{cache:'no-store'});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    QUESTIONS=parseOldPage(await res.text());
    const nums=GROUPS.flatMap(g=>g.topics);
    const missing=Array.from({length:59},(_,i)=>i+1).filter(n=>!nums.includes(n));
    const dup=[...new Set(nums.filter((n,i)=>nums.indexOf(n)!==i))];
    if(nums.length!==59||missing.length||dup.length) throw new Error(`分组校验失败：${JSON.stringify({count:nums.length,missing,dup})}`);
    if(QUESTIONS.length!==59) throw new Error('题目数量不是 59');
    const bad=QUESTIONS.filter(q=>!q.prompt||!q.paragraphs.length);
    if(bad.length) throw new Error(`旧稿读取失败：${bad.map(q=>q.q).join(', ')}`);
    const savedGroup=GROUPS.find(g=>g.id===selectedGroup);
    if(!savedGroup){selectedGroup=GROUPS[0].id;selectedQ=GROUPS[0].topics[0];}
    render();
  }catch(err){
    console.error(err);
    $('#card').style.display='none';
    $('#empty').style.display='block';
    $('#empty').textContent='旧稿读取失败：'+err.message;
  }
}

$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(fullText());$('#copy').textContent='已复制';setTimeout(()=>$('#copy').textContent='复制答案',1200)}catch(e){alert('浏览器未允许复制，请手动选择正文。')}};
$('#mode').onclick=()=>{plain=!plain;$('#mode').textContent=plain?'模拟口述：显示标记':'模拟口述：关闭标记';render()};
$('#search').addEventListener('input',e=>buildNav(e.target.value.trim()));
init();
