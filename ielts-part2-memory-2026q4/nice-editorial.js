/* Independent editorial skin: no changes to IELTS answers, bold storage or audio. */
(() => {
  'use strict';
  const body = document.body;
  if (!body.classList.contains('p2-page')) return;
  const main = document.querySelector('.p2-page .main');
  const sidebar = document.getElementById('topicSidebar');
  const topics = document.getElementById('topics');
  if (!main || !sidebar || !topics) return;

  const SKIN_KEY = 'p2-2026q4-theme-skin';
  const getSaved = () => { try { return localStorage.getItem(SKIN_KEY); } catch (_) { return null; } };
  const saveSkin = name => { try { localStorage.setItem(SKIN_KEY, name); } catch (_) {} };
  const urlSkin = new URLSearchParams(location.search).get('skin');
  const initialSkin = urlSkin === 'nice' ? 'nice' : (urlSkin === 'classic' ? 'classic' : getSaved() === 'nice' ? 'nice' : 'classic');
  const sessionSeed = (() => {
    try { const data = new Uint32Array(1); crypto.getRandomValues(data); return data[0]; }
    catch (_) { return (Math.random() * 4294967295) >>> 0; }
  })();

  const masthead = document.createElement('header');
  masthead.className = 'nice-masthead';
  masthead.setAttribute('aria-label', '杂志皮肤导航');
  masthead.innerHTML =
    '<div class="nice-top-left">' +
      '<button type="button" class="nice-menu-button" id="niceMenuToggle" aria-expanded="false" aria-controls="topicSidebar">' +
        '<span class="nice-hamburger" aria-hidden="true"></span><span>Menu / 目录</span>' +
      '</button><span class="nice-issue">INSPIRING STUDY / ISSUE 02</span>' +
    '</div>' +
    '<div class="nice-wordmark" aria-label="It’s Nice That 风格练习页">It’s Nice That</div>' +
    '<div class="nice-top-right"><span class="nice-issue">IELTS SPEAKING / 2026</span>' +
      '<button type="button" class="nice-style-button" id="niceStyleButton">Appearance / 外观</button></div>';
  main.prepend(masthead);

  const hero = document.createElement('section');
  hero.className = 'nice-hero variant-0';
  hero.setAttribute('aria-label', '编辑封面');
  hero.innerHTML =
    '<div class="nice-hero-copy">' +
      '<div class="nice-kicker"><span class="nice-category" id="niceCategory">STORIES</span>' +
      '<span id="niceIssueNum">SPEAKING PART 02</span></div>' +
      '<h1 class="nice-hero-title" id="niceHeroHeadline"></h1>' +
      '<div class="nice-hero-sub" id="niceHeroSubline"></div>' +
      '<div class="nice-hero-meta"><span id="niceArticleMeta">IELTS / 2026 Q4</span>' +
      '<span>ILLUSTRATED STUDY EDITION</span></div>' +
    '</div>' +
    '<div class="nice-visuals">' +
      '<img class="nice-main-art" id="niceMainArt" alt="抽象编辑艺术封面，每次刷新呈现不同组合" decoding="async">' +
      '<img class="nice-small-art" id="niceSmallArt" alt="另一幅随机组合的抽象插画" decoding="async">' +
      '<div class="nice-visual-caption"><span>ILLUSTRATION / STUDY EDITION</span><span>2026</span></div>' +
    '</div>';
  masthead.after(hero);

  const backdrop = document.createElement('div');
  backdrop.className = 'nice-drawer-backdrop';
  backdrop.setAttribute('aria-hidden','true');
  body.append(backdrop);
  const closeButton = document.createElement('button');
  closeButton.className = 'nice-close-drawer';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', '关闭目录');
  closeButton.textContent = '×';
  sidebar.prepend(closeButton);

  const context = document.createElement('div');
  context.className = 'nice-skin-menu';
  context.setAttribute('role','menu');
  context.setAttribute('aria-label','切换网页皮肤');
  context.innerHTML = '<span class="nice-context-title">APPEARANCE / 皮肤</span>' +
    '<button type="button" role="menuitemradio" data-skin="nice">It’s Nice That 风格</button>' +
    '<button type="button" role="menuitemradio" data-skin="classic">原始学习皮肤</button>';
  body.append(context);

  const access = document.createElement('button');
  access.type = 'button';
  access.className = 'nice-skin-access';
  access.textContent = '✦ 皮肤';
  access.setAttribute('aria-label','打开皮肤切换菜单');
  body.append(access);

  const menuToggle = document.getElementById('niceMenuToggle');
  const styleButton = document.getElementById('niceStyleButton');
  let details = null;
  let lastTopic = '';

  function closeNav() {
    body.classList.remove('nice-nav-open');
    menuToggle.setAttribute('aria-expanded','false');
  }
  function openNav() {
    body.classList.add('nice-nav-open');
    menuToggle.setAttribute('aria-expanded','true');
    closeButton.focus({preventScroll:true});
  }
  menuToggle.addEventListener('click', () => {
    if (body.classList.contains('nice-nav-open')) closeNav();
    else openNav();
  });
  closeButton.addEventListener('click', closeNav);
  backdrop.addEventListener('click', closeNav);
  sidebar.addEventListener('click', event => {
    if (event.target.closest('.nav-btn, .region-tab, .site-tabs a')) closeNav();
  });

  function arrangeQuestionMenu(active) {
    if (active && !details) {
      details = document.createElement('details');
      details.className = 'nice-questions';
      const summary = document.createElement('summary');
      summary.id = 'niceQuestionSummary';
      summary.textContent = '本组题目 / CHOOSE A QUESTION';
      topics.before(details);
      details.append(summary, topics);
      details.addEventListener('click', event => {
        if (event.target.closest('.topic')) details.open = false;
      });
    } else if (!active && details) {
      details.before(topics);
      details.remove();
      details = null;
    }
  }

  function closeContext() {
    context.classList.remove('is-open');
    context.style.left = '';
    context.style.top = '';
  }
  function openContext(x,y) {
    closeNav();
    context.querySelectorAll('[data-skin]').forEach(btn => {
      const selected = btn.dataset.skin === (body.classList.contains('nice-skin') ? 'nice' : 'classic');
      btn.setAttribute('data-selected',String(selected));
      btn.setAttribute('aria-checked',String(selected));
    });
    context.classList.add('is-open');
    const width = context.offsetWidth || 220, height = context.offsetHeight || 120;
    context.style.left = Math.max(8,Math.min(x,window.innerWidth-width-10))+'px';
    context.style.top = Math.max(8,Math.min(y,window.innerHeight-height-10))+'px';
  }

  function applySkin(name) {
    const isNice = name === 'nice';
    arrangeQuestionMenu(isNice);
    body.classList.toggle('nice-skin',isNice);
    closeContext();
    closeNav();
    saveSkin(isNice ? 'nice' : 'classic');
    lastTopic = '';
    if (isNice) refreshCover();
    else if (typeof render === 'function') render();
  }

  context.addEventListener('click', event => {
    const btn = event.target.closest('button[data-skin]');
    if (!btn) return;
    applySkin(btn.dataset.skin);
  });
  document.addEventListener('contextmenu', event => {
    if (event.target.closest('input,select,textarea,[contenteditable="true"],a')) return;
    event.preventDefault();
    openContext(event.clientX,event.clientY);
  });
  styleButton.addEventListener('click', event => {
    const box = event.currentTarget.getBoundingClientRect();
    openContext(box.right-215,box.bottom+8);
  });
  access.addEventListener('click', event => {
    const box = event.currentTarget.getBoundingClientRect();
    openContext(box.right-215,box.top-126);
  });
  document.addEventListener('pointerdown', event => {
    if (!context.contains(event.target) && event.target!==styleButton && event.target!==access) closeContext();
  });
  document.addEventListener('keydown', event => {
    if (event.key==='Escape') { closeContext(); closeNav(); }
  });
  window.addEventListener('resize', closeContext);
  window.addEventListener('scroll', closeContext, {passive:true});

  const palettes = [
    ['#f5ce30','#ef5334','#242e88','#f6e9d1','#0e171c'],
    ['#daecfc','#ff532d','#4646ca','#fbe4ab','#151515'],
    ['#f6b2ce','#f2f0d1','#2f6d47','#ea622f','#1c1c1c'],
    ['#c9e9ff','#27209c','#faad43','#e85066','#141518'],
    ['#e8d5fa','#5628c8','#faca15','#ef6d41','#1b1932'],
    ['#f7e9b5','#3077e0','#f581ba','#ee5232','#201c20'],
    ['#b7eac4','#ef543d','#f1d539','#4e4cc6','#172021'],
    ['#f4e9dc','#0c766d','#fe6793','#d9adff','#1f1a28']
  ];
  function hashText(str) {
    let h=2166136261;
    for (let i=0;i<str.length;i++) {h^=str.charCodeAt(i);h=Math.imul(h,16777619);}
    return h>>>0;
  }
  function random(seed) {
    let state=seed>>>0;
    return () => {
      state=(state+0x6D2B79F5)>>>0;
      let t=state;
      t=Math.imul(t^(t>>>15),t|1);
      t^=t+Math.imul(t^(t>>>7),t|61);
      return ((t^(t>>>14))>>>0)/4294967296;
    };
  }
  function artwork(seed, portrait) {
    const rand = random(seed);
    const W=1200,H=880;
    const p=palettes[Math.floor(rand()*palettes.length)];
    const mode=Math.floor(rand()*6);
    const int=(lo,hi)=>Math.round(lo+rand()*(hi-lo));
    let shapes='',detail='';
    const base=p[0],a=p[1],b=p[2],c=p[3],ink=p[4];
    const ellipse=(x,y,rx,ry,colour,rotate=0,stroke='none') =>
      '<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+colour+'" stroke="'+stroke+'" stroke-width="5" transform="rotate('+rotate+' '+x+' '+y+')"/>';
    const rect=(x,y,w,h,col,rotate=0) =>
      '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+col+'" transform="rotate('+rotate+' '+(x+w/2)+' '+(y+h/2)+')"/>';
    if (mode===0) {
      shapes+=ellipse(int(500,800),int(320,450),410,410,b,int(-25,25));
      shapes+=ellipse(int(440,600),int(330,550),285,285,c);
      shapes+=ellipse(int(540,760),int(350,500),130,310,a,int(-70,70));
      for(let i=0;i<18;i++) shapes+=ellipse(int(20,1180),int(25,850),int(4,18),int(4,19),i%3===0?ink:i%3===1?a:c);
      detail+='<path d="M-60 770 Q550 120 1220 610" fill="none" stroke="'+ink+'" stroke-width="20"/>';
    } else if (mode===1) {
      for (let i=0;i<7;i++) {
        let x=int(-230,1050),y=int(-210,720),w=int(180,510),h=int(130,500);
        shapes+=rect(x,y,w,h,[a,b,c,ink][i%4],int(-65,65));
      }
      shapes+=ellipse(560,450,240,315,base,23);
      shapes+=ellipse(560,450,100,135,ink,-18);
      detail+='<text x="45" y="780" fill="'+c+'" font-family="Arial Black,Impact,sans-serif" font-size="300" font-weight="900" opacity=".91">02</text>';
    } else if (mode===2) {
      for(let i=0;i<7;i++){
        const cy=70+i*122;
        shapes+='<path d="M-70 '+cy+' C180 '+(cy-210)+' 370 '+(cy+170)+' 610 '+cy+' S1000 '+(cy-170)+' 1300 '+(cy+50)+'" fill="none" stroke="'+[a,b,c,ink][i%4]+'" stroke-width="'+int(32,106)+'" stroke-linecap="round"/>';
      }
      shapes+=ellipse(700,420,220,220,base);
      shapes+=ellipse(700,420,125,125,ink);
      shapes+=ellipse(700,420,65,65,c);
    } else if (mode===3) {
      for(let j=0;j<4;j++){
        const cx=145+j*310,cy=int(280,610);
        for(let i=0;i<7;i++){
          const angle=Math.round(i*360/7);
          shapes+=ellipse(cx,cy-112,75,158,[a,b,c][j%3],angle);
          shapes=shapes.replace(/$/, '');
          // Move each petal around its own flower centre.
          const start=shapes.lastIndexOf('<ellipse');
          const petal=shapes.slice(start);
          shapes=shapes.slice(0,start)+petal.replace('transform="rotate('+angle+' '+cx+' '+(cy-112)+')"',
            'transform="rotate('+angle+' '+cx+' '+cy+')"');
        }
        shapes+=ellipse(cx,cy,65,65,ink);
      }
      detail+=rect(-80,40,1370,25,ink,-7);
    } else if (mode===4) {
      shapes+='<path d="M-100 210 Q400 -100 1240 140 L1330 750 Q650 1070 -100 710Z" fill="'+b+'"/>';
      for(let i=0;i<9;i++){
        const x=int(50,1150),y=int(80,850);
        shapes+=ellipse(x,y,int(40,180),int(25,160),[base,a,c,ink][i%4],int(-80,80));
      }
      shapes+='<path d="M120 90 L1150 810" stroke="'+base+'" stroke-width="27"/>';
      detail+='<path d="M-30 620 Q560 200 1240 640" stroke="'+ink+'" stroke-width="10" fill="none"/>';
    } else {
      const letters=['A','&amp;','S','N','?'];
      shapes+='<text x="'+int(-60,110)+'" y="800" font-family="Arial Black,Impact,sans-serif" font-size="'+int(800,1050)+'" font-weight="900" fill="'+b+'">'+letters[int(0,letters.length-1)]+'</text>';
      shapes+=rect(int(50,200),int(70,170),1000,int(70,130),a,int(-32,-12));
      shapes+=rect(int(200,350),int(550,680),830,int(60,95),ink,int(8,24));
      for(let i=0;i<25;i++) shapes+=ellipse(int(0,1200),int(0,880),int(3,16),int(3,16),i%2?a:c);
      detail+='<path d="M1030 40 L1100 110 L1170 40" stroke="'+c+'" stroke-width="25" fill="none"/>';
    }
    const grid=rand()>.55 ? '<g opacity=".12" stroke="'+ink+'" stroke-width="1">'+
      Array.from({length:16},(_,i)=>'<path d="M'+(i*80)+' 0 V880"/>').join('')+
      Array.from({length:12},(_,i)=>'<path d="M0 '+(i*80)+' H1200"/>').join('')+'</g>' : '';
    const label=portrait?'FORM / 02':'THE STORIES / 2026';
    const markup='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'">'+
      '<defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".52" numOctaves="3" seed="'+int(1,20)+'"/></filter></defs>'+
      '<rect width="'+W+'" height="'+H+'" fill="'+base+'"/>'+grid+
      '<g>'+shapes+'</g>'+detail+
      '<rect width="'+W+'" height="'+H+'" fill="#000" filter="url(#grain)" opacity=".065"/>'+
      '<path d="M42 38 H180 M42 38 V175 M1160 845 H1020 M1160 845 V710" stroke="'+ink+'" stroke-width="3" fill="none"/>'+
      '<text x="44" y="833" fill="'+ink+'" font-family="Arial, sans-serif" font-size="22" font-weight="bold" letter-spacing="4">'+label+'</text>'+
      '</svg>';
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(markup);
  }
  function titleFromCue(question) {
    const en=String(question||'').replace(/^Describe\s+/i,'').replace(/[.?!]\s*$/,'').trim();
    return en ? en.charAt(0).toUpperCase()+en.slice(1) : 'Every story starts somewhere';
  }
  function refreshCover() {
    if (!body.classList.contains('nice-skin')) return;
    updatePager();
    const selected=document.querySelector('#topics .topic.on b')?.textContent?.trim();
    const id=selected || (typeof selectedQ!=='undefined' ? selectedQ : '');
    if (!id || lastTopic===id) return;
    const g=(typeof GROUPS!=='undefined' ? GROUPS : []).find(item=>item.topics.some(t=>t.q===id));
    const t=g?.topics?.find(item=>item.q===id);
    if (!t) return;
    lastTopic=id;
    const number=Number(id.replace(/\D/g,''))||1;
    const seed=(sessionSeed^hashText(id+'@'+g.id))>>>0;
    const variant=seed%3;
    const subject=titleFromCue(t.en||t.zh);
    const lower=subject.charAt(0).toLowerCase()+subject.slice(1);
    const headline=variant===0 ? subject : variant===1 ? 'A closer look at '+lower : 'The story behind '+lower;
    hero.className='nice-hero variant-'+variant;
    document.getElementById('niceHeroHeadline').textContent=headline;
    document.getElementById('niceHeroSubline').textContent=g.title;
    document.getElementById('niceCategory').textContent=variant===0?'PROJECTS + STORIES':variant===1?'INSIGHTS + STORIES':'THE CREATIVE ISSUE';
    document.getElementById('niceIssueNum').textContent='IELTS / SPEAKING / PART 02';
    document.getElementById('niceArticleMeta').textContent=id+' / '+number.toString().padStart(2,'0')+' OF 58';
    document.getElementById('niceMainArt').src=artwork(seed, false);
    document.getElementById('niceSmallArt').src=artwork((seed+0x9e3779b9)>>>0, true);
    if (details) document.getElementById('niceQuestionSummary').textContent='本组题目 / '+id+' · '+g.topics.length+' 道题';
    document.title=headline+' | IELTS Part 2 · It’s Nice That 风格';
  }


  // Editorial mode has genuine question-by-question pagination.
  // Classic mode retains the original group navigation unchanged.
  const pagerPrev=document.getElementById('prevGroup');
  const pagerNext=document.getElementById('nextGroup');
  const pagerInfo=document.getElementById('groupProgress');
  const questionOrder=typeof GROUPS!=='undefined'
    ? GROUPS.flatMap(g=>g.topics.map(t=>({g,t})))
        .sort((a,b)=>Number(a.t.q.slice(1))-Number(b.t.q.slice(1)))
    : [];
  function updatePager() {
    if (!body.classList.contains('nice-skin')) return;
    const q=document.querySelector('#topics .topic.on b')?.textContent?.trim() || (typeof selectedQ!=='undefined'?selectedQ:'');
    const idx=questionOrder.findIndex(x=>x.t.q===q);
    if(idx<0)return;
    pagerPrev.disabled=idx===0;
    pagerNext.disabled=idx===questionOrder.length-1;
    pagerPrev.title=idx>0?'上一题：'+questionOrder[idx-1].t.zh:'已是第一题';
    pagerNext.title=idx<questionOrder.length-1?'下一题：'+questionOrder[idx+1].t.zh:'已是最后一题';
    pagerInfo.textContent=(idx+1)+' / '+questionOrder.length+' 题';
  }
  function handlePager(event,step) {
    if (!body.classList.contains('nice-skin')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const idx=questionOrder.findIndex(x=>x.t.q===selectedQ);
    const target=questionOrder[idx+step];
    if(!target)return;
    const x=window.scrollX,y=window.scrollY;
    selectedGroup=target.g.id;selectedQ=target.t.q;
    document.getElementById('search').value='';
    save();render();updatePager();
    window.scrollTo(x,y);
    requestAnimationFrame(()=>window.scrollTo(x,y));
  }
  if(pagerPrev&&pagerNext){
    pagerPrev.addEventListener('click',e=>handlePager(e,-1),true);
    pagerNext.addEventListener('click',e=>handlePager(e,1),true);
  }

  const observedTitle = document.getElementById('title');
  const observedPrompt = document.getElementById('prompt');
  let updatePending=false;
  function requestCoverUpdate() {
    if (updatePending) return;
    updatePending=true;
    requestAnimationFrame(() => { updatePending=false;refreshCover(); });
  }
  if (observedTitle) new MutationObserver(requestCoverUpdate).observe(observedTitle,{childList:true,characterData:true,subtree:true});
  if (observedPrompt) new MutationObserver(requestCoverUpdate).observe(observedPrompt,{childList:true,characterData:true,subtree:true});
  applySkin(initialSkin);
  window.P2NiceSkin = {get:()=>body.classList.contains('nice-skin')?'nice':'classic',set:applySkin,refresh:()=>{lastTopic='';refreshCover();}};
})();
