(() => {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    .question-audio-title {
      position: relative;
      cursor: pointer;
      border-radius: 12px;
      padding: 8px 10px;
      margin-left: -10px !important;
      margin-right: -10px !important;
      min-height: 58px;
      transition: background .18s ease, color .18s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .question-audio-title:hover,
    .question-audio-title:focus-visible { background: #f0ece3; outline: none; }
    .question-audio-title.question-concealed {
      color: transparent !important;
      user-select: none;
    }
    .question-audio-title.question-concealed::after {
      content: '点击显示题目并重播';
      position: absolute;
      inset: 8px 10px;
      display: flex;
      align-items: center;
      color: #6b706c;
      font: 600 14px/1.45 Inter, "PingFang SC", sans-serif;
      letter-spacing: 0;
    }
    .record-result .take-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
      margin-top: 10px;
    }
    .record-result .take-actions a,
    .record-result .take-actions button {
      min-height: 40px;
      border: 1px solid #d8d2c5;
      border-radius: 999px;
      background: #fffdf8;
      color: #202321;
      padding: 7px 12px;
      font: inherit;
      text-decoration: none;
      cursor: pointer;
    }
    .record-result .take-actions .delete-take { color: #9b322d; border-color: #dba29c; }
    @media (max-width: 650px) {
      .question-audio-title { min-height: 68px; padding: 10px 12px; margin-left: -12px !important; margin-right: -12px !important; }
      .question-audio-title.question-concealed::after { inset: 10px 12px; }
      .record-result .take-actions { display: grid; grid-template-columns: 1fr 1fr; }
      .record-result .take-actions a,
      .record-result .take-actions button { display: grid; place-items: center; width: 100%; min-height: 44px; }
    }
  `;
  document.head.appendChild(style);

  let previousCardId = '';
  let revealedCardId = '';

  function speakQuestion(text) {
    if (!text || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return false;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.88;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (_) {
      return false;
    }
  }

  function prepareQuestionTitle() {
    if (typeof cardMode === 'undefined' || !cardMode) return;
    const title = document.querySelector('.learning-card .card-head h2');
    if (!title) return;

    const text = title.textContent.trim();
    title.classList.add('question-audio-title');
    title.dataset.questionText = text;
    title.setAttribute('role', 'button');
    title.setAttribute('tabindex', '0');
    title.setAttribute('title', '点击显示题目并重新朗读');

    const changed = currentCardId !== previousCardId;
    if (changed) {
      previousCardId = currentCardId;
      revealedCardId = '';
    }

    const revealAndReplay = () => {
      title.classList.remove('question-concealed');
      title.setAttribute('aria-label', text + '。点击重新朗读');
      revealedCardId = currentCardId;
      speakQuestion(text);
    };

    title.addEventListener('click', revealAndReplay);
    title.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        revealAndReplay();
      }
    });

    if (revealedCardId !== currentCardId) {
      title.classList.add('question-concealed');
      title.setAttribute('aria-label', '题目已隐藏。点击显示并重新朗读');
    }

    if (changed) speakQuestion(text);
  }

  if (typeof render === 'function' && typeof filtered === 'function') {
    const originalRender = render;
    render = function patchedRender(...args) {
      if (typeof cardMode !== 'undefined' && cardMode) {
        const list = filtered();
        if (list.length && !list.some(item => item.id === currentCardId)) {
          currentCardId = list[0].id;
        }
      }
      const result = originalRender.apply(this, args);
      prepareQuestionTitle();
      return result;
    };
  }

  function addDeleteButton() {
    const host = typeof panel === 'function' ? panel() : null;
    const result = host?.querySelector('.record-result');
    if (!result || result.hidden || result.querySelector('[data-record-delete-current]')) return;

    const download = result.querySelector('a[download]');
    const actions = document.createElement('div');
    actions.className = 'take-actions';
    if (download) actions.appendChild(download);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete-take';
    remove.dataset.recordDeleteCurrent = 'true';
    remove.textContent = '删除这次录音';
    actions.appendChild(remove);
    result.appendChild(actions);
  }

  if (typeof finishRecording === 'function') {
    const originalFinishRecording = finishRecording;
    finishRecording = async function patchedFinishRecording(...args) {
      const result = await originalFinishRecording.apply(this, args);
      addDeleteButton();
      return result;
    };
  }

  async function deleteCurrentTake() {
    const host = typeof panel === 'function' ? panel() : null;
    const takeId = typeof rec !== 'undefined' ? rec.takeId : '';
    if (!host || !takeId) return;
    if (!window.confirm('删除这次录音并从本轮练习中移除？')) return;

    try {
      if (typeof deleteTake === 'function') await deleteTake(takeId);
      if (typeof refreshSessionCount === 'function') await refreshSessionCount();
      if (rec.url) {
        URL.revokeObjectURL(rec.url);
        rec.url = '';
      }
      rec.blob = null;
      rec.finalText = '';
      rec.interim = '';
      rec.duration = 0;
      rec.pauses = 0;
      rec.takeId = '';

      const start = host.querySelector('[data-record-start]');
      const stop = host.querySelector('[data-record-stop]');
      const analyze = host.querySelector('[data-record-analyze]');
      const copy = host.querySelector('[data-record-copy]');
      if (start) { start.disabled = false; start.textContent = '开始录音'; }
      if (stop) stop.disabled = true;
      if (analyze) analyze.disabled = true;
      if (copy) copy.disabled = true;

      const result = host.querySelector('.record-result');
      if (result) { result.hidden = true; result.innerHTML = ''; }
      const analysis = host.querySelector('.local-analysis');
      if (analysis) { analysis.hidden = true; analysis.innerHTML = ''; }
      const saved = host.querySelector('.saved-note');
      if (saved) saved.hidden = true;
      const live = host.querySelector('.live-text');
      if (live) live.textContent = '';
      const time = host.querySelector('.record-time');
      if (time) time.textContent = '00:00';
      const status = host.querySelector('.record-status');
      if (status) status.textContent = '本题录音已删除，可以重新录音。';
      if (typeof toast === 'function') toast('已删除本题录音');
    } catch (_) {
      if (typeof toast === 'function') toast('删除失败，请重试');
    }
  }

  document.addEventListener('click', event => {
    if (event.target.closest('[data-record-delete-current]')) {
      event.preventDefault();
      deleteCurrentTake();
    }
  });

  prepareQuestionTitle();
})();
