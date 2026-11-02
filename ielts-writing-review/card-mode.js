(function(){
const top=document.querySelector('.topbar'),nav=document.querySelector('.tabs');
if(!top||!nav||document.getElementById('study-root'))return;
const css=document.createElement('style');
css.textContent=[
'.study-mode{display:flex;gap:3px;margin-left:auto;background:#ebe8e0;border-radius:99px;padding:3px;flex-shrink:0}',
'.study-mode button{border:0;background:transparent;padding:8px 13px;border-radius:99px;font-size:13px;font-weight:650;color:#77746d;cursor:pointer}',
'.study-mode button[aria-pressed="true"]{background:#fff;color:#1f1f1c;box-shadow:0 1px 6px #0001}',
'#study-root{display:none}body.study-active #study-root{display:block}',
'body.study-active .panel.active{display:none!important}',
'body.study-active[data-study-tab="topics"] #topics.panel.active{display:block!important}',
'body.study-active[data-study-tab="topics"] #study-root{display:none}',
'.study-wrap{max-width:750px;margin:0 auto 40px}',
'.study-meta{display:flex;justify-content:space-between;gap:10px;color:#77746d;font-size:12px;margin-bottom:10px}',
'.study-bar{height:4px;background:#e5e1d8;border-radius:99px;overflow:hidden;margin-bottom:16px}',
'.study-fill{height:100%;background:#8f929e}',
'.study-card{background:white;border:1px solid #e5e1d8;border-radius:18px;padding:24px;min-height:290px;box-shadow:0 10px 30px #1919140f;overflow-wrap:anywhere;touch-action:pan-y}',
'.study-group{font-size:12px;color:#77746d;margin-bottom:10px}',
'.study-title{font-size:21px;font-weight:750;line-height:1.4;margin:0 0 18px}',
'.study-main .sentence,.study-main .static-connector-expression{font-size:19px;line-height:1.85}',
'.study-main .rule{font-size:18px;line-height:1.8;color:#1f1f1c}',
'.study-main .assembly{margin-top:17px}',
'.study-main .verb,.study-example .verb{background:var(--blue-soft);text-decoration:none!important}',
'.study-main .link,.study-main .verb,.study-example .link,.study-example .verb{box-decoration-break:clone;-webkit-box-decoration-break:clone}',
'.study-example-box{border-top:1px solid #e5e1d8;margin-top:24px;padding-top:14px}',
'.study-example-head{display:flex;justify-content:space-between;align-items:center;color:#77746d;font-size:12px;margin-bottom:10px}',
'.study-example-head button{background:#faf9f6;border:1px solid #e5e1d8;border-radius:9px;padding:7px 11px;color:#55514a;font-size:12px;cursor:pointer}',
'.study-example,.study-example .mini{font-size:16px;line-height:1.8;color:#55514a;margin:0}',
'.study-actions{display:flex;gap:12px;margin-top:16px}',
'.study-actions button{flex:1;min-height:46px;border:1px solid #e5e1d8;border-radius:12px;background:#fff;font-size:15px;font-weight:650;cursor:pointer}',
'.study-actions button:disabled{opacity:.35;cursor:default}',
'.study-hint{text-align:center;font-size:12px;color:#77746d;margin-top:10px}',
'@media(max-width:620px){.topbar{flex-wrap:wrap;row-gap:8px}.topbar .legend{flex:1 1 100%;order:3;font-size:11px}.study-mode{order:2}.study-card{padding:20px 17px;border-radius:15px}.study-title{font-size:20px}.study-main .sentence,.study-main .static-connector-expression{font-size:18px}.study-main .rule{font-size:17px}}'
].join('\n');document.head.appendChild(css);

css.textContent += [
 '.essay-subtabs{display:none;align-items:center;gap:5px;margin:0 auto 14px;padding:3px;background:#ebe8e0;border-radius:12px;width:max-content;max-width:100%}',
 'body[data-study-tab="essay"] .essay-subtabs{display:flex}',
 '.essay-subtabs button{border:0;background:transparent;color:#77746d;padding:9px 18px;font-size:14px;border-radius:9px;cursor:pointer}',
 '.essay-subtabs button[aria-selected="true"]{background:#fff;color:#1f1f1c;font-weight:700;box-shadow:0 1px 5px #0001}',
 '#essay .card[hidden],#essay .grid>div[hidden]{display:none!important}',
 '#essay .grid.essay-only-one-column{grid-template-columns:minmax(0,1fr)}',
 '.study-body .study-collection{display:grid;gap:12px}',
 '.study-body .study-collection .connector-grid{grid-template-columns:minmax(0,1fr);gap:9px}',
 '.study-body .study-collection .connector{padding:12px}',
 '.study-body .study-collection .connector .key{font-size:14px}',
 '.study-body .study-collection .connector .rule{font-size:15px;line-height:1.7;color:#55514a}',
 '.study-body .study-collection .connector-groups{gap:16px}',
 '.study-body .study-collection .static-connectors-list{grid-template-columns:1fr}',
 '.study-body .study-collection .static-connector-expression{font-size:16px;line-height:1.7}',
 '.study-body .study-collection .function-grid{grid-template-columns:repeat(2,minmax(0,1fr))}',
 '.study-body .study-collection .pattern{border-top:1px solid var(--line);padding:14px 0}',
 '.study-body .study-collection .pattern:first-child{border-top:0;padding-top:0}',
 '.study-body .study-collection .pattern .use{font-size:14px;color:#625e57;font-weight:750;margin-bottom:7px}',
 '.study-body .study-collection .pattern .sentence{font-size:16px;line-height:1.85}',
 '.study-body .study-collection .pattern .mini{font-size:13px;line-height:1.6}',
 '.study-body .study-collection .table{width:100%}',
 '.study-body .study-collection .callout{font-size:13px}',
 '.study-body .study-collection .study-essay-template .pattern{padding:16px 0}'
].join('\n');

const switcher=document.createElement('div');switcher.className='study-mode';switcher.setAttribute('role','group');switcher.setAttribute('aria-label','显示方式');
switcher.innerHTML='<button type="button" data-study="list" aria-pressed="true">列表</button><button type="button" data-study="cards" aria-pressed="false">卡片</button>';
top.appendChild(switcher);
const root=document.createElement('div');root.id='study-root';
root.innerHTML='<div class="study-wrap"><div class="study-meta"><span id="study-section"></span><span id="study-index" aria-live="polite"></span></div><div class="study-bar"><div class="study-fill" id="study-fill"></div></div><article class="study-card" id="study-card"><div id="study-group" class="study-group"></div><h2 id="study-title" class="study-title"></h2><div id="study-main" class="study-main"></div><div class="study-example-box" id="study-extra"><div class="study-example-head"><span id="study-ex-label">原例句</span><button type="button" id="study-reveal">隐藏例句</button></div><div class="study-example" id="study-example"></div></div></article><div class="study-actions"><button type="button" id="study-prev">上一张</button><button type="button" id="study-next">下一张</button></div><div class="study-hint">左右轻扫可翻页 · 隐藏例句可练习回忆</div></div>';
nav.insertAdjacentElement('afterend',root);

const essayNav=document.createElement('div');essayNav.className='essay-subtabs';
essayNav.setAttribute('role','tablist');essayNav.setAttribute('aria-label','大作文内容分类');
essayNav.innerHTML='<button type="button" role="tab" data-essay-sub="patterns" aria-selected="true">句型</button><button type="button" role="tab" data-essay-sub="templates" aria-selected="false">作文模板</button>';
nav.insertAdjacentElement('afterend',essayNav);
function updateEssayList(){
 const essay=document.getElementById('essay');if(!essay)return;
 const grid=essay.querySelector(':scope > .grid');if(!grid)return;
 essay.querySelectorAll('.card').forEach(card=>{
 const heading=card.querySelector(':scope > .section-label')?.textContent.trim()||'';
 if(heading.startsWith('句型')||heading.includes('模板'))card.hidden=essaySub==='patterns'?heading.includes('模板'):heading.startsWith('句型');
 });
 const columns=[...grid.children].filter(c=>c.tagName==='DIV');
 columns.forEach(col=>{const cards=[...col.children].filter(c=>c.classList.contains('card'));col.hidden=cards.length>0&&cards.every(c=>c.hidden);});
 grid.classList.toggle('essay-only-one-column',columns.filter(c=>!c.hidden).length===1);
 essayNav.querySelectorAll('button').forEach(btn=>btn.setAttribute('aria-selected',String(btn.dataset.essaySub===essaySub)));
}
essayNav.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{essaySub=btn.dataset.essaySub;updateEssayList();render();}));

