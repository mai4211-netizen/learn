(() => {
  'use strict';

  const DATA = window.IELTS538_DATA || { meta: {}, entries: [] };
  const entries = Array.isArray(DATA.entries) ? DATA.entries : [];
  const meta = DATA.meta || {};
  const storage = {
    get(key, fallback = '') {
      try { return window.localStorage?.getItem(key) ?? fallback; } catch (_) { return fallback; }
    },
    set(key, value) {
      try { window.localStorage?.setItem(key, value); } catch (_) {}
    },
  };

  function storedArray(key) {
    try {
      const parsed = JSON.parse(storage.get(key, '[]'));
      return Array.isArray(parsed) ? parsed.filter((value) => typeof value === 'string') : [];
    } catch (_) {
      return [];
    }
  }

  const state = {
    view: storage.get('ielts538.view') || 'card',
    category: storage.get('ielts538.category') || 'all',
    auditOnly: storage.get('ielts538.auditOnly') === '1',
    missedOnly: storage.get('ielts538.missedOnly') === '1',
    query: '',
    cardIndex: Number(storage.get('ielts538.cardIndex') || 0),
    reviewMode: storage.get('ielts538.reviewMode') || 'en',
    reviewQueue: [],
    reviewIndex: 0,
    reviewRevealed: false,
    missed: new Set(storedArray('ielts538.missed')),
    voiceURI: storage.get('ielts538.voiceURI') || '',
    speechRate: Number(storage.get('ielts538.speechRate') || 0.86),
  };

  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  function normalize(text) {
    return String(text || '').trim().toLocaleLowerCase();
  }

  function auditLabel(level) {
    if (level === 'danger') return '明确错误';
    if (level === 'warn') return '需按语境';
    if (level === 'info') return '结构考点';
    return '原书记录';
  }

  function categoryLabel(entry) {
    return `C${entry.category}${entry.rank ? ` · #${entry.rank}` : ''}`;
  }

  function filterSummary(list) {
    const parts = [];
    if (state.category !== 'all') parts.push(`C${state.category}`);
    if (state.auditOnly) parts.push('疑点');
    if (state.missedOnly) parts.push('错词');
    if (state.query.trim()) parts.push(`搜索 ${list.length}`);
    return parts.length
      ? `${parts.join(' · ')} · ${list.length} 条`
      : `C1 ${meta.categoryCounts?.['1'] ?? 20} · C2 ${meta.categoryCounts?.['2'] ?? 100} · C3 ${meta.categoryCounts?.['3'] ?? 256}`;
  }

  function filteredEntries() {
    const q = normalize(state.query);
    return entries.filter((entry) => {
      if (state.category !== 'all' && String(entry.category) !== state.category) return false;
      if (state.auditOnly && !['warn', 'danger'].includes(entry.auditLevel)) return false;
      if (state.missedOnly && !state.missed.has(entry.id)) return false;
      if (!q) return true;
      const haystack = [entry.term, entry.sourceTerm, entry.meaning, entry.sourceMeaning, entry.sourceMapping, entry.auditNote]
        .map(normalize).join(' ');
      return haystack.includes(q);
    });
  }

  function clampCardIndex(list) {
    if (!list.length) { state.cardIndex = 0; return; }
    state.cardIndex = Math.max(0, Math.min(state.cardIndex, list.length - 1));
  }

  function saveMissed() {
    storage.set('ielts538.missed', JSON.stringify([...state.missed]));
    updateMissedFilterLabel();
  }

  function updateMissedFilterLabel() {
    const button = $('missed-filter');
    if (!button) return;
    button.textContent = `只看错词 ${state.missed.size}`;
    button.setAttribute('aria-pressed', String(state.missedOnly));
  }

  function updateAuditCount() {
    const danger = entries.filter((entry) => entry.auditLevel === 'danger').length;
    const warn = entries.filter((entry) => entry.auditLevel === 'warn').length;
    $('audit-count').textContent = `${danger + warn} 条疑点 · ${danger} 条明确错误`;
  }

  function setView(view) {
    if (!['card', 'list', 'review'].includes(view)) view = 'card';
    state.view = view;
    storage.set('ielts538.view', view);
    document.querySelectorAll('.tab').forEach((button) => {
      const active = button.dataset.view === view;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('[data-view-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.viewPanel === view));
    $('card-footer').classList.toggle('hidden', view !== 'card');
    if (view === 'card') renderCard();
    if (view === 'list') renderList();
    if (view === 'review') restartReview(false);
  }

  function setCategory(category) {
    state.category = ['1', '2', '3'].includes(category) ? category : 'all';
    state.cardIndex = 0;
    storage.set('ielts538.category', state.category);
    document.querySelectorAll('.scope-btn').forEach((button) => button.classList.toggle('active', button.dataset.category === state.category));
    refreshCurrentView(true);
  }

  function setAuditOnly(active) {
    state.auditOnly = Boolean(active);
    state.cardIndex = 0;
    storage.set('ielts538.auditOnly', state.auditOnly ? '1' : '0');
    $('audit-filter').setAttribute('aria-pressed', String(state.auditOnly));
    refreshCurrentView(true);
  }

  function setMissedOnly(active) {
    state.missedOnly = Boolean(active);
    state.cardIndex = 0;
    storage.set('ielts538.missedOnly', state.missedOnly ? '1' : '0');
    updateMissedFilterLabel();
    refreshCurrentView(true);
  }

  function refreshCurrentView(resetReview = false) {
    if (state.view === 'card') renderCard();
    if (state.view === 'list') renderList();
    if (state.view === 'review') restartReview(resetReview);
  }

  function renderCard() {
    const list = filteredEntries();
    clampCardIndex(list);
    if (!list.length) {
      $('card-badges').innerHTML = '<span class="badge">无结果</span>';
      $('card-source-page').textContent = '';
      $('card-term').textContent = state.missedOnly && !state.missed.size ? '还没有错词' : '没有匹配条目';
      $('card-meaning').textContent = state.missedOnly && !state.missed.size ? '在自测里点“没记住”，这里会自动收集。' : '换一个搜索词或筛选范围。';
      $('card-mappings').innerHTML = '<span class="mapping-empty">—</span>';
      $('card-audit').className = 'audit-box hidden';
      $('source-term').textContent = '—';
      $('source-meaning').textContent = '—';
      $('source-mapping').textContent = '—';
      $('card-progress').textContent = '0 / 0';
      $('card-progress-sub').textContent = filterSummary(list);
      $('prev-card').disabled = true;
      $('next-card').disabled = true;
      return;
    }

    const entry = list[state.cardIndex];
    storage.set('ielts538.cardIndex', String(state.cardIndex));
    const badges = [
      `<span class="badge">${esc(categoryLabel(entry))}</span>`,
      `<span class="badge ${esc(entry.auditLevel)}">${esc(auditLabel(entry.auditLevel))}</span>`,
    ];
    if (state.missed.has(entry.id)) badges.push('<span class="badge missed">错词</span>');
    $('card-badges').innerHTML = badges.join('');
    $('card-source-page').textContent = entry.sourcePage ? `PDF p.${entry.sourcePage}` : '';
    $('card-term').textContent = entry.term;
    $('card-meaning').textContent = entry.meaning || '—';
    $('card-mappings').innerHTML = entry.mappingItems?.length
      ? entry.mappingItems.map((item) => `<span class="mapping-chip">${esc(item)}</span>`).join('')
      : '<span class="mapping-empty">原书未列关联表达</span>';

    const auditBox = $('card-audit');
    if (entry.auditNote) {
      auditBox.className = `audit-box ${entry.auditLevel}`;
      $('card-audit-title').textContent = auditLabel(entry.auditLevel);
      $('card-audit-text').textContent = entry.auditNote;
    } else {
      auditBox.className = 'audit-box hidden';
    }

    $('source-term').textContent = entry.sourceTerm || entry.term;
    $('source-meaning').textContent = entry.sourceMeaning || '—';
    $('source-mapping').textContent = entry.sourceMapping || '—';
    $('source-row').open = false;
    $('card-progress').textContent = `${state.cardIndex + 1} / ${list.length}`;
    $('card-progress-sub').textContent = filterSummary(list);
    $('prev-card').disabled = state.cardIndex <= 0;
    $('next-card').disabled = state.cardIndex >= list.length - 1;
  }

  function moveCard(delta, shouldSpeak = true) {
    const list = filteredEntries();
    if (!list.length) return;
    const next = Math.max(0, Math.min(list.length - 1, state.cardIndex + delta));
    if (next === state.cardIndex) return;
    state.cardIndex = next;
    renderCard();
    const entry = list[state.cardIndex];
    if (entry && shouldSpeak) speak(entry.term);
  }

  function renderList() {
    const list = filteredEntries();
    $('list-count').textContent = String(list.length);
    if (!list.length) {
      $('word-list').innerHTML = `<div class="empty-state">${state.missedOnly && !state.missed.size ? '还没有错词。先去自测，点“没记住”即可自动收集。' : '没有匹配条目。'}</div>`;
      return;
    }
    $('word-list').innerHTML = list.map((entry) => `
      <button class="list-row" type="button" data-entry-id="${esc(entry.id)}">
        <div class="list-term">
          <strong>${esc(entry.term)}</strong>
          <div class="list-meta"><span>${esc(categoryLabel(entry))}</span><span>${entry.sourcePage ? `PDF p.${esc(entry.sourcePage)}` : ''}</span>${state.missed.has(entry.id) ? '<span class="list-missed">错词</span>' : ''}</div>
        </div>
        <div class="list-meaning">${esc(entry.meaning || '—')}</div>
        <div class="list-mapping">${esc(entry.mappingItems?.join(', ') || entry.sourceMapping || '—')}</div>
        <span class="list-audit ${esc(entry.auditLevel)}" title="${esc(auditLabel(entry.auditLevel))}"></span>
      </button>`).join('');
  }

  function openEntryFromList(id) {
    const target = entries.find((entry) => entry.id === id);
    if (!target) return;
    state.query = '';
    $('search-input').value = '';
    state.category = 'all';
    state.auditOnly = false;
    state.missedOnly = false;
    storage.set('ielts538.category', 'all');
    storage.set('ielts538.auditOnly', '0');
    storage.set('ielts538.missedOnly', '0');
    $('audit-filter').setAttribute('aria-pressed', 'false');
    updateMissedFilterLabel();
    document.querySelectorAll('.scope-btn').forEach((button) => button.classList.toggle('active', button.dataset.category === 'all'));
    const list = filteredEntries();
    state.cardIndex = Math.max(0, list.findIndex((entry) => entry.id === id));
    setView('card');
  }

  function shuffle(items) {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function buildReviewQueue(list) {
    const missed = [];
    const rest = [];
    list.forEach((entry) => (state.missed.has(entry.id) ? missed : rest).push(entry.id));
    return [...shuffle(missed), ...shuffle(rest)];
  }

  function restartReview(forceShuffle = true) {
    const list = filteredEntries();
    const allowed = new Set(list.map((entry) => entry.id));
    const queueInvalid = state.reviewQueue.some((id) => !allowed.has(id));
    if (forceShuffle || !state.reviewQueue.length || queueInvalid) {
      state.reviewQueue = buildReviewQueue(list);
      state.reviewIndex = 0;
    } else {
      state.reviewQueue = state.reviewQueue.filter((id) => allowed.has(id));
      if (state.reviewIndex >= state.reviewQueue.length) state.reviewIndex = 0;
    }
    state.reviewRevealed = false;
    renderReview();
  }

  function currentReviewEntry() {
    const id = state.reviewQueue[state.reviewIndex];
    return entries.find((entry) => entry.id === id) || null;
  }

  function renderReview() {
    const entry = currentReviewEntry();
    const has = Boolean(entry);
    $('review-question').disabled = !has;
    $('reveal-answer').disabled = !has;
    if (!has) {
      $('review-kicker').textContent = '';
      $('review-question').textContent = state.missedOnly && !state.missed.size ? '还没有错词' : '没有可复习条目';
      $('review-answer-wrap').classList.add('hidden');
      $('reveal-answer').classList.add('hidden');
      $('review-actions').classList.add('hidden');
      $('review-progress').textContent = state.missedOnly && !state.missed.size ? '先关闭“只看错词”，做题时把不会的词标为“没记住”。' : '调整搜索或筛选范围后再试。';
      return;
    }

    $('reveal-answer').classList.remove('hidden');
    $('review-kicker').textContent = `${categoryLabel(entry)}${entry.sourcePage ? ` · PDF p.${entry.sourcePage}` : ''}${state.missed.has(entry.id) ? ' · 错词' : ''}`;
    if (state.reviewMode === 'en') {
      $('review-question').textContent = entry.term;
      $('review-answer').textContent = entry.meaning;
    } else {
      $('review-question').textContent = entry.meaning;
      $('review-answer').textContent = entry.term;
    }
    $('review-mapping').textContent = entry.mappingItems?.length
      ? `原书关联表达：${entry.mappingItems.join(', ')}`
      : '原书未列关联表达';
    const audit = $('review-audit');
    if (entry.auditNote) {
      audit.textContent = `${auditLabel(entry.auditLevel)}：${entry.auditNote}`;
      audit.className = `review-audit ${entry.auditLevel}`;
    } else {
      audit.className = 'review-audit hidden';
    }
    $('review-answer-wrap').classList.toggle('hidden', !state.reviewRevealed);
    $('reveal-answer').classList.toggle('hidden', state.reviewRevealed);
    $('review-actions').classList.toggle('hidden', !state.reviewRevealed);
    $('review-progress').textContent = `${state.reviewIndex + 1} / ${state.reviewQueue.length} · 错词 ${state.missed.size}`;
  }

  function revealReview() {
    if (!currentReviewEntry()) return;
    state.reviewRevealed = true;
    renderReview();
  }

  function markReview(known) {
    const entry = currentReviewEntry();
    if (!entry) return;
    if (known) state.missed.delete(entry.id); else state.missed.add(entry.id);
    saveMissed();

    if (state.missedOnly && known) {
      state.reviewQueue = state.reviewQueue.filter((id) => id !== entry.id && state.missed.has(id));
      if (state.reviewIndex >= state.reviewQueue.length) state.reviewIndex = 0;
    } else {
      state.reviewIndex += 1;
      if (state.reviewIndex >= state.reviewQueue.length) {
        const list = filteredEntries();
        state.reviewQueue = buildReviewQueue(list);
        state.reviewIndex = 0;
      }
    }
    state.reviewRevealed = false;
    renderReview();
  }

  function setReviewMode(mode) {
    state.reviewMode = mode === 'zh' ? 'zh' : 'en';
    storage.set('ielts538.reviewMode', state.reviewMode);
    document.querySelectorAll('.review-mode').forEach((button) => button.classList.toggle('active', button.dataset.reviewMode === state.reviewMode));
    state.reviewRevealed = false;
    renderReview();
  }

  function populateVoices() {
    if (!('speechSynthesis' in window)) return;
    const voices = speechSynthesis.getVoices().filter((voice) => /^en[-_]/i.test(voice.lang));
    const select = $('voice-select');
    const current = state.voiceURI;
    select.innerHTML = '<option value="">自动选择</option>' + voices.map((voice) => `<option value="${esc(voice.voiceURI)}">${esc(voice.name)} · ${esc(voice.lang)}</option>`).join('');
    if (voices.some((voice) => voice.voiceURI === current)) select.value = current;
  }

  function preferredVoice() {
    const voices = speechSynthesis.getVoices().filter((voice) => /^en[-_]/i.test(voice.lang));
    if (state.voiceURI) {
      const selected = voices.find((voice) => voice.voiceURI === state.voiceURI);
      if (selected) return selected;
    }
    const scored = voices.map((voice) => {
      const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
      let score = 0;
      if (/en-US/i.test(voice.lang)) score += 8;
      if (/natural|neural|premium|enhanced/.test(name)) score += 6;
      if (/samantha|ava|jenny|aria|allison|google us english/.test(name)) score += 4;
      if (/whisper|novelty|trinoids|zarvox|boing/.test(name)) score -= 20;
      return { voice, score };
    }).sort((a, b) => b.score - a.score);
    return scored[0]?.voice || voices[0] || null;
  }

  function speak(text) {
    if (!text || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = preferredVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'en-US';
    } else utterance.lang = 'en-US';
    utterance.rate = state.speechRate;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }

  function bindSwipe() {
    const card = $('study-card');
    let start = null;
    card.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'touch') return;
      start = { x: event.clientX, y: event.clientY };
    }, { passive: true });
    card.addEventListener('pointerup', (event) => {
      if (!start || event.pointerType !== 'touch') return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
      moveCard(dx < 0 ? 1 : -1, true);
    }, { passive: true });
    card.addEventListener('pointercancel', () => { start = null; });
  }

  function bindEvents() {
    document.querySelectorAll('.tab').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
    document.querySelectorAll('.scope-btn').forEach((button) => button.addEventListener('click', () => setCategory(button.dataset.category)));
    $('audit-filter').addEventListener('click', () => setAuditOnly(!state.auditOnly));
    $('missed-filter').addEventListener('click', () => setMissedOnly(!state.missedOnly));
    $('search-input').addEventListener('input', (event) => { state.query = event.target.value; state.cardIndex = 0; refreshCurrentView(true); });
    $('prev-card').addEventListener('click', () => moveCard(-1));
    $('next-card').addEventListener('click', () => moveCard(1));
    $('card-term').addEventListener('click', () => { const entry = filteredEntries()[state.cardIndex]; if (entry) speak(entry.term); });
    $('card-speak').addEventListener('click', () => { const entry = filteredEntries()[state.cardIndex]; if (entry) speak(entry.term); });
    $('word-list').addEventListener('click', (event) => { const row = event.target.closest('[data-entry-id]'); if (row) openEntryFromList(row.dataset.entryId); });
    document.querySelectorAll('.review-mode').forEach((button) => button.addEventListener('click', () => setReviewMode(button.dataset.reviewMode)));
    $('restart-review').addEventListener('click', () => restartReview(true));
    $('reveal-answer').addEventListener('click', revealReview);
    $('mark-known').addEventListener('click', () => markReview(true));
    $('mark-missed').addEventListener('click', () => markReview(false));
    $('review-question').addEventListener('click', () => { const entry = currentReviewEntry(); if (entry && state.reviewMode === 'en') speak(entry.term); });
    $('voice-select').addEventListener('change', (event) => { state.voiceURI = event.target.value; storage.set('ielts538.voiceURI', state.voiceURI); });
    $('speech-rate').addEventListener('input', (event) => {
      const rate = Number(event.target.value);
      state.speechRate = Number.isFinite(rate) ? rate : 0.86;
      $('rate-value').textContent = `${state.speechRate.toFixed(2)}×`;
      storage.set('ielts538.speechRate', String(state.speechRate));
    });
    document.addEventListener('keydown', (event) => {
      if ((event.key === '/' || event.key === 'f') && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.matches('input, select, textarea')) {
        event.preventDefault();
        $('search-input').focus();
        return;
      }
      if (event.target.matches('input, select, textarea')) return;
      if (state.view === 'card' && event.key === 'ArrowLeft') moveCard(-1);
      if (state.view === 'card' && event.key === 'ArrowRight') moveCard(1);
      if (state.view === 'card' && (event.key === 's' || event.key === 'S')) { const entry = filteredEntries()[state.cardIndex]; if (entry) speak(entry.term); }
      if (state.view === 'review' && (event.code === 'Space' || event.key === 'Enter') && !state.reviewRevealed) { event.preventDefault(); revealReview(); return; }
      if (state.view === 'review' && state.reviewRevealed && (event.key === 'ArrowLeft' || event.key === '1')) { event.preventDefault(); markReview(false); }
      if (state.view === 'review' && state.reviewRevealed && (event.key === 'ArrowRight' || event.key === '2')) { event.preventDefault(); markReview(true); }
    });
    bindSwipe();
  }

  function init() {
    $('brand-subtitle').textContent = `${meta.coreCount || entries.length} 个核心条目 · 按原始 PDF 重构`;
    $('method-note').textContent = meta.methodNote || '';
    $('audit-note').textContent = meta.auditNote || '';
    $('source-origin').textContent = meta.source || '';
    updateAuditCount();
    updateMissedFilterLabel();
    $('rate-value').textContent = `${state.speechRate.toFixed(2)}×`;
    $('speech-rate').value = String(state.speechRate);
    $('audit-filter').setAttribute('aria-pressed', String(state.auditOnly));
    document.querySelectorAll('.scope-btn').forEach((button) => button.classList.toggle('active', button.dataset.category === state.category));
    document.querySelectorAll('.review-mode').forEach((button) => button.classList.toggle('active', button.dataset.reviewMode === state.reviewMode));
    bindEvents();
    populateVoices();
    if ('speechSynthesis' in window) speechSynthesis.addEventListener?.('voiceschanged', populateVoices);
    setView(state.view);
  }

  init();
})();
