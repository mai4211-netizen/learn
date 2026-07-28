(() => {
  'use strict';

  const BUILD = 'v8';
  let activeCapture = null;
  let lastCompleted = null;
  const fallbackTakes = new Map();
  let transcriptSaveTimer = null;

  const style = document.createElement('style');
  style.textContent = `
    .v8-transcript-box{margin-top:12px;border:1px solid var(--line);border-radius:12px;background:#fff;padding:11px}
    .v8-transcript-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:7px}
    .v8-transcript-head b{font-size:13px}.v8-transcript-state{font-size:11px;color:var(--muted);text-align:right}
    .v8-transcript{display:block;width:100%;min-height:96px;resize:vertical;border:1px solid var(--line);border-radius:9px;padding:10px;font:15px/1.55 Georgia,"Times New Roman",serif;color:var(--ink);background:var(--card)}
    .v8-transcript:focus{outline:2px solid rgba(55,93,80,.25);border-color:var(--green)}
    .v8-analysis-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:10px 0}
    .v8-metric{border:1px solid var(--line);border-radius:9px;padding:8px;background:var(--card);font-size:12px}.v8-metric b{display:block;font-size:18px;color:var(--green)}
    .v8-fix{margin:7px 0;padding:9px 10px;border-left:3px solid var(--gold);background:#fff7e7;border-radius:0 8px 8px 0;font-size:13px}
    .v8-fix code{font-family:Georgia,"Times New Roman",serif;white-space:normal;color:var(--ink)}
    .v8-clean{margin-top:10px;padding:10px;border:1px dashed var(--line);border-radius:9px;background:var(--card);font-family:Georgia,"Times New Roman",serif}
    .v8-warning{color:#9b322d}.v8-ok{color:var(--green)}
    @media(max-width:650px){.v8-analysis-grid{grid-template-columns:1fr 1fr}.v8-transcript{min-height:116px;font-size:16px}.v8-transcript-head{align-items:flex-start}}
  `;
  document.head.appendChild(style);

  const originalSaveTake = typeof saveTake === 'function' ? saveTake : null;
  const originalAllTakes = typeof allTakes === 'function' ? allTakes : null;
  const originalDeleteTake = typeof deleteTake === 'function' ? deleteTake : null;
  const originalClearTakes = typeof clearTakes === 'function' ? clearTakes : null;

  if (originalSaveTake && originalAllTakes) {
    saveTake = async function robustSaveTake(take) {
      try {
        await originalSaveTake(take);
        const stored = await originalAllTakes();
        if (!stored.some(item => item.id === take.id && item.blob?.size > 0)) {
          throw new Error('录音写入后校验失败');
        }
        fallbackTakes.delete(take.id);
        return { persistent: true };
      } catch (error) {
        fallbackTakes.set(take.id, take);
        return { persistent: false, error };
      }
    };

    allTakes = async function robustAllTakes() {
      let stored = [];
      try { stored = await originalAllTakes(); } catch (_) {}
      const merged = new Map(stored.map(item => [item.id, item]));
      fallbackTakes.forEach((item, id) => merged.set(id, item));
      return [...merged.values()].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    };

    deleteTake = async function robustDeleteTake(id) {
      fallbackTakes.delete(id);
      try { if (originalDeleteTake) await originalDeleteTake(id); } catch (_) {}
    };

    clearTakes = async function robustClearTakes() {
      fallbackTakes.clear();
      try { if (originalClearTakes) await originalClearTakes(); } catch (_) {}
    };
  }

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const escapeText = value => typeof esc === 'function' ? esc(value) : String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const getItem = id => typeof itemById === 'function' ? itemById(id) : null;
  const getPanel = id => [...document.querySelectorAll('[data-record-panel]')].find(node => node.dataset.recordPanel === id) || null;

  function transcriptText(panelNode = null) {
    const host = panelNode || (lastCompleted ? getPanel(lastCompleted.itemId) : null);
    const editor = host?.querySelector('.v8-transcript');
    if (editor) return editor.value.trim();
    if (lastCompleted) return `${lastCompleted.finalText || ''}${lastCompleted.interim || ''}`.trim();
    return '';
  }

  function enhanceRecordPanels() {
    document.querySelectorAll('.record-panel').forEach(host => {
      if (host.querySelector('.v8-transcript-box')) return;
      const box = document.createElement('div');
      box.className = 'v8-transcript-box';
      box.innerHTML = `
        <div class="v8-transcript-head"><b>语音转写（可修改）</b><span class="v8-transcript-state">等待录音</span></div>
        <textarea class="v8-transcript" placeholder="浏览器支持时会同步转写；也可以在这里手动修正。" spellcheck="true"></textarea>`;
      const live = host.querySelector('.live-text');
      if (live) live.insertAdjacentElement('afterend', box); else host.appendChild(box);
    });
  }

  function setTranscriptState(host, text, className = '') {
    const node = host?.querySelector('.v8-transcript-state');
    if (!node) return;
    node.textContent = text;
    node.className = `v8-transcript-state ${className}`.trim();
  }

  function syncTranscript(session) {
    const host = getPanel(session.itemId);
    if (!host) return;
    const text = `${session.finalText || ''}${session.interim || ''}`.trim();
    const editor = host.querySelector('.v8-transcript');
    if (editor && document.activeElement !== editor) editor.value = text;
    const live = host.querySelector('.live-text');
    if (live) live.textContent = text;
    setTranscriptState(host, text ? '正在转写' : '正在听取语音');
  }

  function stopRecognition(session) {
    session.keepRecognition = false;
    if (session.recognition) {
      try { session.recognition.onend = null; session.recognition.stop(); } catch (_) {}
      session.recognition = null;
    }
  }

  function startRecognitionV8(session) {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const host = getPanel(session.itemId);
    if (!Recognition) {
      setTranscriptState(host, '此浏览器不支持自动转写，可录音后手动输入', 'v8-warning');
      return;
    }
    try {
      const recognition = new Recognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      session.keepRecognition = true;
      session.recognition = recognition;
      rec.recognition = recognition;

      recognition.onresult = event => {
        let interim = '';
        for (let index = event.resultIndex; index < event.results.length; index++) {
          const phrase = event.results[index][0]?.transcript || '';
          if (event.results[index].isFinal) session.finalText += `${phrase.trim()} `;
          else interim += phrase;
        }
        session.interim = interim;
        rec.finalText = session.finalText;
        rec.interim = session.interim;
        syncTranscript(session);
      };
      recognition.onerror = event => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setTranscriptState(host, '转写权限不可用；录音仍会正常保存', 'v8-warning');
          session.keepRecognition = false;
        } else if (!['no-speech', 'aborted'].includes(event.error)) {
          setTranscriptState(host, `自动转写暂停：${event.error}`, 'v8-warning');
        }
      };
      recognition.onend = () => {
        if (session.keepRecognition && session.media?.state === 'recording' && !session.stopping) {
          setTimeout(() => { try { recognition.start(); } catch (_) {} }, 180);
        }
      };
      recognition.start();
      setTranscriptState(host, '自动转写已开启', 'v8-ok');
    } catch (_) {
      setTranscriptState(host, '自动转写启动失败；录音仍会正常保存', 'v8-warning');
    }
  }

  function startPauseMonitorV8(session) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      session.audioContext = new AudioContextClass();
      const source = session.audioContext.createMediaStreamSource(session.stream);
      session.analyser = session.audioContext.createAnalyser();
      session.analyser.fftSize = 1024;
      source.connect(session.analyser);
      const values = new Uint8Array(session.analyser.fftSize);
      const loop = () => {
        if (!session.analyser || session.media?.state !== 'recording') return;
        session.analyser.getByteTimeDomainData(values);
        let total = 0;
        for (const value of values) {
          const normalized = (value - 128) / 128;
          total += normalized * normalized;
        }
        const rms = Math.sqrt(total / values.length);
        const now = performance.now();
        if (rms < 0.018) {
          if (!session.silenceStart) session.silenceStart = now;
          if (now - session.silenceStart > 1500 && !session.pauseLatched) {
            session.pauses += 1;
            session.pauseLatched = true;
          }
        } else {
          session.silenceStart = 0;
          session.pauseLatched = false;
        }
        session.raf = requestAnimationFrame(loop);
      };
      loop();
    } catch (_) {}
  }

  function cleanupSession(session) {
    clearInterval(session.timer);
    session.timer = null;
    if (session.stream) {
      session.stream.getTracks().forEach(track => track.stop());
      session.stream = null;
    }
    if (session.audioContext) {
      try { session.audioContext.close(); } catch (_) {}
      session.audioContext = null;
    }
    if (session.raf) cancelAnimationFrame(session.raf);
    session.raf = 0;
    session.analyser = null;
  }

  function supportedMimeType() {
    if (!window.MediaRecorder || typeof MediaRecorder.isTypeSupported !== 'function') return '';
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/mp4;codecs=mp4a.40.2',
      'audio/mp4',
      'audio/webm',
      'audio/ogg;codecs=opus'
    ];
    return candidates.find(type => MediaRecorder.isTypeSupported(type)) || '';
  }

  startRecording = async function startRecordingV8(itemId) {
    enhanceRecordPanels();
    if (activeCapture) {
      const message = activeCapture.stopping ? '上一题录音正在保存，请稍等一下。' : '当前正在录音，请先点击停止。';
      if (typeof toast === 'function') toast(message);
      return;
    }
    const host = getPanel(itemId);
    const startButton = host?.querySelector('[data-record-start]');
    const status = host?.querySelector('.record-status');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      if (status) status.textContent = '当前浏览器不支持网页录音，请使用最新版 Safari 或 Chrome。';
      if (typeof toast === 'function') toast('当前浏览器不支持录音');
      return;
    }

    if (startButton) { startButton.disabled = true; startButton.textContent = '请求麦克风…'; }
    if (status) status.textContent = '请允许浏览器使用麦克风。';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      const mimeType = supportedMimeType();
      const media = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const session = {
        itemId,
        takeId: `take-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        media,
        stream,
        chunks: [],
        started: Date.now(),
        timer: null,
        recognition: null,
        keepRecognition: false,
        finalText: '',
        interim: '',
        pauses: 0,
        silenceStart: 0,
        pauseLatched: false,
        audioContext: null,
        analyser: null,
        raf: 0,
        stopping: false,
        url: ''
      };
      activeCapture = session;
      Object.assign(rec, {
        media, stream, chunks: session.chunks, started: session.started, timer: null,
        recognition: null, finalText: '', interim: '', duration: 0, itemId,
        audioContext: null, analyser: null, raf: 0, silenceStart: 0,
        pauseLatched: false, pauses: 0, blob: null, takeId: session.takeId
      });

      media.ondataavailable = event => { if (event.data?.size) session.chunks.push(event.data); };
      media.onerror = event => {
        const text = `录音发生错误：${event.error?.message || '未知错误'}`;
        if (status) status.textContent = text;
        if (typeof toast === 'function') toast(text);
      };
      media.onstop = () => finalizeCapture(session);
      media.start(250);

      if (startButton) startButton.textContent = '录音中…';
      const stopButton = host?.querySelector('[data-record-stop]');
      if (stopButton) stopButton.disabled = false;
      const result = host?.querySelector('.record-result');
      if (result) result.hidden = true;
      const analysis = host?.querySelector('.local-analysis');
      if (analysis) analysis.hidden = true;
      const saved = host?.querySelector('.saved-note');
      if (saved) saved.hidden = true;
      const editor = host?.querySelector('.v8-transcript');
      if (editor) editor.value = '';
      if (status) status.textContent = '正在录音。说完后点击“停止”。';

      session.timer = setInterval(() => {
        const currentHost = getPanel(itemId);
        const time = currentHost?.querySelector('.record-time');
        if (time && typeof fmt === 'function') time.textContent = fmt((Date.now() - session.started) / 1000);
      }, 250);
      rec.timer = session.timer;
      startRecognitionV8(session);
      startPauseMonitorV8(session);
      if (typeof toast === 'function') toast('开始录音');
    } catch (error) {
      if (startButton) { startButton.disabled = false; startButton.textContent = '开始录音'; }
      const message = error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError'
        ? '麦克风权限被拒绝，请在浏览器的网站设置中允许麦克风。'
        : error.name === 'NotFoundError'
          ? '没有检测到可用麦克风。'
          : `录音启动失败：${error.message || error.name || '未知原因'}`;
      if (status) status.textContent = message;
      if (typeof toast === 'function') toast(message);
      activeCapture = null;
    }
  };

  stopRecording = function stopRecordingV8(silent = false) {
    const session = activeCapture;
    if (!session || session.stopping) return;
    session.stopping = true;
    stopRecognition(session);
    clearInterval(session.timer);
    session.timer = null;
    rec.timer = null;
    const host = getPanel(session.itemId);
    const status = host?.querySelector('.record-status');
    if (status) status.textContent = '正在保存录音，请稍等…';
    try { if (typeof session.media.requestData === 'function') session.media.requestData(); } catch (_) {}
    setTimeout(() => {
      try {
        if (session.media.state === 'recording') session.media.stop();
      } catch (_) {
        finalizeCapture(session);
      }
    }, 120);
    if (!silent && typeof toast === 'function') toast('正在保存录音');
  };

  async function finalizeCapture(session) {
    if (session.finalizing) return;
    session.finalizing = true;
    await wait(420);
    cleanupSession(session);
    const duration = Math.max(0, (Date.now() - session.started) / 1000);
    const type = session.media?.mimeType || session.chunks[0]?.type || 'audio/webm';
    const blob = new Blob(session.chunks, { type });
    const transcript = `${session.finalText || ''}${session.interim || ''}`.trim();
    const item = getItem(session.itemId);
    const host = getPanel(session.itemId);

    if (!blob.size || duration < 0.35) {
      if (host) {
        const start = host.querySelector('[data-record-start]');
        if (start) { start.disabled = false; start.textContent = '开始录音'; }
        const stop = host.querySelector('[data-record-stop]');
        if (stop) stop.disabled = true;
        const status = host.querySelector('.record-status');
        if (status) status.textContent = '没有录到有效声音，请重新录音。';
      }
      if (typeof toast === 'function') toast('没有录到有效声音');
      if (activeCapture === session) activeCapture = null;
      return;
    }

    const take = {
      id: session.takeId,
      itemId: session.itemId,
      part: item?.part || '',
      topic: item?.topic || '',
      question: item?.title || '',
      transcript,
      duration,
      pauses: session.pauses,
      mime: blob.type || type,
      createdAt: Date.now(),
      blob
    };
    const saveResult = await saveTake(take);
    lastCompleted = { ...session, duration, blob, transcript, item, saveResult };
    Object.assign(rec, {
      media: session.media,
      stream: null,
      chunks: session.chunks,
      started: session.started,
      recognition: null,
      finalText: transcript ? `${transcript} ` : '',
      interim: '',
      duration,
      itemId: session.itemId,
      pauses: session.pauses,
      blob,
      takeId: session.takeId
    });
    if (rec.url) { try { URL.revokeObjectURL(rec.url); } catch (_) {} }
    rec.url = URL.createObjectURL(blob);
    session.url = rec.url;
    if (activeCapture === session) activeCapture = null;
    if (typeof refreshSessionCount === 'function') await refreshSessionCount();

    if (host) {
      const start = host.querySelector('[data-record-start]');
      const stop = host.querySelector('[data-record-stop]');
      const analyze = host.querySelector('[data-record-analyze]');
      const copy = host.querySelector('[data-record-copy]');
      if (start) { start.disabled = false; start.textContent = '重新录音'; }
      if (stop) stop.disabled = true;
      if (analyze) analyze.disabled = false;
      if (copy) copy.disabled = !transcript;
      const editor = host.querySelector('.v8-transcript');
      if (editor) editor.value = transcript;
      setTranscriptState(host, transcript ? '转写完成，可手动修改' : '未获得自动转写，可手动输入', transcript ? 'v8-ok' : 'v8-warning');
      const status = host.querySelector('.record-status');
      if (status) status.textContent = saveResult?.persistent === false
        ? '录音已保留在当前页面，但浏览器持久存储失败；请尽快分享练习包。'
        : '录音已完成，并已校验存入本轮练习。';
      const saved = host.querySelector('.saved-note');
      if (saved) { saved.hidden = false; saved.textContent = saveResult?.persistent === false ? '已临时保存在当前页面' : '已校验存入本轮练习'; }
      const result = host.querySelector('.record-result');
      if (result) {
        result.hidden = false;
        const extension = typeof fileExt === 'function' ? fileExt(blob.type) : 'webm';
        result.innerHTML = `<b>录音完成 · ${typeof fmt === 'function' ? fmt(duration) : Math.round(duration) + '秒'}</b><audio controls preload="metadata" src="${rec.url}"></audio><div class="take-actions"><a download="ielts-${Date.now()}.${extension}" href="${rec.url}">单独下载本题</a><button type="button" class="delete-take" data-record-delete-current="true">删除这次录音</button></div>`;
      }
    } else if (typeof toast === 'function') {
      toast(saveResult?.persistent === false ? '上一题录音已临时保存' : '上一题录音已存入本轮');
    }
  }

  function cleanTranscript(text) {
    let result = text.trim();
    result = result
      .replace(/\bI\s+am\s+work(?:ing)?\s+as\b/gi, 'I work as')
      .replace(/\bI\s+am\s+agree\b/gi, 'I agree')
      .replace(/\bmy\s+job\s+(?:was\s+is|is\s+that|was\s+that)\b/gi, 'my job is to')
      .replace(/\bI\s+very\s+like\b/gi, 'I really like')
      .replace(/\bpeople\s+is\b/gi, 'people are')
      .replace(/\bthere\s+have\b/gi, 'there are')
      .replace(/\bmore\s+easier\b/gi, 'easier')
      .replace(/\bdiscuss\s+about\b/gi, 'discuss')
      .replace(/\b(\w+)\s+\1\b/gi, '$1')
      .replace(/\s+/g, ' ')
      .trim();
    if (result) result = result.charAt(0).toUpperCase() + result.slice(1);
    if (result && !/[.!?]$/.test(result)) result += '.';
    return result;
  }

  function grammarHints(text) {
    const hints = [];
    const add = (pattern, issue, suggestion) => { if (pattern.test(text)) hints.push({ issue, suggestion }); };
    add(/\bI\s+am\s+work(?:ing)?\s+as\b/i, '“I am work as” 的动词形式不对。', 'I work as a designer.');
    add(/\bI\s+am\s+agree\b/i, 'agree 通常不用 be 动词。', 'I agree with this idea.');
    add(/\bmy\s+job\s+(?:was\s+is|is\s+that|was\s+that)\b/i, '介绍工作内容时句型过于混乱。', 'My job is to design interfaces and solve design problems.');
    add(/\bI\s+very\s+like\b/i, 'very 不能直接修饰 like。', 'I really like it.');
    add(/\bpeople\s+is\b/i, 'people 是复数。', 'people are');
    add(/\bthere\s+have\b/i, '表示“有”通常用 there is/are。', 'there is / there are');
    add(/\bmore\s+easier\b/i, '比较级重复。', 'easier');
    add(/\bdiscuss\s+about\b/i, 'discuss 后面不需要 about。', 'discuss the issue');
    add(/\bbecause\b[^.!?]{0,140}\bso\b/i, 'because 和 so 通常不要放在同一个句子里。', '保留 because 或 so 其中一个。');
    add(/\b(?:he|she)\s+don't\b/i, '第三人称单数要用 doesn’t。', 'he/she doesn’t');
    add(/\bprefer\b[^.!?]{0,80}\bthan\b/i, 'prefer 常用 to，而不是 than。', 'I prefer A to B.');
    const repeated = text.match(/\b([A-Za-z]+)(?:\s+\1){1,}\b/i);
    if (repeated) hints.push({ issue: `出现连续重复：“${repeated[0]}”。`, suggestion: `只保留一次 “${repeated[1]}”。` });
    return hints.slice(0, 6);
  }

  localAnalyze = function localAnalyzeV8() {
    enhanceRecordPanels();
    const host = lastCompleted ? getPanel(lastCompleted.itemId) : (typeof panel === 'function' ? panel() : null);
    const item = lastCompleted?.item || (lastCompleted ? getItem(lastCompleted.itemId) : null) || (rec?.itemId ? getItem(rec.itemId) : null);
    if (!host || !item) return;
    const text = transcriptText(host);
    const words = text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || [];
    const duration = lastCompleted?.duration || rec.duration || 0;
    const pauses = lastCompleted?.pauses ?? rec.pauses ?? 0;
    const wpm = duration && words.length ? Math.round(words.length / (duration / 60)) : 0;
    const fillers = text.toLowerCase().match(/\b(um+|uh+|erm+|you know|i mean|like)\b/g) || [];
    const repeats = text.toLowerCase().match(/\b([a-z]+)\s+\1\b/g) || [];
    const hints = grammarHints(text);
    const structure = [];
    if (!text) structure.push('没有转写文本，因此只能保留录音，无法做语法检查。');
    if (item.part === 'p1' && words.length > 0 && words.length < 12) structure.push('回答偏短：补一个原因或具体场景。');
    if (item.part === 'p2' && words.length > 0 && words.length < 60) structure.push('Part 2 内容偏短：补背景、两个细节和最后感受。');
    if (/^why\b/i.test(item.title || '') && text && !/\b(because|since|the reason|mainly)\b/i.test(text)) structure.push('这是 why 问题，但转写里没有清楚的原因连接。');
    if (wpm && wpm < 85) structure.push('语速偏慢，可能花了较多时间搜索内容。');
    if (wpm > 175) structure.push('语速偏快，注意词尾和句子边界。');
    if (pauses >= 3) structure.push('长停顿较多；下一次只看三步记忆链再说。');
    if (fillers.length >= 3) structure.push(`填充词较多（${fillers.length}次），可用短停顿替代。`);
    if (!structure.length && text) structure.push('长度、语速和停顿没有触发明显警告。');

    const cleaned = cleanTranscript(text);
    const box = host.querySelector('.local-analysis');
    if (!box) return;
    box.hidden = false;
    box.innerHTML = `
      <b>本地即时分析（规则检查，不是雅思评分）</b>
      <div class="v8-analysis-grid">
        <div class="v8-metric"><b>${words.length || '—'}</b>转写词数</div>
        <div class="v8-metric"><b>${wpm || '—'}</b>词/分钟</div>
        <div class="v8-metric"><b>${pauses}</b>长停顿</div>
        <div class="v8-metric"><b>${fillers.length}</b>填充词</div>
        <div class="v8-metric"><b>${repeats.length}</b>连续重复</div>
      </div>
      <ul>${structure.map(note => `<li>${escapeText(note)}</li>`).join('')}</ul>
      ${hints.length ? `<div><b>可能需要修改</b>${hints.map(hint => `<div class="v8-fix">${escapeText(hint.issue)}<br><code>${escapeText(hint.suggestion)}</code></div>`).join('')}</div>` : (text ? '<p class="v8-ok">没有命中当前内置的高频语法错误。</p>' : '')}
      ${text ? `<details open><summary>整理后的转写</summary><div class="v8-clean">${escapeText(cleaned)}</div></details><p class="privacy-note">自动转写可能听错词，因此语法提示也可能受转写误差影响。</p>` : '<p class="v8-warning">当前没有自动转写。录音仍在本轮练习中；可在上方文本框手动输入后再次点击分析。</p>'}`;
  };

  copyTranscript = async function copyTranscriptV8() {
    const host = lastCompleted ? getPanel(lastCompleted.itemId) : null;
    const text = transcriptText(host);
    if (!text) { if (typeof toast === 'function') toast('当前没有转写文本'); return; }
    const item = lastCompleted?.item || getItem(lastCompleted?.itemId || rec.itemId);
    const output = `Question: ${item?.title || ''}\n\nTranscript:\n${text}`;
    try { await navigator.clipboard.writeText(output); if (typeof toast === 'function') toast('已复制问题和转写'); }
    catch (_) { if (typeof toast === 'function') toast('复制失败'); }
  };

  async function persistEditedTranscript(editor) {
    const host = editor.closest('[data-record-panel]');
    const itemId = host?.dataset.recordPanel;
    if (!itemId) return;
    const text = editor.value.trim();
    if (lastCompleted?.itemId === itemId) {
      lastCompleted.transcript = text;
      lastCompleted.finalText = text ? `${text} ` : '';
      rec.finalText = lastCompleted.finalText;
      rec.interim = '';
      try {
        const list = await allTakes();
        const take = list.find(entry => entry.id === lastCompleted.takeId);
        if (take) { take.transcript = text; await saveTake(take); }
      } catch (_) {}
      const copy = host.querySelector('[data-record-copy]');
      if (copy) copy.disabled = !text;
      setTranscriptState(host, '修改已保存');
    }
  }

  document.addEventListener('input', event => {
    const editor = event.target.closest?.('.v8-transcript');
    if (!editor) return;
    clearTimeout(transcriptSaveTimer);
    transcriptSaveTimer = setTimeout(() => persistEditedTranscript(editor), 450);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && activeCapture && !activeCapture.stopping) stopRecording(true);
  });
  window.addEventListener('pagehide', () => {
    if (activeCapture && !activeCapture.stopping) stopRecording(true);
  });

  if (typeof render === 'function') {
    const previousRender = render;
    render = function renderV8(...args) {
      const result = previousRender.apply(this, args);
      enhanceRecordPanels();
      return result;
    };
  }

  enhanceRecordPanels();
  window.__IELTS_RECALL_V8__ = { build: BUILD, enhanceRecordPanels, grammarHints, cleanTranscript };
})();