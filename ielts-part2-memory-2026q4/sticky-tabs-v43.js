/* Contextual sticky header: current story + its Cue Card switches only.
   The global Part 1/2/3 navigation belongs in the sidebar, not at page top. */
(() => {
  const title=document.getElementById('title');
  const topics=document.getElementById('topics');
  const card=document.getElementById('card');
  const app=document.querySelector('.app');
  if(!title||!topics||!card||!app)return;

  const bar=document.createElement('div');
  bar.id='storyStickyMini';
  bar.className='story-sticky-mini';
  bar.setAttribute('aria-label','当前故事组及题目切换');
  bar.hidden=true;
  const heading=document.createElement('div');
  heading.className='story-sticky-heading';
  const switches=document.createElement('div');
  switches.className='story-sticky-switches';
  switches.setAttribute('role','group');
  switches.setAttribute('aria-label','切换当前故事组内的题目');
  bar.append(heading,switches);
  document.body.prepend(bar);

  function sync(){
    heading.textContent=title.textContent.trim();
    const items=[...topics.querySelectorAll('button.topic')];
    const fragment=document.createDocumentFragment();
    for(const source of items){
      const q=source.querySelector('b')?.textContent.trim();
      if(!q)continue;
      const control=document.createElement('button');
      const active=source.classList.contains('on');
      control.type='button';
      control.dataset.q=q;
      control.className='story-sticky-topic'+(active?' on':'');
      control.textContent=source.textContent.trim();
      control.setAttribute('aria-pressed',String(active));
      fragment.append(control);
    }
    switches.replaceChildren(fragment);
    const selected=switches.querySelector('.on');
    if(selected && !bar.hidden){
      const left=selected.offsetLeft-switches.offsetLeft;
      if(left<switches.scrollLeft) switches.scrollLeft=left;
      else if(left+selected.offsetWidth>switches.scrollLeft+switches.clientWidth)
        switches.scrollLeft=left+selected.offsetWidth-switches.clientWidth;
    }
  }
  bar.addEventListener('click',e=>{
    const control=e.target.closest('button[data-q]');
    if(!control||!bar.contains(control))return;
    const q=control.dataset.q;
    const target=[...topics.querySelectorAll('button.topic')]
      .find(b=>b.querySelector('b')?.textContent.trim()===q);
    if(!target)return;
    target.click(); // Use the existing topic selection and saved bold state.
    requestAnimationFrame(()=>{
      sync();
      const current=[...switches.querySelectorAll('button')].find(b=>b.dataset.q===q);
      current?.focus({preventScroll:true});
      schedule();
    });
  });

  let pending=false;
  function update(){
    pending=false;
    const narrow=window.matchMedia('(max-width:850px)').matches;
    const originalGone=topics.getBoundingClientRect().bottom<=0;
    const cardVisible=card.getBoundingClientRect().bottom>64;
    const mainland=!app.classList.contains('foreign-mode');
    bar.hidden=!(narrow&&originalGone&&cardVisible&&mainland&&switches.children.length);
  }
  function schedule(){
    if(!pending){pending=true;requestAnimationFrame(update);}
  }
  new MutationObserver(()=>{sync();schedule();})
    .observe(topics,{childList:true,subtree:true,characterData:true});
  new MutationObserver(()=>{sync();schedule();})
    .observe(title,{childList:true,subtree:true,characterData:true});
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  document.getElementById('regionMain')?.addEventListener('click',schedule);
  document.getElementById('regionForeign')?.addEventListener('click',schedule);
  sync();
  schedule();
})();