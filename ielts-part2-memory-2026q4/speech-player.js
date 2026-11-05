/* IELTS Part 2 English speech playback. Uses the device/browser's Web Speech voices. */
(() => {
  const root = document.getElementById('speechPlayer');
  if (!root) return;
  const pick = id => document.getElementById(id);
  const scope = pick('speechScope');
  const rate = pick('speechRate');
  const voiceSelect = pick('speechVoice');
  const voiceHint = pick('speechVoiceHint');
  const progressBar = pick('speechProgress');
  const progressText = pick('speechProgressText');
  const playBtn = pick('speechPlay');
  const pauseBtn = pick('speechPause');
  const nextBtn = pick('speechNext');
  const stopBtn = pick('speechStop');
  const status = pick('speechStatus');
  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const engine = canSpeak ? window.speechSynthesis : null;

  let queue = [];
  let cursor = 0;
  let paragraph = 0;
  let generation = 0;
  let playing = false;
  let paused = false;
  let pendingResumeAfterSeek = false;
  let pendingSeekPercent = 0;
  let charOffset = 0; // Current position inside the paragraph, in characters.
  const VOICE_KEY = 'p2-2026q4-speech-voice';
  let preferredVoice = (() => { try { return localStorage.getItem(VOICE_KEY) || ''; } catch (_) { return ''; } })();
  // One-time reset of the old generic voice preference when switching to the
  // female-first experience. Later user choices continue to persist normally.
  try {
    const presetKey = 'p2-2026q4-female-preset-v13';
    if (!localStorage.getItem(presetKey)) {
      preferredVoice = '';
      localStorage.setItem(VOICE_KEY, '');
      localStorage.setItem(presetKey, '1');
    }
  } catch (_) {}
  let voices = [];
  const voiceKey = v => [v.voiceURI,v.lang,v.name].join('|');
  // Web Speech exposes voice names, not gender. Match only recognisable English
  // female names; do not mark an unknown or generic voice as definitely female.
  const FEMALE_NAMES = /\b(?:ava|serena|samantha|jenny|aria|sonia|libby|kate|allison|karen|moira|fiona|joelle|noelle|zoe|matilda|susan|victoria|salli|joanna|kendra|ruth|michelle|olivia|emily|emma|amy|clara|stephanie|hazel|tessa|sangeeta|isha|natasha|catherine|kimberly|lisa|jane|mary|nancy|sara|sarah)\b/i;
  const MALE_NAMES = /\b(?:daniel|george|tom|fred|oliver|evan|nathan|rishi|arthur|christopher|david|james|michael|mark|eric|aaron|brian|richard|paul|alex)\b/i;
  const isFemale = v => /\b(female|woman|women)\b/i.test(v.name) || FEMALE_NAMES.test(v.name);
  const isMale = v => /\bmale\b/i.test(v.name) && !/\bfemale\b/i.test(v.name) || MALE_NAMES.test(v.name);
  const voiceScore = v => {
    const name = v.name || '';
    const quality = /premium|neural|natural|enhanced|siri/i.test(name) ? 110 : 0;
    return (isFemale(v) ? 1000 : 0)
      + quality
      + (/Microsoft.*Online|Google.*English/i.test(name) ? 35 : 0)
      + (/en-GB/i.test(v.lang) ? 12 : 0)
      - (/compact|espeak/i.test(name) ? 150 : 0)
      - (isMale(v) ? 600 : 0);
  };
  const selectedVoice = () => {
    const key = voiceSelect.value;
    return voices.find(v => voiceKey(v) === key)
      || voices.find(isFemale)
      || voices.find(v => !isMale(v))
      || null;
  };
  const selectedVoiceLabel = () => {
    const v = selectedVoice();
    if (!voices.length) return '设备尚未提供英文音色列表，可以尝试刷新或重新打开页面。';
    if (!v) return '未找到可用的英文女声。建议在系统设置中添加高质量英文女声。';
    if (!isFemale(v)) return '设备未识别到明确的英文女声。当前音色可能仍偏机械；可安装 Ava（Premium）或 Serena（Premium）等语音。';
    return '当前优先：' + v.name + (/premium|neural|natural|enhanced/i.test(v.name) ? ' · 高质量音色' : ' · 如仍机械，可添加 Premium 女声');
  };
  function refreshVoiceHint() {
    if (voiceHint) voiceHint.textContent = selectedVoiceLabel();
  }
  function populateVoices() {
    if (!canSpeak) return;
    const found = engine.getVoices().filter(v => /^en(?:-|$)/i.test(v.lang));
    if (!found.length) {
      refreshVoiceHint();
      return;
    }
    const previous = preferredVoice || voiceSelect.value;
    voices = found.sort((a,b) => voiceScore(b)-voiceScore(a) || a.name.localeCompare(b.name));
    voiceSelect.replaceChildren();
    const auto = document.createElement('option');
    auto.value = '';
    auto.textContent = '清晰女声（自动优先）';
    voiceSelect.appendChild(auto);
    voices.forEach(v => {
      const op = document.createElement('option');
      op.value = voiceKey(v);
      op.textContent = (isFemale(v) ? '♀ ' : '') + v.name + ' · ' + v.lang;
      voiceSelect.appendChild(op);
    });
    voiceSelect.value = voices.some(v=>voiceKey(v)===previous) ? previous : '';
    refreshVoiceHint();
  }
  if (canSpeak) {
    populateVoices();
    engine.addEventListener?.('voiceschanged', populateVoices);
    voiceSelect.addEventListener('focus', populateVoices);
  }

  const categoryOf = g => (g.category || '').split('/')[0].trim();
  const selected = () => GROUPS.find(g => g.id === selectedGroup) || GROUPS[0];
  const flat = gs => gs.flatMap(g => g.topics.map(t => ({ group:g, topic:t })));
  const answerParagraphs = item => parts(item.group, item.topic)
    .map(p => p.text.replace(/\s+/g,' ').trim()).filter(Boolean);
  const chosenVoice = () => {
    if (!voices.length) populateVoices();
    return selectedVoice();
  };
  // The progress measures answer text, not audio seconds: Web Speech provides
  // character boundaries but does not offer a real audio seeking interface.
  function updateProgress(done, total) {
    const percent = Math.round(100 * Math.max(0,Math.min(1,done / Math.max(total,1))));
    progressBar.value = String(percent);
    progressBar.style.setProperty('--speech-played',percent+'%');
    progressText.textContent = percent + '%';
    progressBar.setAttribute('aria-valuetext','当前英文答案约 ' + percent + '% 的文本位置');
  }
  function progressCounts(paragraphs) {
    const lengths = paragraphs.map(x => x.length);
    return {base:lengths.slice(0,paragraph).reduce((sum,n)=>sum+n,0),total:lengths.reduce((sum,n)=>sum+n,0)};
  }
  function nearestWordStart(text,at) {
    if (at<=0) return 0;
    if (at>=text.length) return text.length;
    const left = text.lastIndexOf(' ',at-1)+1;
    const nextSpace = text.indexOf(' ',at);
    const right = nextSpace<0?text.length:nextSpace+1;
    return at-left<=right-at?left:right;
  }
  function locatePercent(percent) {
    const item = queue[cursor];
    if (!item) return;
    const ps=answerParagraphs(item);
    const total=ps.reduce((n,t)=>n+t.length,0);
    let target=Math.floor(total * Math.max(0,Math.min(100,percent)) / 100);
    paragraph=0;
    charOffset=0;
    for(let i=0;i<ps.length;i++){
      if(target>=ps[i].length&&i<ps.length-1){
        target-=ps[i].length;
        continue;
      }
      paragraph=i;
      charOffset=nearestWordStart(ps[i],target);
      // Rounding to the end of a paragraph must not produce an empty
      // utterance: some engines never fire "end" for empty text.
      if (charOffset >= ps[i].length && i < ps.length - 1) {
        paragraph=i+1;
        charOffset=0;
      } else if (charOffset >= ps[i].length && ps[i].length) {
        charOffset=Math.max(0,ps[i].lastIndexOf(' ',ps[i].length-2)+1);
      }
      break;
    }
    const {base}=progressCounts(ps);
    updateProgress(base+charOffset,total);
  }
  function seekTo(percent) {
    if (!canSpeak) return;
    const value = Math.max(0,Math.min(100,Number(percent)||0));
    if (!playing) {
      pendingSeekPercent=value;
      updateProgress(value,100);
      setStatus('定位到本篇约 '+value+'% · 点击播放从这里开始');
      return;
    }
    const wasPaused=paused;
    ++generation;
    engine.cancel();
    pendingResumeAfterSeek=false;
    if (value>=100) {
      paused=false;
      return advance(generation);
    }
    locatePercent(value);
    if (wasPaused) {
      paused=true;
      pendingResumeAfterSeek=true;
      updateUI();
      setStatus('已定位到约 '+progressBar.value+'% · 点击继续播放');
    } else {
      paused=false;
      announce();
      speakPart(generation);
    }
  }
  const setStatus = message => { status.textContent = message; };
  function updateUI() {
    playBtn.disabled = !canSpeak || (playing && !paused);
    playBtn.textContent = paused ? '▶ 继续' : '▶ 播放';
    pauseBtn.disabled = !playing || paused;
    nextBtn.disabled = !playing || cursor >= queue.length - 1;
    stopBtn.disabled = !playing;
    scope.disabled = !canSpeak;
    voiceSelect.disabled = !canSpeak;
  }
  function stop(message='已停止', retainProgress=false) {
    ++generation; // Ignore late onend/onerror events from a cancelled utterance.
    playing = false;
    paused = false;
    pendingResumeAfterSeek = false;
    pendingSeekPercent = 0;
    charOffset = 0;
    queue = [];
    cursor = 0;
    paragraph = 0;
    if (engine) engine.cancel();
    if (!retainProgress) updateProgress(0,1);
    updateUI();
    setStatus(message);
  }
  function startQueue() {
    const g = selected();
    let list;
    switch (scope.value) {
      case 'group': list = flat([g]); break;
      case 'category': list = flat(GROUPS.filter(item => categoryOf(item) === categoryOf(g))); break;
      case 'all': list = flat(GROUPS); break;
      default: list = flat([g]).filter(item => item.topic.q === topic().q); break;
    }
    // Start with the selected Q, then play the rest and wrap around within the chosen range.
    const at = list.findIndex(item => item.topic.q === topic().q);
    if (at > 0) list = list.slice(at).concat(list.slice(0, at));
    return list;
  }
  function showEntry(item, scroll) {
    if (selectedGroup !== item.group.id || selectedQ !== item.topic.q) {
      selectedGroup = item.group.id;
      selectedQ = item.topic.q;
      const search = pick('search');
      if (search && search.value) search.value = '';
      save();
      render();
      if (scroll) pick('card').scrollIntoView({block:'start',behavior:'auto'});
      const sidebar = pick('topicSidebar');
      const active = document.querySelector('#nav .nav-btn.on');
      if (sidebar && active) {
        const a = active.getBoundingClientRect(), s = sidebar.getBoundingClientRect();
        if (a.top < s.top + 10) sidebar.scrollTop += a.top - s.top - 10;
        else if (a.bottom > s.bottom - 10) sidebar.scrollTop += a.bottom - s.bottom + 10;
      }
    }
  }
  function speakPart(token) {
    if (!playing || token !== generation) return;
    const item = queue[cursor];
    if (!item) return stop('播放完成');
    const paragraphs = answerParagraphs(item);
    if (paragraph >= paragraphs.length) return advance(token);
    const fullParagraph = paragraphs[paragraph];
    const startOffset = charOffset;
    const text = fullParagraph.slice(startOffset);
    const {base,total} = progressCounts(paragraphs);
    updateProgress(base+startOffset,total);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = Number(rate.value) || 1;
    utterance.pitch = 1;
    const voice = chosenVoice();
    if (voice) { utterance.voice = voice; utterance.lang = voice.lang; }
    // Web Speech exposes character position where supported. On other browsers,
    // the bar still advances at each paragraph boundary.
    utterance.onboundary = ev => {
      if (!playing || token !== generation || paused) return;
      if (Number.isFinite(ev.charIndex)) {
        charOffset = Math.min(fullParagraph.length, startOffset + Math.max(0,ev.charIndex));
        updateProgress(base + charOffset,total);
      }
    };
    utterance.onend = () => {
      if (!playing || token !== generation) return;
      updateProgress(base + fullParagraph.length,total);
      charOffset = 0;
      paragraph++;
      speakPart(token);
    };
    utterance.onerror = ev => {
      if (!playing || token !== generation) return;
      stop(ev.error === 'not-allowed'
        ? '浏览器未允许发声，请再次点击播放'
        : '语音播放中断，请点击播放重试');
    };
    engine.speak(utterance);
  }
  function advance(token) {
    if (!playing || token !== generation) return;
    if (cursor + 1 >= queue.length) {
      const total = queue.length;
      updateProgress(100,100);
      return stop('已播放完毕 · ' + total + ' / ' + total + ' 题', true);
    }
    cursor++;
    paragraph = 0;
    charOffset = 0;
    pendingSeekPercent = 0;
    showEntry(queue[cursor], true);
    announce();
    speakPart(token);
  }
  function announce() {
    const item = queue[cursor];
    setStatus('正在朗读 ' + (cursor + 1) + ' / ' + queue.length + ' · ' + item.topic.q + ' ' + item.topic.zh);
    updateUI();
  }
  function play() {
    if (!canSpeak) return;
    if (playing && paused) {
      paused = false;
      if (pendingResumeAfterSeek) {
        pendingResumeAfterSeek = false;
        announce();
        speakPart(generation);
      } else {
        engine.resume();
        announce();
      }
      return;
    }
    if (playing) return;
    const initialPosition = pendingSeekPercent >= 100 ? 0 : pendingSeekPercent;
    stop('');
    queue = startQueue();
    if (!queue.length) return setStatus('当前范围没有可朗读的题目');
    playing = true;
    cursor = 0;
    paragraph = 0;
    charOffset = 0;
    const token = generation;
    showEntry(queue[0], false);
    if (initialPosition) locatePercent(initialPosition);
    announce();
    speakPart(token);
  }
  playBtn.addEventListener('click', play);
  pauseBtn.addEventListener('click', () => {
    if (!playing || paused) return;
    paused = true;
    engine.pause();
    updateUI();
    const item=queue[cursor];
    setStatus('已暂停 · '+(cursor+1)+' / '+queue.length+' · '+item.topic.q);
  });
  nextBtn.addEventListener('click', () => {
    if (!playing || cursor >= queue.length-1) return;
    ++generation;
    engine.cancel();
    paused = false;
    pendingResumeAfterSeek = false;
    const token = generation;
    cursor++;
    paragraph = 0;
    charOffset = 0;
    showEntry(queue[cursor], true);
    announce();
    speakPart(token);
  });
  stopBtn.addEventListener('click', () => stop());
  scope.addEventListener('change', () => {
    // The scope selector stays usable during playback: restart at the currently displayed Q.
    if (playing) { stop(''); play(); }
    else setStatus('点击播放后朗读' + scope.options[scope.selectedIndex].text);
  });
  function restartParagraph() {
    if (!playing) return;
    ++generation;
    engine.cancel();
    paused = false;
    pendingResumeAfterSeek = false;
    announce();
    speakPart(generation);
  }
  rate.addEventListener('change', restartParagraph);
  voiceSelect.addEventListener('change', () => {
    preferredVoice = voiceSelect.value;
    try { localStorage.setItem(VOICE_KEY, preferredVoice); } catch (_) {}
    refreshVoiceHint();
    if (playing) restartParagraph();
    else setStatus('已切换音色，点击播放当前答案');
  });
  progressBar.addEventListener('input', () => {
    const percent=Number(progressBar.value);
    progressBar.style.setProperty('--speech-played',percent+'%');
    progressText.textContent=percent+'%';
  });
  progressBar.addEventListener('change', () => seekTo(progressBar.value));
  // Direct manual navigation takes priority over an ongoing playlist.
  document.addEventListener('click', ev => {
    if (!playing) return;
    if (ev.target.closest('#nav .nav-btn, #topics .topic, #prevGroup, #nextGroup, #regionMain, #regionForeign')) {
      stop('已停止 · 已切换题目');
    }
  }, true);
  window.addEventListener('pagehide', () => { if (playing) stop(); });
  if (!canSpeak) {
    setStatus('当前浏览器不支持语音朗读');
    playBtn.disabled = true;
  } else {
    updateProgress(0,1);
    refreshVoiceHint();
    setStatus('可拖动进度条，从指定的文本位置继续朗读');
    updateUI();
  }
})();
