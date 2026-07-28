(() => {
  'use strict';

  const BUILD = 'v9';
  const previousSaveTake = typeof saveTake === 'function' ? saveTake : null;
  const previousDeleteTake = typeof deleteTake === 'function' ? deleteTake : null;
  const previousRefreshSessionCount = typeof refreshSessionCount === 'function' ? refreshSessionCount : null;
  const checks = new Map();

  const style = document.createElement('style');
  style.textContent = `
    .v9-audio-check{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px;font-size:12px}
    .v9-audio-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border-radius:999px;background:#e9f4ef;color:#285849;font-weight:700}
    .v9-audio-badge.warn{background:#fff0df;color:#8a4c13}.v9-audio-badge.bad{background:#fde9e7;color:#9b322d}
    .v9-audio-actions{display:flex;gap:7px;flex-wrap:wrap}.v9-audio-actions button{min-height:38px}
    .v9-shell-link{display:inline-flex;align-items:center;justify-content:center;margin-left:8px;padding:8px 12px;border:1px solid var(--line);border-radius:999px;text-decoration:none;color:var(--ink);background:var(--card);font-size:13px;font-weight:700}
    .v9-shell-link:hover{border-color:var(--green);color:var(--green)}
    @media(max-width:650px){.v9-audio-actions{display:grid;grid-template-columns:1fr 1fr;width:100%}.v9-audio-actions button{width:100%}.v9-shell-link{margin:7px 0 0;width:100%}}
  `;
  document.head.appendChild(style);

  function notify(text) {
    if (typeof toast === 'function') toast(text);
  }

  function getPanel(itemId) {
    return [...document.querySelectorAll('[data-record-panel]')]
      .find(node => node.dataset.recordPanel === itemId) || null;
  }

  async function decodeCheck(blob) {
    if (!(blob instanceof Blob) || blob.size < 1200) {
      return { ok: false, state: 'invalid', reason: '录音文件为空或过小' };
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return { ok: null, state: 'unknown', reason: '浏览器无法自动检测音量' };
    }
    let context;
    try {
      context = new AudioContextClass();
      const buffer = await context.decodeAudioData((await blob.arrayBuffer()).slice(0));
      const duration = Number(buffer.duration || 0);
      if (!Number.isFinite(duration) || duration < 0.45 || !buffer.length) {
        return { ok: false, state: 'invalid', reason: '录音时长无效' };
      }
      let sumSquares = 0;
      let peak = 0;
      let voiced = 0;
      let samples = 0;
      const step = Math.max(1, Math.floor(buffer.length / 120000));
      for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
        const data = buffer.getChannelData(channel);
        for (let index = 0; index < data.length; index += step) {
          const value = Math.abs(data[index]);
          peak = Math.max(peak, value);
          sumSquares += value * value;
          if (value > 0.008) voiced += 1;
          samples += 1;
        }
      }
      const rms = samples ? Math.sqrt(sumSquares / samples) : 0;
      const voicedRatio = samples ? voiced / samples : 0;
      const silent = peak < 0.006 || rms < 0.00065 || voicedRatio < 0.0008;
      if (silent) {
        return { ok: false, state: 'silent', reason: '检测不到有效人声', duration, peak, rms, voicedRatio };
      }
      return { ok: true, state: 'verified', reason: '已检测到有效声音', duration, peak, rms, voicedRatio };
    } catch (error) {
      return { ok: null, state: 'unknown', reason: '音频格式无法自动检测', error: error?.message || String(error) };
    } finally {
      try { await context?.close(); } catch (_) {}
    }
  }

  async function removeRejectedTake(take) {
    try { if (previousDeleteTake) await previousDeleteTake(take.id); } catch (_) {}
    try { if (previousRefreshSessionCount) await previousRefreshSessionCount(); } catch (_) {}
  }

  function resetRejectedPanel(take, check) {
    const host = getPanel(take.itemId);
    if (!host) return;
    const start = host.querySelector('[data-record-start]');
    const stop = host.querySelector('[data-record-stop]');
    const analyze = host.querySelector('[data-record-analyze]');
    const copy = host.querySelector('[data-record-copy]');
    if (start) { start.disabled = false; start.textContent = '重新录音'; }
    if (stop) stop.disabled = true;
    if (analyze) analyze.disabled = true;
    if (copy) copy.disabled = true;
    const result = host.querySelector('.record-result');
    if (result) {
      result.hidden = false;
      result.innerHTML = `<div class="v9-audio-check"><span class="v9-audio-badge bad">录音未保存</span><span>${check.reason}，请重新录音。</span></div>`;
    }
    const saved = host.querySelector('.saved-note');
    if (saved) saved.hidden = true;
    const status = host.querySelector('.record-status');
    if (status) status.textContent = `${check.reason}。这次录音没有加入本轮练习。`;
    try {
      if (typeof rec !== 'undefined' && rec.takeId === take.id) {
        if (rec.url) URL.revokeObjectURL(rec.url);
        rec.url = '';
        rec.blob = null;
        rec.takeId = '';
      }
    } catch (_) {}
    notify(`${check.reason}，请重新录音`);
  }

  function installPlayerCheck(take, check) {
    const host = getPanel(take.itemId);
    if (!host) return;
    const result = host.querySelector('.record-result');
    const audio = result?.querySelector('audio');
    if (!result || !audio) return;
    if (result.querySelector('.v9-audio-check')) return;

    const row = document.createElement('div');
    row.className = 'v9-audio-check';
    const badgeClass = check.ok === true ? '' : 'warn';
    const badgeText = check.ok === true ? '声音已验证' : '已保存，待试听';
    row.innerHTML = `<span class="v9-audio-badge ${badgeClass}">${badgeText}</span><div class="v9-audio-actions"><button type="button" data-v9-play>播放 / 暂停</button><button type="button" data-v9-reload>重新载入音频</button></div>`;
    result.appendChild(row);

    const status = host.querySelector('.record-status');
    if (status) status.textContent = check.ok === true
      ? '录音已检测到有效声音，并已存入本轮练习。'
      : '录音已存入本轮练习，但此浏览器无法自动检测音量；请先试听。';
    const saved = host.querySelector('.saved-note');
    if (saved) saved.textContent = check.ok === true ? '已验证声音并存入本轮练习' : '已存入本轮练习，请先试听';

    let advanced = false;
    audio.addEventListener('timeupdate', () => {
      if (!advanced && audio.currentTime > 0.08) {
        advanced = true;
        const badge = row.querySelector('.v9-audio-badge');
        if (badge) { badge.textContent = '播放正常'; badge.classList.remove('warn', 'bad'); }
      }
    });
    audio.addEventListener('error', async () => {
      const badge = row.querySelector('.v9-audio-badge');
      if (badge) { badge.textContent = '音频无法播放'; badge.classList.add('bad'); }
      if (status) status.textContent = '音频无法播放。建议删除本题并重新录音。';
    });
  }

  if (previousSaveTake) {
    saveTake = async function saveTakeV9(take) {
      const check = await decodeCheck(take.blob);
      checks.set(take.id, check);
      take.audioCheck = {
        state: check.state,
        duration: check.duration || take.duration || 0,
        peak: check.peak || 0,
        rms: check.rms || 0,
        checkedAt: Date.now()
      };
      if (check.ok === false) {
        await removeRejectedTake(take);
        setTimeout(() => resetRejectedPanel(take, check), 80);
        return { persistent: false, rejected: true, reason: check.reason };
      }
      const result = await previousSaveTake(take);
      setTimeout(() => installPlayerCheck(take, check), 100);
      return { ...result, audioVerified: check.ok === true, audioCheck: check };
    };
  }

  document.addEventListener('click', async event => {
    const play = event.target.closest?.('[data-v9-play]');
    if (play) {
      const host = play.closest('.record-panel');
      const audio = host?.querySelector('.record-result audio');
      if (!audio) return;
      try {
        if (!audio.paused) { audio.pause(); return; }
        if (!Number.isFinite(audio.duration) || audio.currentTime >= Math.max(0, audio.duration - 0.2)) {
          audio.currentTime = 0;
        }
        await audio.play();
      } catch (_) {
        audio.load();
        notify('音频已重新载入，请再点一次播放');
      }
      return;
    }
    const reload = event.target.closest?.('[data-v9-reload]');
    if (reload) {
      const host = reload.closest('.record-panel');
      const audio = host?.querySelector('.record-result audio');
      if (!audio) return;
      try { audio.pause(); audio.currentTime = 0; audio.load(); } catch (_) {}
      notify('音频已重新载入');
    }
  });

  function addShellLink() {
    if (document.querySelector('.v9-shell-link')) return;
    const learning = document.querySelector('#learningMode');
    if (!learning) return;
    const link = document.createElement('a');
    link.className = 'v9-shell-link';
    link.href = '../ielts-speaking-sentence-shells/';
    link.textContent = '句子主干训练';
    learning.insertAdjacentElement('afterend', link);
  }

  addShellLink();
  if (typeof render === 'function') {
    const previousRender = render;
    render = function renderV9(...args) {
      const value = previousRender.apply(this, args);
      addShellLink();
      return value;
    };
  }

  window.__IELTS_RECALL_V9__ = { build: BUILD, decodeCheck, checks };
})();