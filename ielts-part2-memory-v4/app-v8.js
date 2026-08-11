const GROUPS = [
  {id:'fan-help',title:'朋友帮我解决见面会问题',topics:[1]},
  {id:'watch-problem',title:'智能手表故障',topics:[2,3]},
  {id:'concert-volunteer',title:'韩国演唱会志愿工作',topics:[4]},
  {id:'ticket-reply',title:'买演唱会票：卖家很久不回复',topics:[5]},
  {id:'concert-decision',title:'决定去演唱会 / 改变计划',topics:[6,42]},
  {id:'happy-event',title:'组织朋友去演唱会',topics:[7]},
  {id:'pottery-making',title:'亲手做陶艺',topics:[8,50]},
  {id:'sister-home',title:'姐姐住在 K11 楼上',topics:[9]},
  {id:'tokyo',title:'东京旅行',topics:[10,35,36]},
  {id:'island-bike',title:'日本小岛骑行',topics:[11,16]},
  {id:'zootopia',title:'Zootopia',topics:[12,13]},
  {id:'pottery-report',title:'本地陶艺节目 / 新闻',topics:[14,52]},
  {id:'idol-ad',title:'偶像的中秋月饼广告',topics:[15]},
  {id:'art-goal',title:'线上绘画平台：目标 / 理想工作',topics:[17,18]},
  {id:'sister-success',title:'妹妹独自去见面会',topics:[19,41]},
  {id:'claire-language',title:'Claire 自学语言',topics:[20,24]},
  {id:'claire-nature',title:'Claire 爱护自然',topics:[21]},
  {id:'claire-helpful',title:'Claire 乐于助人',topics:[22]},
  {id:'smart-claire',title:'Claire 机智解决手表问题',topics:[23]},
  {id:'yellow-river',title:'黄河',topics:[25]},
  {id:'k11-cheap-boring',title:'K11：少花钱 / 无聊',topics:[26,34]},
  {id:'traffic-jam',title:'日本旅行遇到两小时堵车',topics:[27]},
  {id:'best-friend',title:'发小 Claire',topics:[28]},
  {id:'claire-grow',title:'Claire 在家种菜',topics:[29]},
  {id:'medical',title:'想从事医疗行业的人',topics:[30]},
  {id:'successful-business',title:'Claire 的成功商业',topics:[31]},
  {id:'successful-company',title:'Claire 在成功公司工作',topics:[32]},
  {id:'k11-building',title:'K11 高建筑',topics:[33]},
  {id:'encourage-friend',title:'鼓励朋友去见面会',topics:[37]},
  {id:'advice-friend',title:'给朋友演唱会旅行建议',topics:[38]},
  {id:'concert-smile',title:'演唱会最后大家都笑了',topics:[39]},
  {id:'phone-ban',title:'演唱会禁止用手机',topics:[40]},
  {id:'early-concert',title:'凌晨三点起床去香港看演出',topics:[43]},
  {id:'teamwork',title:'三人演唱会旅行分工',topics:[44]},
  {id:'hockey',title:'温哥华冰球比赛',topics:[45]},
  {id:'watch-essential',title:'生活中离不开的智能手表',topics:[46]},
  {id:'watch-expensive',title:'花费超预算买智能手表',topics:[47]},
  {id:'watch-want',title:'想拥有的智能手表',topics:[48]},
  {id:'health-app',title:'Health / AutoSleep App',topics:[49]},
  {id:'pottery-video',title:'TikTok 陶艺视频',topics:[51]},
  {id:'family-mooncake',title:'全家一起做中秋月饼',topics:[53]},
  {id:'penguin-law',title:'帝企鹅 / 公共交通环保法',topics:[54,55]},
  {id:'special-cake',title:'十年友谊的特殊蛋糕',topics:[56]},
  {id:'bad-music',title:'下雨又禁拍的音乐活动',topics:[57]},
  {id:'claire-drawing',title:'Claire 画画 / 线上知名度',topics:[58,59]}
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
let selectedGroup=storage.get('p2-v8-group')||GROUPS[0].id;
let selectedQ=Number(storage.get('p2-v8-q'))||GROUPS[0].topics[0];
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

function groupForQ(n){return GROUPS.find(g=>g.topics.includes(n))}
function getGroup(){return GROUPS.find(g=>g.id===selectedGroup)||GROUPS[0]}
function getQuestion(){const g=getGroup();if(!g.topics.includes(selectedQ))selectedQ=g.topics[0];return QUESTIONS.find(q=>q.n===selectedQ)}
function save(){storage.set('p2-v8-group',selectedGroup);storage.set('p2-v8-q',String(selectedQ))}

function buildNav(filter=''){
  const nav=$('#nav'); nav.innerHTML=''; let shown=0; let last='';
  const groupCategory=g=>{
    if(/fan|concert|ticket|sister-success|encourage|advice|teamwork|early|phone-ban|bad-music/.test(g.id)) return '演唱会 / 见面会';
    if(/watch|smart|health-app/.test(g.id)) return '智能手表 / 科技';
    if(/claire|best-friend|medical|art-goal|successful/.test(g.id)) return 'Claire / 人物';
    if(/sister-home|tokyo|island|yellow|k11|traffic|hockey/.test(g.id)) return '地点 / 旅行';
    return '故事 / 物品 / 文化';
  };
  GROUPS.forEach((g,i)=>{
    const qs=g.topics.map(n=>QUESTIONS.find(q=>q.n===n)).filter(Boolean);
    const hay=[g.title,...qs.flatMap(q=>[q.q,q.title,q.prompt,q.story])].join(' ').toLowerCase();
    if(filter&&!hay.includes(filter.toLowerCase())) return;
    const cat=groupCategory(g);
    if(cat!==last){const d=document.createElement('div');d.className='nav-group';d.textContent=cat;nav.appendChild(d);last=cat;}
    const b=document.createElement('button');b.className='nav-btn'+(g.id===selectedGroup?' on':'');
    b.innerHTML=`<span class="nav-num">${String(i+1).padStart(2,'0')}</span><span class="nav-title">${esc(g.title)}</span><span class="nav-count">${g.topics.length}题</span>`;
    b.onclick=()=>{selectedGroup=g.id;selectedQ=g.topics[0];save();render();};nav.appendChild(b);shown++;
  });
  $('#empty').style.display=shown?'none':'block';$('#card').style.display=shown?'block':'none';
}

function render(){
  const g=getGroup(); const q=getQuestion(); if(!q)return;
  buildNav($('#search').value.trim());
  const idx=GROUPS.indexOf(g)+1;
  $('#index').textContent=`分组 ${String(idx).padStart(2,'0')} / ${GROUPS.length}`;
  $('#category').textContent=`${g.topics.length} 题`;
  $('#title').textContent=g.title;
  const memory=q.story||'按旧稿故事顺序复述';
  $('#memory').innerHTML='<span class="memory-title">中文记忆链</span><div class="memory-steps">'+memory.split('→').map((s,i,a)=>`<span class="memory-step">${esc(s.trim())}</span>${i<a.length-1?'<span class="memory-arrow">→</span>':''}`).join('')+'</div>';
  $('#note').textContent=q.modified?'已确认的局部修正：只改旧稿本身不够扣题的地方。':'直接使用旧版最终回答，不再把其他题目的事件拼进来。';
  $('#note').style.display='block';
  const topics=$('#topics');topics.innerHTML='';
  g.topics.forEach(n=>{const x=QUESTIONS.find(q=>q.n===n);const b=document.createElement('button');b.className='topic'+(n===q.n?' on':'');b.innerHTML=`<b>${x.q}</b>${esc(x.title)}`;b.onclick=()=>{selectedQ=n;save();render()};topics.appendChild(b)});
  $('#prompt').innerHTML=`<b>${q.q} · ${esc(q.title)}</b><br>${esc(q.prompt)}`;
  $('#answerTitle').textContent=`完整答案 · ${countWords(q.paragraphs)} words`;
  const cls=q.modified?'local':'shared';
  $('#answer').className='answer'+(plain?' plain':'');
  $('#answer').innerHTML=q.paragraphs.map((p,i)=>`<div class="seg ${cls}"><span class="seg-label">${q.modified?'已确认修正':'旧稿'} ${i+1}</span><p>${esc(p)}</p></div>`).join('');
  document.title=`${q.q} ${q.title}｜IELTS Part 2 v8`;
}

function fullText(){const q=getQuestion();return q.paragraphs.join('\n\n')}

async function init(){
  try{
    const res=await fetch('../ielts-speaking-review/?source=v8',{cache:'no-store'});
    if(!res.ok)throw new Error(`HTTP ${res.status}`);
    QUESTIONS=parseOldPage(await res.text());
    const nums=GROUPS.flatMap(g=>g.topics);
    const missing=Array.from({length:59},(_,i)=>i+1).filter(n=>!nums.includes(n));
    const dup=[...new Set(nums.filter((n,i)=>nums.indexOf(n)!==i))];
    if(nums.length!==59||missing.length||dup.length)throw new Error(`分组校验失败：${JSON.stringify({count:nums.length,missing,dup})}`);
    if(QUESTIONS.length!==59)throw new Error('题目数量不是 59');
    const bad=QUESTIONS.filter(q=>!q.prompt||!q.paragraphs.length);
    if(bad.length)throw new Error(`题目内容缺失：${bad.map(x=>x.q).join(', ')}`);
    const stats=document.querySelectorAll('.stat b');
    if(stats[0])stats[0].textContent='59';
    if(stats[1])stats[1].textContent=String(GROUPS.length);
    if(stats[2])stats[2].textContent=String(Object.keys(APPROVED).length);
    selectedGroup=groupForQ(selectedQ)?.id||selectedGroup;
    $('#search').addEventListener('input',e=>buildNav(e.target.value.trim()));
    $('#mode').onclick=()=>{plain=!plain;$('#mode').textContent=plain?'模拟口述：显示标记':'模拟口述：关闭标记';render()};
    $('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(fullText());$('#copy').textContent='已复制';setTimeout(()=>$('#copy').textContent='复制答案',1200)}catch(e){alert('浏览器未允许复制，请手动选择正文。')}};
    render();
  }catch(err){
    console.error(err);
    $('#card').style.display='none';$('#empty').style.display='block';
    $('#empty').innerHTML='<b>加载失败</b><br>旧版答案读取失败，因此没有显示任何可能错误的拼接内容。请刷新页面。';
  }
}
init();
