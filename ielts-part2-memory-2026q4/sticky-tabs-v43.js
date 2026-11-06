/* Compact navigation on narrow layouts: the desktop sidebar is already sticky,
   but at <=850px it becomes a normal document section and scrolls out of view. */
(() => {
  const sidebar=document.getElementById('topicSidebar');
  const original=sidebar?.querySelector('.site-tabs');
  if(!sidebar||!original)return;
  const bar=document.createElement('div');
  bar.id='speakingStickyMini';
  bar.className='speaking-sticky-mini';
  bar.hidden=true;
  const name=document.createElement('span');
  name.className='speaking-sticky-name';
  name.textContent='IELTS Speaking';
  const nav=original.cloneNode(true);
  nav.classList.add('sticky-mini-tabs');
  bar.append(name,nav);
  document.body.prepend(bar);
  let pending=false;
  function update(){
    pending=false;
    const shouldShow=window.matchMedia('(max-width:850px)').matches &&
      original.getBoundingClientRect().bottom < 0 &&
      !document.querySelector('.app')?.classList.contains('sidebar-collapsed');
    bar.hidden=!shouldShow;
  }
  function schedule(){
    if(!pending){pending=true;requestAnimationFrame(update);}
  }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  document.getElementById('sidebarCollapse')?.addEventListener('click',schedule);
  document.getElementById('sidebarExpand')?.addEventListener('click',schedule);
  schedule();
})();