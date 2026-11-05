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
  const isReady = Object.keys(versions).length === 58;

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
  }
  function ui() {
    playBtn.disabled = !isReady || (started && !audio.paused);
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
    showTopic(item,scroll);
    audio.pause();
    audio.src = './audio/'+item.t.q+'.mp3?v='+encodeURIComponent(hash);
    audio.playbackRate = Number(rate.value) || 1;
    audio.load();
    displayProgress(0,0);
    announce();
    playAudio();
  }
  function begin() {
    if (!isReady) { status.textContent = 'Jenny 音频正在准备，刷新后再试'; return; }
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

  displayProgress(0,0);
  status.textContent = isReady
    ? 'Jenny Neural 女声 · MP3 · 可按实际音频时间拖动'
    : 'Jenny 女声音频正在生成，完成后刷新页面';
  ui();
})();
