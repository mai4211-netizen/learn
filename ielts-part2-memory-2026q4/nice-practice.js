/* Part 1 and Part 3: reversible editorial skin; the source practice app owns all study state. */
(() => {
  'use strict';
  const body = document.body;
  if (!body.classList.contains('practice-page')) return;
  const shell = document.querySelector('.shell');
  const layout = document.querySelector('.practice-page .layout');
  const sidebar = document.getElementById('sidebar');
  const topicList = document.getElementById('topicnav');
  const contentArea = document.getElementById('contentArea');
  if (!shell || !layout || !sidebar || !topicList || !contentArea) return;
  // This key and the values are identical to the Part 2 editorial skin.
  const STORAGE_KEY = 'p2-2026q4-theme-skin';
  const safeGet = () => { try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; } };
  const safeSet = value => { try { localStorage.setItem(STORAGE_KEY,value); } catch (_) {} };
  const params = new URLSearchParams(location.search);
  const requested = params.get('skin');
  const initial = requested==='nice' ? 'nice' : (requested==='classic' ? 'classic' : (safeGet()==='nice'?'nice':'classic'));
  const sessionSeed = (() => {
    try { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0]; }
    catch (_) { return Math.floor(Math.random()*4294967295); }
  })();

  const topbar=document.createElement('header');
  topbar.className='nice-practice-masthead';
  topbar.setAttribute('aria-label','杂志皮肤导航');
  topbar.innerHTML =
    '<div class="nice-practice-mast-left"><button type="button" id="nicePracticeMenuButton" class="nice-practice-menu-button" aria-expanded="false" aria-controls="sidebar">'+
      '<span class="nice-practice-hamburger" aria-hidden="true"></span>Menu / 目录</button>'+
      '<span class="nice-practice-smallmeta">INSPIRING STUDY / ISSUE 02</span></div>'+
    '<div class="nice-practice-wordmark">It’s Nice That</div>'+
    '<div class="nice-practice-mast-right"><span class="nice-practice-smallmeta">IELTS SPEAKING / 2026</span>'+
      '<button id="nicePracticeAppearance" class="nice-practice-appearance" type="button">Appearance / 外观</button></div>';
  shell.insertBefore(topbar,layout);
  const cover=document.createElement('section');
  cover.className='nice-practice-hero variant-0';
  cover.setAttribute('aria-label','编辑杂志式练习封面');
  cover.innerHTML =
    '<div class="nice-practice-hero-copy">'+
      '<div class="nice-practice-kicker"><span class="nice-practice-category" id="nicePracticeCategory">STORIES + IDEAS</span>'+
      '<span id="nicePracticePart">SPEAKING / PART 01</span></div>'+
      '<h1 id="nicePracticeHeadline" class="nice-practice-headline"></h1>'+
      '<div id="nicePracticeSubline" class="nice-practice-subline"></div>'+
      '<div class="nice-practice-hero-meta"><span id="nicePracticeTopicMeta"></span><span>ILLUSTRATED STUDY EDITION</span></div>'+
    '</div>'+
    '<div class="nice-practice-visuals">'+
      '<img id="nicePracticeArtMain" class="nice-practice-main-art" alt="随机生成的编辑风格抽象插画" decoding="async">'+
      '<img id="nicePracticeArtSmall" class="nice-practice-small-art" alt="随机生成的彩色抽象插画" decoding="async">'+
      '<div class="nice-practice-art-caption"><span>ILLUSTRATION / STUDY EDITION</span><span>2026</span></div>'+
    '</div>';
  topbar.after(cover);

  const backdrop=document.createElement('div');
  backdrop.className='nice-practice-backdrop';
  backdrop.setAttribute('aria-hidden','true');
  body.append(backdrop);
  const closeButton=document.createElement('button');
  closeButton.className='nice-practice-drawer-close';
  closeButton.type='button';
  closeButton.textContent='×';
  closeButton.setAttribute('aria-label','关闭话题目录');
  sidebar.prepend(closeButton);

  const context=document.createElement('div');
  context.className='nice-practice-context-menu';
  context.setAttribute('role','menu');
  context.setAttribute('aria-label','切换网页皮肤');
  context.innerHTML =
    '<span class="nice-practice-context-label">APPEARANCE / 皮肤</span>'+
    '<button type="button" role="menuitemradio" data-skin="nice">It’s Nice That 风格</button>'+
    '<button type="button" role="menuitemradio" data-skin="classic">原始学习皮肤</button>';
  body.append(context);
  const access=document.createElement('button');
  access.type='button';
  access.className='nice-practice-access';
  access.textContent='✦ 皮肤';
  access.setAttribute('aria-label','打开皮肤切换菜单');
  body.append(access);

  const menuButton=document.getElementById('nicePracticeMenuButton');
  const appearance=document.getElementById('nicePracticeAppearance');
  function closeDrawer() {
    body.classList.remove('nice-practice-nav-open');
    menuButton.setAttribute('aria-expanded','false');
  }
  function openDrawer() {
    body.classList.add('nice-practice-nav-open');
    menuButton.setAttribute('aria-expanded','true');
    closeButton.focus({preventScroll:true});
  }
  menuButton.addEventListener('click',()=>{
    if(body.classList.contains('nice-practice-nav-open'))closeDrawer();
    else openDrawer();
  });
  closeButton.addEventListener('click',closeDrawer);
  backdrop.addEventListener('click',closeDrawer);
  sidebar.addEventListener('click',event=>{
    if(body.classList.contains('nice-skin')&&event.target.closest('.topicbtn,.parttabs button,.site-tabs a'))closeDrawer();
  });
  function closeContext(){
    context.classList.remove('is-open');
  }
  function openContext(x,y){
    closeDrawer();
    const active=body.classList.contains('nice-skin')?'nice':'classic';
    context.querySelectorAll('button[data-skin]').forEach(button=>{
      const selected=button.dataset.skin===active;
      button.setAttribute('data-selected',String(selected));
      button.setAttribute('aria-checked',String(selected));
    });
    context.classList.add('is-open');
    const rect=context.getBoundingClientRect(),w=rect.width||230,h=rect.height||128;
    context.style.left=Math.max(8,Math.min(x,window.innerWidth-w-8))+'px';
    context.style.top=Math.max(8,Math.min(y,window.innerHeight-h-8))+'px';
  }
  let lastCoverKey='';
  function applySkin(next){
    const nice=next==='nice';
    body.classList.toggle('nice-skin',nice);
    safeSet(nice?'nice':'classic');
    closeDrawer();
    closeContext();
    lastCoverKey='';
    if(nice)updateCover();
    else document.title='IELTS Speaking 2026 Q4 · 大陆 Part 1 + Part 3';
  }
  context.addEventListener('click',event=>{
    const button=event.target.closest('button[data-skin]');
    if(button)applySkin(button.dataset.skin);
  });
  document.addEventListener('contextmenu',event=>{
    if(event.target.closest('input,textarea,select,a,[contenteditable="true"]'))return;
    event.preventDefault();
    openContext(event.clientX,event.clientY);
  });
  appearance.addEventListener('click',event=>{
    const r=event.currentTarget.getBoundingClientRect();
    openContext(r.right-220,r.bottom+8);
  });
  access.addEventListener('click',event=>{
    const r=event.currentTarget.getBoundingClientRect();
    openContext(r.right-220,r.top-130);
  });
  document.addEventListener('pointerdown',event=>{
    if(!context.contains(event.target)&&event.target!==appearance&&event.target!==access)closeContext();
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){closeContext();closeDrawer();}
  });
  window.addEventListener('resize',closeContext);
  window.addEventListener('scroll',closeContext,{passive:true});

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

  const editorialHeadlines = [
    ['The beauty of thinking a little differently', 'A colourful invitation to see ordinary things in new ways'],
    ['Good ideas come in unexpected shapes', 'Where curiosity, imagination and happy accidents meet'],
    ['There is magic in the everyday', 'An exploration of small surprises and extraordinary possibilities'],
    ['A joyful world of unusual possibilities', 'Celebrating playful experiments and the art of making'],
    ['What happens when imagination takes the lead?', 'Curious creations made with colour, character and a sense of fun'],
    ['How to make the familiar feel surprising', 'Fresh perspectives on the little things we often overlook'],
    ['Creative chaos can be a beautiful thing', 'Bold forms, bright ideas and the freedom to explore'],
    ['A different way of looking at everything', 'A collection of creative ideas that refuse to stay ordinary'],
    ['The wonderful art of getting lost', 'Finding unexpected inspiration in shapes and stories'],
    ['Why does everything have to make sense?', 'A playful approach to visual storytelling and experimentation'],
    ['Sometimes strange is exactly what we need', 'A bright and unexpected adventure through the imagination'],
    ['Big feelings, small details, endless ideas', 'A fresh look at the surprising power of everyday creativity']
  ];

  function updateCover(){
    if(!body.classList.contains('nice-skin'))return;
    const topicName=contentArea.querySelector('.contenthead h2')?.textContent?.trim()||'';
    const topicEn=contentArea.querySelector('.contenthead .english')?.textContent?.trim()||'';
    const tab=document.getElementById('tabP3')?.classList.contains('active')?'3':'1';
    const key=tab+'|'+topicName+'|'+topicEn;
    if(lastCoverKey===key)return;
    lastCoverKey=key;
    const seed=(sessionSeed^hashText(key))>>>0;
    const rand=random((seed^0x51ed270b)>>>0);
    const [headline,subtitle]=editorialHeadlines[Math.floor(rand()*editorialHeadlines.length)];
    const variant=seed%3;
    cover.className='nice-practice-hero variant-'+variant;
    document.getElementById('nicePracticeHeadline').textContent=headline;
    document.getElementById('nicePracticeSubline').textContent=subtitle;
    document.getElementById('nicePracticeCategory').textContent=['PROJECTS + STORIES','INSIGHTS + STORIES','THE CREATIVE ISSUE'][variant];
    document.getElementById('nicePracticePart').textContent='IELTS / SPEAKING / PART 0'+tab;
    document.getElementById('nicePracticeTopicMeta').textContent='PART '+tab+' / '+(topicEn||'SPEAKING PRACTICE');
    document.getElementById('nicePracticeArtMain').src=artwork(seed,false);
    document.getElementById('nicePracticeArtSmall').src=artwork((seed+0x9e3779b9)>>>0,true);
    document.title='Part '+tab+' · '+headline+' | It’s Nice That 风格';
  }
  let updatePending=false;
  const watch=new MutationObserver(()=>{
    if(updatePending)return;
    updatePending=true;
    requestAnimationFrame(()=>{updatePending=false;updateCover();});
  });
  watch.observe(contentArea,{childList:true,subtree:false});
  applySkin(initial);
  window.IELTSPracticeNiceSkin={
    get:()=>body.classList.contains('nice-skin')?'nice':'classic',
    set:applySkin,
    refresh:()=>{lastCoverKey='';updateCover();}
  };
})();