const el=id=>document.getElementById(id),ui={section:el('study-section'),index:el('study-index'),fill:el('study-fill'),card:el('study-card'),group:el('study-group'),title:el('study-title'),main:el('study-main'),extra:el('study-extra'),label:el('study-ex-label'),example:el('study-example'),reveal:el('study-reveal'),prev:el('study-prev'),next:el('study-next')};
const names={dynamic:'动态图',static:'静态图',process:'流程图',map:'地图题',essay:'大作文'};
let tab='dynamic',mode='list',essaySub='patterns';const indexMap=new Map(),exampleMap=new Map();
const deckKey=()=>tab==='essay'?tab+':'+essaySub:tab;
function groupOf(node){const card=node.closest('.card');if(!card)return '';
for(let n=node.previousElementSibling;n;n=n.previousElementSibling)if(n.classList.contains('section-label'))return n.textContent.trim();
return card.querySelector('.section-label')?.textContent.trim()||'';}
function deck(){
const panel=el(tab);if(!panel)return [];const cards=[];
panel.querySelectorAll('.card').forEach(card=>{
const heading=card.querySelector(':scope > .section-label')?.textContent.trim()||'';
const isEssayPatterns=heading.startsWith('句型');
const isEssayTemplate=heading.includes('模板');
if(tab==='essay'){
if(essaySub==='patterns'&&!isEssayPatterns)return;
if(essaySub==='templates'&&!isEssayTemplate)return;
}
const bundled=tab==='essay'&&essaySub==='templates' ||
Boolean(card.dataset.supplement||card.dataset.staticConnectors||
['两段变化怎么接','衔接词汇总','基础公式','高频被动动词','动词 / 名词 / 过去式','程度词','方位介词','开头 / 总览','开头 + 结尾模板'].some(t=>heading.includes(t)));
if(bundled){
 const content=document.createElement('div');
 content.className='study-collection'+(tab==='essay'?' study-essay-template':'');
 [...card.children].forEach(child=>{if(!child.classList.contains('section-label'))content.appendChild(child.cloneNode(true))});
 cards.push({group:tab==='essay'?'作文模板':heading,title:heading,main:content,assembly:null,example:null,note:null,id:deckKey()+'-group-'+cards.length});
 return;
}
const patterns=[...card.querySelectorAll(':scope > .pattern')];
patterns.forEach(pattern=>{
const main=pattern.querySelector(':scope > .sentence');
if(!main)return;
let nearest=pattern.previousElementSibling;
while(nearest&&!nearest.classList.contains('section-label'))nearest=nearest.previousElementSibling;
const title=pattern.querySelector(':scope > .use')?.textContent.trim()||nearest?.textContent.trim()||heading;
cards.push({group:heading,title,main,
 assembly:pattern.querySelector(':scope > .assembly'),
 example:pattern.querySelector(':scope > .mini'),
 note:pattern.querySelector(':scope > .note'),
 id:deckKey()+'-pattern-'+cards.length});
});
if(!patterns.length&&heading){
const content=document.createElement('div');content.className='study-collection';
[...card.children].forEach(child=>{if(!child.classList.contains('section-label'))content.appendChild(child.cloneNode(true))});
cards.push({group:heading,title:heading,main:content,assembly:null,example:null,note:null,id:deckKey()+'-group-'+cards.length});
}
});
return cards;
}
function clone(into,source){if(source)into.appendChild(source.cloneNode(true));}
function render(){
if(mode!=='cards'||tab==='topics')return;
const cards=deck(),n=cards.length,pos=Math.max(0,Math.min(indexMap.get(deckKey())||0,n-1));indexMap.set(deckKey(),pos);
ui.section.textContent=names[tab]||'';ui.index.textContent=n?(pos+1)+' / '+n:'0 / 0';
ui.fill.style.width=n?((pos+1)/n*100)+'%':'0%';ui.prev.disabled=pos===0;ui.next.disabled=pos>=n-1;
ui.main.replaceChildren();ui.example.replaceChildren();
if(!n){ui.group.textContent='';ui.title.textContent='暂无卡片';ui.extra.hidden=true;return;}
const item=cards[pos];ui.group.textContent=item.group||names[tab];ui.title.textContent=item.title;clone(ui.main,item.main);clone(ui.main,item.assembly);
const example=item.example||item.note;ui.extra.hidden=!example;
if(example){ui.label.textContent=item.example?'原例句':'提示';clone(ui.example,example);const visible=exampleMap.get(item.id)!==false;ui.example.hidden=!visible;ui.reveal.textContent=visible?'隐藏例句':'显示例句';ui.reveal.setAttribute('aria-expanded',String(visible));}}
function changeMode(next){mode=next;document.body.classList.toggle('study-active',mode==='cards');switcher.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.study===mode)));if(mode==='cards')render();}
switcher.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>changeMode(b.dataset.study)));
function move(n){if(mode!=='cards'||tab==='topics')return;const current=indexMap.get(deckKey())||0,next=Math.max(0,Math.min(deck().length-1,current+n));if(next===current)return;indexMap.set(deckKey(),next);render();root.scrollIntoView({block:'start',behavior:'auto'});}
ui.prev.addEventListener('click',()=>move(-1));ui.next.addEventListener('click',()=>move(1));
ui.reveal.addEventListener('click',()=>{const item=deck()[indexMap.get(deckKey())||0];if(!item)return;exampleMap.set(item.id,exampleMap.get(item.id)===false);render();});
nav.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.tab||'dynamic';document.body.dataset.studyTab=tab;render();}));
document.body.dataset.studyTab=tab;
updateEssayList();
let x=0,y=0,tracking=false;
ui.card.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;x=e.touches[0].clientX;y=e.touches[0].clientY;tracking=true;},{passive:true});
ui.card.addEventListener('touchend',e=>{if(!tracking||!e.changedTouches.length)return;tracking=false;const dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx<0?1:-1);},{passive:true});
document.addEventListener('keydown',e=>{if(mode!=='cards'||tab==='topics'||e.metaKey||e.ctrlKey||e.altKey)return;if(e.target.closest('input,textarea,select,button,[contenteditable="true"]'))return;if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1);});
})();