/* Reversible It's Nice That-like editorial appearance for Writing Review. */
(() => {
 'use strict';
 const body=document.body;
 const wrap=document.querySelector('.wrap');
 const topbar=wrap?.querySelector('.topbar');
 if(!wrap||!topbar||document.querySelector('.writing-masthead'))return;
 const KEY='ielts-writing-review-theme-skin';
 function readSetting(){try{return localStorage.getItem(KEY)}catch(_){return null}}
 function storeSetting(value){try{localStorage.setItem(KEY,value)}catch(_){}}
 const fromURL=new URLSearchParams(location.search).get('skin');
 const starting=fromURL==='classic'?'classic':fromURL==='nice'?'nice':readSetting()==='classic'?'classic':'nice';

 const masthead=document.createElement('header');
 masthead.className='writing-masthead';
 masthead.setAttribute('aria-label','Writing Review 主题导航');
 masthead.innerHTML=
  '<span class="writing-mast-left">IELTS / WRITING NOTES</span>'+
  '<strong class="writing-mast-wordmark">It’s Nice That</strong>'+
  '<div class="writing-mast-actions"><button type="button" class="writing-appearance" aria-haspopup="menu" aria-expanded="false">Appearance / 外观</button></div>';
 wrap.insertBefore(masthead,topbar);
 const edition=document.createElement('div');
 edition.className='writing-edition-line';
 edition.innerHTML='<span>WRITING STUDY / 2026</span><span class="writing-edition-accent">TEMPLATES · LANGUAGE · IDEAS</span>';
 masthead.insertAdjacentElement('afterend',edition);

 const appearance=masthead.querySelector('.writing-appearance');
 const menu=document.createElement('div');
 menu.className='writing-skin-menu';
 menu.setAttribute('role','menu');
 menu.setAttribute('aria-label','切换网页皮肤');
 menu.innerHTML='<span class="writing-context-title">APPEARANCE / 皮肤</span>'+
  '<button type="button" role="menuitemradio" data-skin="nice">It’s Nice That 风格</button>'+
  '<button type="button" role="menuitemradio" data-skin="classic">原始学习皮肤</button>';
 body.appendChild(menu);

 const fallback=document.createElement('button');
 fallback.type='button';fallback.className='writing-skin-access';
 fallback.textContent='✦ 皮肤';fallback.setAttribute('aria-label','打开皮肤切换菜单');
 fallback.setAttribute('aria-haspopup','menu');
 fallback.setAttribute('aria-expanded','false');
 body.appendChild(fallback);

 let skin=starting;
 const topicFrame=document.querySelector('#topics iframe');
 const boundDocs=new WeakSet();
 const themeMeta=document.querySelector('meta[name="theme-color"]');

 function closeMenu(){
  menu.classList.remove('is-open');
  appearance.setAttribute('aria-expanded','false');
  fallback.setAttribute('aria-expanded','false');
 }
 function openMenu(x,y){
  menu.querySelectorAll('[data-skin]').forEach(b=>{
   const selected=b.dataset.skin===skin;
   b.dataset.selected=String(selected);
   b.setAttribute('aria-checked',String(selected));
  });
  menu.classList.add('is-open');
  appearance.setAttribute('aria-expanded','true');
  fallback.setAttribute('aria-expanded','true');
  const width=menu.offsetWidth||220,height=menu.offsetHeight||130;
  menu.style.left=Math.max(8,Math.min(x,innerWidth-width-8))+'px';
  menu.style.top=Math.max(8,Math.min(y,innerHeight-height-8))+'px';
 }
 function syncFrame(){
  if(!topicFrame)return;
  try {
   const doc=topicFrame.contentDocument;
   if(!doc?.body)return;
   doc.body.classList.toggle('writing-nice',skin==='nice');
   doc.body.classList.toggle('writing-classic',skin==='classic');
   if(boundDocs.has(doc))return;
   boundDocs.add(doc);
   doc.addEventListener('contextmenu',event=>{
    if(event.target.closest('input,textarea,select,a,[contenteditable="true"]'))return;
    event.preventDefault();
    const rect=topicFrame.getBoundingClientRect();
    openMenu(rect.left+event.clientX,rect.top+event.clientY);
   });
   doc.addEventListener('scroll',closeMenu,{passive:true,capture:true});
  } catch(_){}
 }
 function setSkin(value,persist){
  skin=value==='classic'?'classic':'nice';
  body.classList.toggle('writing-nice',skin==='nice');
  body.classList.toggle('writing-classic',skin==='classic');
  if(persist)storeSetting(skin);
  if(themeMeta)themeMeta.setAttribute('content',skin==='nice'?'#ffffff':'#f6f5f1');
  closeMenu();
  syncFrame();
 }
 menu.addEventListener('click',event=>{
  const target=event.target.closest('button[data-skin]');
  if(!target)return;
  setSkin(target.dataset.skin,true);
 });
 document.addEventListener('contextmenu',event=>{
  if(event.target.closest('input,textarea,select,a,[contenteditable="true"]'))return;
  event.preventDefault();
  openMenu(event.clientX,event.clientY);
 });
 appearance.addEventListener('click',()=>{
  const box=appearance.getBoundingClientRect();
  openMenu(box.right-220,box.bottom+8);
 });
 fallback.addEventListener('click',()=>{
  const box=fallback.getBoundingClientRect();
  openMenu(box.right-220,box.top-136);
 });
 document.addEventListener('pointerdown',event=>{
  if(!menu.contains(event.target)&&event.target!==appearance&&event.target!==fallback)closeMenu();
 });
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape')closeMenu();
  if(event.shiftKey&&event.key==='F10'&&!event.target.closest('input,textarea,select')){
   event.preventDefault();
   openMenu(Math.min(innerWidth/2,innerWidth-220),Math.min(innerHeight/2,innerHeight-150));
  }
 });
 window.addEventListener('resize',closeMenu);
 window.addEventListener('scroll',closeMenu,{passive:true});
 if(topicFrame)topicFrame.addEventListener('load',syncFrame);
 setSkin(starting,false);
})();