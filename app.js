(() => {
  const raw = window.IELTS538_DATA || window.__IELTS_DATA__ || {};
  const source = raw.entries || raw.coreData || [];
  const entries = source.map((e, i) => ({
    id: e.id || `w-${i}`,
    term: e.term || e.word || '',
    meaning: e.meaning || e.meaning_cn || '',
    sourceMeaning: e.sourceMeaning || e.meaning_cn || '',
    sourceTerm: e.sourceTerm || e.term || e.word || '',
    sourceMapping: e.sourceMapping || (e.replacement?.words || e.replacements || []).join?.(', ') || '',
    mappingItems: e.mappingItems || e.replacement?.words || e.replacements || [],
    category: Number(e.categoryId || String(e.category || '').match(/\d+/)?.[0] || 3),
    rank: e.rank || (i < 120 ? i + 1 : null),
    sourcePage: e.sourcePage || '',
    auditLevel: e.auditLevel || 'source',
    auditNote: e.auditNote || ''
  }));
  let view = 'card', category = 'all', query = '', auditOnly = false, index = 0, review = [], reviewIndex = 0, reviewMode = 'en';
  const $ = id => document.getElementById(id);
  const label = e => `C${e.category}${e.rank ? ` · #${e.rank}` : ''}`;
  const auditName = l => l === 'danger' ? '明显疑误' : l === 'warn' ? '需按语境' : l === 'info' ? '结构考点' : '原书原文';
  const list = () => entries.filter(e => (category === 'all' || String(e.category) === category) && (!auditOnly || ['warn','danger'].includes(e.auditLevel)) && (!query || `${e.term} ${e.meaning} ${e.sourceMapping}`.toLowerCase().includes(query)));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function showView(v){
    view=v;
    document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
    document.querySelectorAll('[data-view-panel]').forEach(p=>p.classList.toggle('active',p.dataset.viewPanel===v));
    $('card-footer').classList.toggle('hidden',v!=='card');
    if(v==='card') renderCard(); if(v==='list') renderList(); if(v==='review') resetReview();
  }
  function renderCard(){
    const a=list(); index=Math.max(0,Math.min(index,a.length-1)); const e=a[index];
    if(!e){ $('card-term').textContent='没有匹配条目'; $('card-meaning').textContent='换一个搜索词或筛选范围。'; $('card-mappings').innerHTML=''; $('card-progress').textContent='0 / 0'; return; }
    $('card-badges').innerHTML=`<span class="badge">${label(e)}</span><span class="badge ${e.auditLevel}">${auditName(e.auditLevel)}</span>`;
    $('card-source-page').textContent=e.sourcePage?`PDF p.${e.sourcePage}`:''; $('card-term').textContent=e.term; $('card-meaning').textContent=e.meaning;
    $('card-mappings').innerHTML=(e.mappingItems?.length?e.mappingItems:String(e.sourceMapping||'').split(/\s*[,;，；]\s*/).filter(Boolean)).map(x=>`<span class="mapping-chip">${esc(x)}</span>`).join('');
    $('card-audit').className=e.auditNote?`audit-box ${e.auditLevel}`:'audit-box hidden'; $('card-audit-title').textContent=auditName(e.auditLevel); $('card-audit-text').textContent=e.auditNote;
    $('source-term').textContent=e.sourceTerm; $('source-meaning').textContent=e.sourceMeaning; $('source-mapping').textContent=e.sourceMapping||'—'; $('card-progress').textContent=`${index+1} / ${a.length}`;
  }
  function renderList(){ const a=list(); $('list-count').textContent=a.length; $('word-list').innerHTML=a.map(e=>`<button class="list-row" data-entry-id="${e.id}"><div class="list-term"><strong>${esc(e.term)}</strong><div class="list-meta"><span>${label(e)}</span></div></div><div class="list-meaning">${esc(e.meaning)}</div><div class="list-mapping">${esc(e.sourceMapping)}</div><span class="list-audit ${e.auditLevel}"></span></button>`).join(''); }
  function resetReview(){ review=[...list()].sort(()=>Math.random()-.5); reviewIndex=0; renderReview(); }
  function renderReview(){ const e=review[reviewIndex]; if(!e){$('review-question').textContent='没有可复习条目';return;} $('review-kicker').textContent=label(e); $('review-question').textContent=reviewMode==='en'?e.term:e.meaning; $('review-answer').textContent=reviewMode==='en'?e.meaning:e.term; $('review-mapping').textContent=e.sourceMapping?`原书关联表达：${e.sourceMapping}`:''; $('review-answer-wrap').classList.add('hidden'); $('review-actions').classList.add('hidden'); $('reveal-answer').classList.remove('hidden'); $('review-progress').textContent=`${reviewIndex+1} / ${review.length}`; }
  document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>showView(b.dataset.view));
  document.querySelectorAll('.scope-btn').forEach(b=>b.onclick=()=>{category=b.dataset.category;index=0;document.querySelectorAll('.scope-btn').forEach(x=>x.classList.toggle('active',x===b));showView(view)});
  $('search-input').oninput=e=>{query=e.target.value.toLowerCase().trim();index=0;showView(view)}; $('audit-filter').onclick=()=>{auditOnly=!auditOnly;$('audit-filter').setAttribute('aria-pressed',auditOnly);index=0;showView(view)};
  $('prev-card').onclick=()=>{index--;renderCard()}; $('next-card').onclick=()=>{index++;renderCard()};
  $('word-list').onclick=e=>{const r=e.target.closest('[data-entry-id]');if(!r)return;const a=list();index=Math.max(0,a.findIndex(x=>x.id===r.dataset.entryId));showView('card')};
  document.querySelectorAll('.review-mode').forEach(b=>b.onclick=()=>{reviewMode=b.dataset.reviewMode;document.querySelectorAll('.review-mode').forEach(x=>x.classList.toggle('active',x===b));renderReview()});
  $('restart-review').onclick=resetReview; $('reveal-answer').onclick=()=>{$('review-answer-wrap').classList.remove('hidden');$('review-actions').classList.remove('hidden');$('reveal-answer').classList.add('hidden')};
  $('mark-known').onclick=$('mark-missed').onclick=()=>{reviewIndex=(reviewIndex+1)%Math.max(1,review.length);renderReview()};
  $('brand-subtitle').textContent=`${entries.length} 个核心条目 · 按原始 PDF 重构`; $('method-note').textContent=raw.meta?.methodNote||'本版以核心条目为学习单位，关联表达不拆成独立词卡。'; $('audit-note').textContent=raw.meta?.auditNote||'原书“命题方式”不自动等于同义词。'; $('source-origin').textContent=raw.meta?.source||'用户提供原始 PDF'; $('audit-count').textContent=raw.meta?.auditCount?`${raw.meta.auditCount} 条已标疑点`:'';
  showView('card');
})();
