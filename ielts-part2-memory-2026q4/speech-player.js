/* Jenny Neural MP3 playback; uses the existing IELTS topic selection and controls. */
(() => {
  const root = document.getElementById('speechPlayer');
  if (!root) return;
  const el = id => document.getElementById(id);
  const audio = el('speechAudio');
  const scope = el('speechScope');
  const rate = el('speechRate');
  const playBtn = el('speechPlay');
  const pauseBtn = el('speechPause');
  const nextBtn = el('speechNext');
  const stopBtn = el('speechStop');
  const progress = el('speechProgress');
  const progressText = el('speechProgressText');
  const status = el('speechStatus');
  const versions = window.P2_2026Q4_AUDIO?.versions || {};
  let isReady = false;
  const invalidAudio = new Set();
  const setting = window.P2_2026Q4_AUDIO || {};
  let verificationNote = '正在核对录音与答案版本…';

  let queue = [];
  let cursor = 0;
  let started = false;
  let pendingSeek = null; // Fraction 0..1, used before metadata is available.
  const category = g => (g.category || '').split('/')[0].trim();
  const currentGroup = () => GROUPS.find(g => g.id === selectedGroup) || GROUPS[0];
  const flatten = groups => groups.flatMap(g => g.topics.map(t => ({g,t})));

  function playlist() {
    const g = currentGroup();
    let list;
    if (scope.value === 'group') list = flatten([g]);
    else if (scope.value === 'category') list = flatten(GROUPS.filter(x => category(x) === category(g)));
    else if (scope.value === 'all') list = flatten(GROUPS);
    else list = flatten([g]).filter(x => x.t.q === topic().q);
    const at = list.findIndex(x => x.t.q === topic().q);
    return at > 0 ? list.slice(at).concat(list.slice(0,at)) : list;
  }
  const fmt = seconds => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const n = Math.floor(seconds);
    return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');
  };
  const duration = () => Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
  function displayProgress(fraction, seconds=null) {
    const value = Math.round(Math.max(0,Math.min(1,fraction))*1000);
    progress.value = String(value);
    progress.style.setProperty('--speech-played',(value / 10)+'%');
    const time = seconds === null ? value / 1000 * duration() : seconds;
    progressText.textContent = duration() ? fmt(time) + ' / ' + fmt(duration()) : Math.round(value/10)+'%';
    syncReading();
  }
  // Audio is a plain MP3 without word timestamps. Estimate the current
  // sentence from its share of spoken words; the audio timeline itself stays exact.
  // The CSS Highlight API marks the sentence without modifying user bold spans.
  let readingBlock=null;
  const readingKey='p2-read-current';
  function clearReading(){
    window.CSS?.highlights?.delete(readingKey);
    if(readingBlock && readingBlock.isConnected){
      readingBlock.classList.remove('speech-reading');
      readingBlock.style.removeProperty('--speech-line');
    }
    readingBlock=null;
  }
  function nodePoint(block,offset){
    const walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT);
    let node=walker.nextNode(),remaining=offset,last=null;
    while(node){
      last=node;
      if(remaining<=node.textContent.length)return [node,remaining];
      remaining-=node.textContent.length;
      node=walker.nextNode();
    }
    return last?[last,last.textContent.length]:null;
  }
  function syncReading(){
    if(!started || !duration() || !queue[cursor]){clearReading();return;}
    const item=queue[cursor];
    const blocks=[...document.querySelectorAll('#answer > p.answer-paragraph')];
    // In "bold only" mode the original sentence text is incomplete.
    // Do not pretend the fragment can be aligned to the full recording.
    if(blocks.length!==parts(item.g,item.t).length){clearReading();return;}
    const sentences=[];
    blocks.forEach((block,p)=>{
      const text=block.textContent;
      const re=/[^.!?]+[.!?]?/g;
      let m;
      while((m=re.exec(text))){
        const lead=m[0].search(/\S/);
        if(lead<0)continue;
        const start=m.index+lead,end=m.index+m[0].length;
        const words=(m[0].match(/[A-Za-z]+(?:['-][A-Za-z]+)*/g)||[]).length;
        sentences.push({p,start,end,weight:Math.max(1,words)+.35});
      }
    });
    if(!sentences.length){clearReading();return;}
    const total=sentences.reduce((n,x)=>n+x.weight,0);
    const where=Math.max(0,Math.min(.999999,audio.currentTime/duration()))*total;
    let passed=0,current=sentences[sentences.length-1];
    for(const x of sentences){
      if(where<passed+x.weight){current=x;break;}
      passed+=x.weight;
    }
    const block=blocks[current.p];
    if(readingBlock!==block){
      clearReading();
      readingBlock=block;
      block.classList.add('speech-reading');
    }
    const partial=(where-passed)/current.weight;
    const paragraphStart=sentences.filter(x=>x.p===current.p);
    const used=paragraphStart.filter(x=>x.end<=current.start).reduce((n,x)=>n+x.weight,0);
    const totalParagraph=paragraphStart.reduce((n,x)=>n+x.weight,0);
    block.style.setProperty('--speech-line',Math.max(0,Math.min(100,(used+partial*current.weight)/totalParagraph*100))+'%');
    if(!window.CSS?.highlights || !window.Highlight)return;
    const a=nodePoint(block,current.start),b=nodePoint(block,current.end);
    if(!a||!b)return;
    const range=document.createRange();
    range.setStart(a[0],a[1]);
    range.setEnd(b[0],b[1]);
    window.CSS.highlights.set(readingKey,new window.Highlight(range));
  }
  const syncHint=document.createElement('p');
  syncHint.className='speech-sync-hint';
  syncHint.textContent='正文按播放进度估算当前句；MP3 没有逐词时间戳。';
  status.insertAdjacentElement('afterend',syncHint);

  function ui() {
    playBtn.disabled = !isReady || (started && !audio.paused) || (!started && invalidAudio.has(topic().q));
    playBtn.textContent = started && audio.paused ? '▶ 继续' : '▶ 播放';
    pauseBtn.disabled = !started || audio.paused;
    nextBtn.disabled = !started || cursor + 1 >= queue.length;
    stopBtn.disabled = !started;
    scope.disabled = !isReady;
  }
  function stop(message='已停止', reset=true) {
    started = false;
    queue = [];
    cursor = 0;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    pendingSeek = null;
    clearReading();
    if (reset) displayProgress(0,0);
    ui();
    status.textContent = message;
  }
  function showTopic(item,scroll) {
    if (selectedGroup !== item.g.id || selectedQ !== item.t.q) {
      selectedGroup = item.g.id;
      selectedQ = item.t.q;
      const search = el('search');
      if (search && search.value) search.value = '';
      save(); render();
      if (scroll) el('card').scrollIntoView({block:'start',behavior:'auto'});
      const sidebar = el('topicSidebar');
      const active = document.querySelector('#nav .nav-btn.on');
      if (sidebar && active) {
        const a = active.getBoundingClientRect(), b = sidebar.getBoundingClientRect();
        if (a.top < b.top+10) sidebar.scrollTop += a.top-b.top-10;
        else if (a.bottom > b.bottom-10) sidebar.scrollTop += a.bottom-b.bottom+10;
      }
    }
  }
  function announce() {
    const item = queue[cursor];
    if (!item) return;
    status.textContent = 'Jenny 女声 · '+(audio.paused?'准备播放':'正在播放')+' '+(cursor+1)+' / '+queue.length+' · '+item.t.q+' '+item.t.zh;
    ui();
  }
  function playAudio() {
    try {
      const promise = audio.play();
      if (promise && typeof promise.catch === 'function') promise.catch(err => {
        if (!started) return;
        status.textContent = err?.name === 'NotAllowedError'
          ? '浏览器阻止自动播放，请点击继续'
          : '无法播放音频，请检查网络或离线缓存';
        ui();
      });
    } catch (_) {
      status.textContent = '无法播放音频，请检查浏览器';
      ui();
    }
  }
  function loadCurrent(scroll=false) {
    const item = queue[cursor];
    if (!item) return stop('播放完成');
    const hash = versions[item.t.q];
    if (!hash) return stop('尚未生成 '+item.t.q+' 的音频');
    clearReading();
    showTopic(item,scroll);
    audio.pause();
    if (invalidAudio.has(item.t.q)) return stop(item.t.q+' 的音频与英文原稿版本不一致，已停止播放；请联网刷新');
    // The file name is immutable for this exact answer text and voice settings.
    audio.src = './audio/'+item.t.q+'-'+encodeURIComponent(hash)+'.mp3';
    audio.playbackRate = Number(rate.value) || 1;
    audio.load();
    displayProgress(0,0);
    announce();
    playAudio();
  }
  function begin() {
    if (!isReady) { status.textContent = verificationNote; return; }
    const seek = pendingSeek;
    stop('',true);
    queue = playlist();
    if (!queue.length) return stop('没有可播放的题目');
    started = true;
    cursor = 0;
    pendingSeek = seek;
    loadCurrent();
  }
  function advance() {
    if (!started) return;
    if (cursor + 1 >= queue.length) {
      const total = queue.length;
      displayProgress(1,duration());
      stop('已播放完毕 · '+total+' / '+total+' 题', false);
      return;
    }
    cursor++;
    pendingSeek = null;
    loadCurrent(true);
  }
  playBtn.addEventListener('click', () => {
    if (started && audio.paused) { playAudio(); return; }
    if (!started) begin();
  });
  pauseBtn.addEventListener('click', () => {
    if (!started) return;
    audio.pause();
    status.textContent='已暂停 · '+(cursor+1)+' / '+queue.length+' · '+queue[cursor].t.q;
    ui();
  });
  nextBtn.addEventListener('click',advance);
  stopBtn.addEventListener('click',()=>stop());
  scope.addEventListener('change',()=> {
    if (!started) { status.textContent='点击播放后朗读'+scope.options[scope.selectedIndex].text; return; }
    begin(); // Resume at the selected Q using the new scope.
  });
  rate.addEventListener('change',()=> { audio.playbackRate=Number(rate.value)||1; });

  audio.addEventListener('loadedmetadata', () => {
    const d = duration();
    if (pendingSeek !== null && d) {
      audio.currentTime = Math.max(0,Math.min(d-0.05,d*pendingSeek));
      pendingSeek = null;
    }
    if (d) displayProgress(audio.currentTime/d,audio.currentTime);
  });
  audio.addEventListener('timeupdate', () => {
    const d=duration();
    if (d) displayProgress(audio.currentTime/d,audio.currentTime);
  });
  audio.addEventListener('play',()=> { if (started) announce(); });
  audio.addEventListener('pause',ui);
  audio.addEventListener('ended',advance);
  audio.addEventListener('error',() => {
    if (!started) return;
    stop('MP3 加载失败：请联网刷新或检查音频生成状态');
  });

  progress.addEventListener('input', () => {
    const fraction=Number(progress.value)/1000;
    progress.style.setProperty('--speech-played',Number(progress.value)/10+'%');
    progressText.textContent=duration()
      ? fmt(fraction*duration())+' / '+fmt(duration())
      : Math.round(fraction*100)+'%';
  });
  progress.addEventListener('change', () => {
    const fraction = Math.max(0,Math.min(1,Number(progress.value)/1000));
    if (started && duration()) {
      audio.currentTime = Math.min(Math.max(0,duration()-0.05),duration()*fraction);
      displayProgress(audio.currentTime/duration(),audio.currentTime);
    } else {
      pendingSeek = fraction;
      if (!started) status.textContent = '已定位到约 '+Math.round(fraction*100)+'% · 点击播放';
    }
  });

  document.addEventListener('click',ev => {
    if (!started) return;
    if (ev.target.closest('#nav .nav-btn, #topics .topic, #prevGroup, #nextGroup, #regionMain, #regionForeign')) {
      stop('已停止 · 已切换题目');
    }
  },true);
  window.addEventListener('pagehide', () => { if (started) stop(); });

  // Compare the SHA-256 of the ACTUAL answer on this page with the version
  // that was used to synthesize the MP3. If scripts/manifest were cached from
  // different deployments, don't play an unrelated recording.
  async function verifyVersions() {
    if (!window.crypto?.subtle || !window.TextEncoder) {
      verificationNote='当前环境不能安全校验录音版本，请使用 HTTPS 网页重新打开';
      status.textContent=verificationNote;
      ui();
      return;
    }
    if (Object.keys(versions).length !== 58) {
      verificationNote='录音索引尚未同步，联网刷新后再试';
      status.textContent=verificationNote;
      ui();
      return;
    }
    const encoder = new window.TextEncoder();
    const voice=setting.voice || 'en-US-JennyNeural';
    const voiceRate=setting.rate || '-5%';
    const topicList=GROUPS.flatMap(g=>g.topics.map(t=>({g,t})));
    await Promise.all(topicList.map(async ({g,t}) => {
      const plain=fullText(g,t).replace(/\s+/g,' ').trim();
      const bytes=encoder.encode(voice+'\0'+voiceRate+'\0'+plain);
      const digest=await window.crypto.subtle.digest('SHA-256',bytes);
      const signature=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,16);
      if (versions[t.q]!==signature) invalidAudio.add(t.q);
    }));
    isReady=true;
    verificationNote=invalidAudio.size
      ? invalidAudio.size+' 篇录音版本与当前答案不同，已阻止播放这些篇章；请联网刷新页面'
      : 'Jenny Neural 女声 · MP3 · 可按实际音频时间拖动';
    status.textContent=verificationNote;
    ui();
  }

  displayProgress(0,0);
  status.textContent=verificationNote;
  ui();
  verifyVersions().catch(() => {
    isReady=false;
    verificationNote='核对录音版本失败，请联网刷新页面';
    status.textContent=verificationNote;
    ui();
  });
})();
