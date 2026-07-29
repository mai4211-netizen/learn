let coreData = [];
    let replacementData = [];
    let curList = [];
    let curIdx = 0;
    let listPage = 0;
    const perPage = 40;

    let accent = 'en-US';
    let voicePool = [];
    let viewMode = 'card';
    let reviewMode = 'en';
    let reviewFilters = {
      allWords: true,
      cat1: true,
      cat2: true,
      cat3: true,
      core: true,
      replacement: true,
    };
    let reviewDeck = [];
    let reviewIndex = 0;
    let reviewCardFlipped = false;
    let reviewAnswer = '';
    let reviewLastWrongAnswer = '';
    let reviewAnswerFeedbackHtml = '';
    let touchStartX = null;
    let touchSwipeBlocked = false;
    let wheelLock = false;
    let replacementByWord = new Map();
    let replacementByCoreId = new Map();
    let coreByWord = new Map();
    let speakTimer = 0;
    let activeSpeechToken = 0;
    let speechUnlocked = false;
    let rootbookIndexCache = null;
    let rootbookIndexPromise = null;
    let supplementalDetailCache = null;
    let supplementalDetailPromise = null;
    let frontWordShowsSyllables = false;
    let backWordShowsSyllables = false;
    let sheetWordShowsSyllables = false;
    let activeSheetItem = null;

    const AUDITED_DETAIL_OVERRIDES = {
      'shyness': {
        ipa_us: '/ˈʃaɪnəs/',
        ipa_uk: '/ˈʃaɪnəs/',
        meaning_cn: 'n. 害羞；羞怯；腼腆',
        meaning_en: 'the feeling of being nervous or embarrassed about meeting and speaking to other people',
        root_memory: '词形记忆：shy（害羞的）+ -ness（状态）→害羞这种状态，即“羞怯、腼腆”。',
        phrases: [],
        ielts_example: '',
      },
      'comprehend': {
        ipa_us: '/ˌkɑːmprɪˈhend/',
        ipa_uk: '/ˌkɒmprɪˈhend/',
        meaning_cn: 'v. 理解，领会',
        meaning_en: 'to understand something fully',
        root_memory: '词根记忆：com（完全）+ prehend（抓住）→完全抓住→理解，领会。',
        phrases: ['comprehend fully'],
        ielts_example: '',
      },
      'understand': {
        ipa_us: '/ˌʌndərˈstænd/',
        ipa_uk: '/ˌʌndəˈstænd/',
        meaning_cn: 'v. 理解，明白',
        meaning_en: 'to know how something works or what someone means',
        root_memory: '联想记忆：把“understand”整体记成“弄明白、理解”，阅读时先抓“理解内容”的动作感。',
        phrases: ['understand why', 'understand how'],
        ielts_example: '',
      },
      'know': {
        ipa_us: '/nəʊ/',
        ipa_uk: '/nəʊ/',
        meaning_cn: 'v. 知道；了解',
        meaning_en: 'to have information in your mind',
        root_memory: '联想记忆：把“know”直接和“知道、了解”对应记忆，是最基础的认知动词之一。',
        phrases: ['know about', 'get to know'],
        ielts_example: '',
      },
      'be similar to': {
        ipa_us: '/bi ˈsɪmələr tuː/',
        ipa_uk: '/bi ˈsɪmɪlə tə/',
        meaning_cn: '与……相似',
        meaning_en: 'to be like something else in some way',
        root_memory: '固定搭配记忆：将“be similar to”整体记成“与……相似”，做题时连同介词 to 一起识别。',
        phrases: ['be similar to sth'],
        ielts_example: '',
      },
    };

    function sanitizeHTML(str) {
      return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    }

    const SYLLABLE_OVERRIDES = Object.freeze({
      business: 'busi·ness',
      people: 'peo·ple',
      every: 'ev·ery',
      different: 'dif·fer·ent',
      interest: 'in·ter·est',
      temperature: 'tem·per·a·ture',
      comfortable: 'com·fort·a·ble',
      vegetable: 'veg·e·ta·ble',
      literature: 'lit·er·a·ture',
      camera: 'cam·er·a',
    });

    function findExplicitSyllables(word) {
      const key = String(word || '').trim().toLowerCase();
      if (!key) return '';
      const item = coreByWord.get(key) || replacementByWord.get(key);
      const explicit = item && String(item.syllables || '').trim();
      return explicit || SYLLABLE_OVERRIDES[key] || '';
    }

    function splitSyllables(word) {
      const w = String(word || '').trim();
      if (!w) return '';
      const explicit = findExplicitSyllables(w);
      if (explicit) return explicit;
      if (w.length <= 3 || /[\s-]/.test(w)) return w;
      const lower = w.toLowerCase();
      const groups = [...lower.matchAll(/[aeiouy]+/g)].map(m => ({ start: m.index, end: m.index + m[0].length }));
      if (groups.length < 2) return w;
      const cuts = [];
      for (let i = 0; i < groups.length - 1; i++) {
        const left = groups[i];
        const right = groups[i + 1];
        const clusterStart = left.end;
        const clusterEnd = right.start;
        const cluster = lower.slice(clusterStart, clusterEnd);
        if (!cluster) {
          cuts.push(right.start);
          continue;
        }
        let cut = clusterStart;
        if (cluster.length === 2) {
          const second = cluster[1];
          cut = (second === 'l' || second === 'r') ? clusterStart : clusterStart + 1;
        } else if (cluster.length > 2) {
          cut = clusterStart + 1;
        }
        if (cut > 0 && cut < w.length) cuts.push(cut);
      }
      const uniq = [...new Set(cuts)].filter(x => x > 0 && x < w.length);
      if (!uniq.length) return w;
      let out = '';
      let prev = 0;
      for (const cut of uniq.slice(0, 4)) {
        out += w.slice(prev, cut) + '·';
        prev = cut;
      }
      out += w.slice(prev);
      return out.replace(/·+/g, '·').replace(/^·|·$/g, '');
    }

    function buildPronHint(word, ipa) {
      const syllables = splitSyllables(word);
      const stress = ipa && /ˈ/.test(ipa)
        ? '重音看音标里的 ˈ'
        : (ipa && /ˌ/.test(ipa) ? '次重音看音标里的 ˌ' : '可先按音节慢速拼读');
      return { syllables, text: `音节 ${syllables} · ${stress}` };
    }

    function buildSlowSpeakText(word) {
      const chunks = splitSyllables(word).split('·').map(x => x.trim()).filter(Boolean);
      if (!chunks.length) return String(word || '');
      return chunks.join(' ');
    }

    function escapeInlineHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function getDisplayWord(word, showSyllables) {
      const base = String(word || '').trim();
      if (!base) return '';
      const syllables = splitSyllables(base);
      if (!showSyllables || syllables === base) return base;
      return syllables;
    }

    function getDisplayWordMarkup(word, showSyllables) {
      const displayWord = getDisplayWord(word, showSyllables);
      if (!showSyllables || !displayWord.includes('·')) {
        return escapeInlineHtml(displayWord);
      }
      return displayWord
        .split('·')
        .filter(Boolean)
        .map(chunk => escapeInlineHtml(chunk))
        .join('<span class="syllable-sep">·</span>');
    }

    function setWordButtonText(elementId, word, showSyllables) {
      const el = document.getElementById(elementId);
      if (!el) return;
      el.innerHTML = getDisplayWordMarkup(word, showSyllables);
      el.setAttribute('data-word', String(word || ''));
      el.setAttribute('data-display-mode', showSyllables ? 'syllables' : 'default');
      el.setAttribute('aria-label', showSyllables ? `切换回默认拼写并播放 ${word}` : `切换音节显示并播放 ${word}`);
      el.title = showSyllables ? '点击切回默认拼写并发音' : '点击切换音节显示并发音';
    }

    function toggleWordDisplayMode() {
      const it = curList[curIdx];
      if (!it) return;
      frontWordShowsSyllables = !frontWordShowsSyllables;
      setWordButtonText('f-word', it.word, frontWordShowsSyllables);
      speak(it.word);
    }

    function toggleBackWordDisplay() {
      const it = curList[curIdx];
      if (!it) return;
      backWordShowsSyllables = !backWordShowsSyllables;
      setWordButtonText('b-word', it.word, backWordShowsSyllables);
      speak(it.word);
    }

    function toggleSheetWordDisplay() {
      if (!activeSheetItem) return;
      sheetWordShowsSyllables = !sheetWordShowsSyllables;
      setWordButtonText('sheet-word-btn', activeSheetItem.word, sheetWordShowsSyllables);
      speak(activeSheetItem.word);
    }

    function normalizeSpeechSpelling(text) {
      const normalized = String(text || '');
      const accentMap = accent === 'en-US'
        ? {
            plagiarise: 'plagiarize',
            paralyse: 'paralyze',
            odour: 'odor',
          }
        : {
            plagiarize: 'plagiarise',
            paralyze: 'paralyse',
            odor: 'odour',
          };
      return normalized.replace(/[A-Za-z][A-Za-z'-]*/g, (token) => {
        const lower = token.toLowerCase();
        const mapped = accentMap[lower];
        if (!mapped) return token;
        if (token === lower) return mapped;
        if (token === token.toUpperCase()) return mapped.toUpperCase();
        return mapped.charAt(0).toUpperCase() + mapped.slice(1);
      });
    }

    function buildNaturalSpeakText(text) {
      return normalizeSpeechSpelling(String(text || ''))
        .replace(/\//g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\s*-\s*/g, '-')
        .trim();
    }

    function isAppleMobileDevice() {
      const ua = navigator.userAgent || '';
      const platform = navigator.platform || '';
      const touchPoints = Number(navigator.maxTouchPoints || 0);
      const isIPhone = /iPhone/i.test(ua);
      const isIPad = /iPad/i.test(ua);
      const isIPadDesktopUA = platform === 'MacIntel' && touchPoints > 1;
      return isIPhone || isIPad || isIPadDesktopUA;
    }

    function shouldUseNativeMobileSpeech() {
      return isAppleMobileDevice() && accent === 'en-US';
    }

    function syncSpeechUnlockOverlay() {
      const unlockOverlay = document.getElementById('speech-unlock-overlay');
      if (!unlockOverlay) return;
      const shouldShow = shouldUseNativeMobileSpeech() && !speechUnlocked;
      unlockOverlay.classList.toggle('hidden', !shouldShow);
      unlockOverlay.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    }

    async function warmNativeSpeechPlayback() {
      try {
        stopSpeaking();
        if (!window.speechSynthesis) return;
        initVoices();
        await new Promise((resolve) => {
          const utter = new SpeechSynthesisUtterance('ready');
          utter.lang = accent;
          utter.volume = 0;
          utter.rate = 1;
          utter.pitch = 1;
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            resolve();
          };
          utter.onend = finish;
          utter.onerror = finish;
          window.speechSynthesis.speak(utter);
          window.setTimeout(finish, 220);
        });
      } catch (err) {
        console.warn('speech unlock failed', err);
      }
    }

    function handleSpeechUnlockTap(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (!shouldUseNativeMobileSpeech()) return;
      speechUnlocked = true;
      syncSpeechUnlockOverlay();
      const activeWord = viewMode === 'review'
        ? (reviewDeck[reviewIndex] && reviewDeck[reviewIndex].word)
        : (activeSheetItem && activeSheetItem.word) || (curList[curIdx] && curList[curIdx].word);
      window.setTimeout(async () => {
        await warmNativeSpeechPlayback();
        if (activeWord) speak(activeWord);
      }, 0);
    }

    function toggleCardFlip() {
      const card = document.getElementById('main-card');
      card.classList.toggle('flipped');
      const it = curList[curIdx];
      if (it) speak(it.word);
    }

    function normalizeCoreFields(it) {
      const out = {
        meaning: String(it.meaning_cn || '').trim(),
        meaningEn: String(it.meaning_en || '').trim(),
        root: String(it.root_memory || '').trim(),
        phrases: Array.isArray(it.phrases) ? it.phrases : [],
        example: String(it.ielts_example || '').trim(),
      };
      const logicWord = /\*/.test(String(it.word || '')) || /雅思核心|并列关系|转折|因果/.test(out.meaning + out.root);
      if (logicWord) {
        out.meaning = out.meaning
          .replace(/[（(][^)）]*雅思[^)）]*[)）]/g, '')
          .replace(/[（(][^)）]*(并列|转折|因果|逻辑)[^)）]*[)）]/g, '')
          .trim();
        out.root = '（逻辑考点词，词根项不适用）';
      }
      if (!out.root) out.root = '（词根待校验）';
      if (!out.example) out.example = '（例句待校验）';
      return out;
    }

    function isUnreliableRootMemory(rootText) {
      const text = String(rootText || '').trim();
      if (!text) return false;
      // 不靠谱的“词根/词形”联想会误导学习，直接隐藏，不进入展示层。
      const riskyPatterns = [
        /联想记忆：把/u,
        /整体记忆/u,
        /先记核心概念/u,
        /词形记忆：看到/u,
        /做题时留意它修饰的对象/u,
        /阅读时先抓核心概念/u,
        /阅读里按语境再判断/u,
        /直接对应/u,
      ];
      return riskyPatterns.some((pattern) => pattern.test(text));
    }

    function shouldDisplayRootMemory(rootText) {
      const text = String(rootText || '').trim();
      if (!text) return false;
      if (text.includes('词根项不适用')) return false;
      if (isPendingText(text)) return false;
      if (isUnreliableRootMemory(text)) return false;
      return true;
    }

    function getCopyDensityClass(parts, extraWeight = 0) {
      const text = (Array.isArray(parts) ? parts : [parts])
        .map((part) => String(part || '').trim())
        .filter(Boolean)
        .join(' ');
      if (!text) return '';
      const punctuationWeight = (text.match(/[；;：:，,、/]/g) || []).length * 2;
      const lineWeight = (text.match(/\n/g) || []).length * 6;
      const score = text.length + punctuationWeight + lineWeight + extraWeight;
      if (score >= 170) return 'density-dense';
      if (score >= 96) return 'density-compact';
      return '';
    }

    function getHeadlineFitClass(text) {
      const clean = String(text || '').replace(/\s+/g, '').trim();
      if (!clean) return '';
      const segments = clean.split(/[；;：:，,、()（）/\s]/).filter(Boolean);
      const longestSegment = segments.reduce((max, segment) => Math.max(max, segment.length), 0);
      const punctuationWeight = (clean.match(/[；;：:，,、/]/g) || []).length * 3;
      const score = clean.length + longestSegment * 4 + punctuationWeight;
      if (score >= 108) return 'fit-ultra';
      if (score >= 74) return 'fit-dense';
      if (score >= 42) return 'fit-compact';
      return '';
    }

    function isPendingText(value) {
      return /待(补充|校验)/.test(String(value || ''));
    }

    function formatPhraseHTML(phrases) {
      const rawList = Array.isArray(phrases) ? phrases : [phrases];
      const lines = [];
      for (const raw of rawList) {
        const text = String(raw || '').trim();
        if (!text) continue;
        const parts = text.split(/[；;]/).map(s => s.trim()).filter(Boolean);
        if (!parts.length) continue;
        for (const part of parts) {
          if (!/[A-Za-z]/.test(part) && lines.length) {
            lines[lines.length - 1] = `${lines[lines.length - 1]} ${part}`.trim();
          } else {
            lines.push(part);
          }
        }
      }
      if (!lines.length) {
        return sanitizeHTML('（本词未标注）');
      }
      return `<div class="phrase-lines">${lines.map(line => `<div class="phrase-line">${sanitizeHTML(line)}</div>`).join('')}</div>`;
    }

    function normalizeExampleBlocks(value) {
      if (Array.isArray(value)) return value.flatMap(normalizeExampleBlocks);
      if (value && typeof value === 'object') {
        const en = String(value.en || value.english || value.example_en || '').trim();
        const cn = String(value.cn || value.zh || value.chinese || value.example_cn || '').trim();
        return (en || cn) ? [{ en, cn }] : [];
      }
      const src = String(value || '').trim();
      if (!src) return [];
      return src.split('//').map(s => s.trim()).filter(Boolean).map(block => {
        const normalized = block.replace(/\s+/g, ' ').trim();
        const explicit = normalized.match(/^(.*?)\s*(?:\|\|\||=>|→)\s*(.*)$/);
        if (explicit && /[A-Za-z]/.test(explicit[1]) && /[\u4e00-\u9fff]/.test(explicit[2])) {
          return { en: explicit[1].trim(), cn: explicit[2].trim() };
        }
        const firstCn = normalized.search(/[\u4e00-\u9fff]/);
        if (firstCn > 0) return { en: normalized.slice(0, firstCn).trim(), cn: normalized.slice(firstCn).trim() };
        return { en: normalized, cn: '' };
      });
    }

    function formatExampleHTML(value) {
      if (!value || (typeof value === 'string' && !String(value).trim())) return sanitizeHTML('（例句待校验）');
      if (typeof value === 'string' && isPendingText(value)) return sanitizeHTML(value);
      const blocks = normalizeExampleBlocks(value).map(({ en, cn }) => {
        const parts = [];
        if (en) parts.push(`<span class="example-en">${sanitizeHTML(en)}</span>`);
        if (cn) parts.push(`<span class="example-cn">${sanitizeHTML(cn)}</span>`);
        return `<div>${parts.join('')}</div>`;
      });
      return blocks.length ? `<div class="example-lines">${blocks.join('')}</div>` : sanitizeHTML('（例句待校验）');
    }

    function parseSynonyms(raw) {
      if (!raw) return [];
      const cleaned = String(raw).replaceAll('...', ' ').replaceAll('…', ' ').replaceAll('*', ' ');
      const parts = cleaned.split(/[;,，；]+/g).map(s => s.trim()).filter(Boolean);
      const seen = new Set();
      const out = [];
      for (const p of parts) {
        const x = p.replace(/\s+/g, ' ').trim();
        if (!x) continue;
        if (!/[A-Za-z]/.test(x)) continue;
        const k = x.toLowerCase();
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(x);
      }
      return out;
    }

    function buildReplacementMapByWord() {
      replacementByWord = new Map();
      replacementByCoreId = new Map();
      for (const r of replacementData) {
        replacementByWord.set(String(r.word || '').toLowerCase(), r);
        const anchorCoreId = String(r.anchor_core_id || '').trim();
        if (!anchorCoreId) continue;
        if (!replacementByCoreId.has(anchorCoreId)) {
          replacementByCoreId.set(anchorCoreId, []);
        }
        replacementByCoreId.get(anchorCoreId).push(r);
      }
      coreByWord = new Map();
      for (const c of coreData) {
        coreByWord.set(String(c.word || '').toLowerCase(), c);
      }
    }

    async function loadDataSources() {
      if (window.__IELTS_DATA__ && Array.isArray(window.__IELTS_DATA__.core) && Array.isArray(window.__IELTS_DATA__.replacement)) {
        return window.__IELTS_DATA__;
      }
      const [coreRes, replRes, reportRes] = await Promise.all([
        fetch('./core_words.json', { cache: 'no-store' }),
        fetch('./replacement_words.json', { cache: 'no-store' }),
        fetch('./validation_report.json', { cache: 'no-store' }),
      ]);
      return {
        core: await coreRes.json(),
        replacement: await replRes.json(),
        report: await reportRes.json(),
      };
    }

    async function init() {
      try {
        const payload = await loadDataSources();
        coreData = payload.core;
        replacementData = payload.replacement;
        const report = payload.report || {};

        buildReplacementMapByWord();
        curList = [...coreData];

        const hard = report.hard_check || {};
        const summary = `校验 core=${report.core_count} total=${report.total_words_by_count_rule} 对齐错误=${report.line_alignment_errors}`;
        document.getElementById('progress-sub').innerText = summary;
        if (!hard.core_equals_376 || !hard.count_rule_equals_538 || !hard.no_missing_fields || !hard.no_placeholders || !hard.line_alignment_zero) {
          document.getElementById('progress-sub').innerText = '数据校验未全绿，请先运行构建脚本修复';
        }

        bindEvents();
        initVoices();
        syncSpeechUnlockOverlay();
        render({ autoplay: true });
        updateProgress();
        resetReviewDeck();
      } catch (err) {
        document.getElementById('f-word').innerText = '数据加载失败';
        document.getElementById('progress-sub').innerText = '请确认 data_bundle.js 或 JSON 文件存在且同目录';
        console.error(err);
      }
    }

    function bindEvents() {
      document.getElementById('f-word').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWordDisplayMode();
      });

      document.getElementById('f-ipa').addEventListener('click', (e) => {
        e.stopPropagation();
        accent = accent === 'en-US' ? 'en-GB' : 'en-US';
        syncSpeechUnlockOverlay();
        render({ autoplay: true });
      });

      document.getElementById('f-slow').addEventListener('click', (e) => {
        e.stopPropagation();
        const it = curList[curIdx];
        if (it) speak(it.word, { mode: 'slow' });
      });

      document.getElementById('main-card').addEventListener('click', (e) => {
        if (e.target.closest('#f-word') || e.target.closest('#f-ipa') || e.target.closest('.chip-btn')) return;
        toggleCardFlip();
      });

      document.getElementById('prev-btn').addEventListener('click', () => navigate(-1, 'right'));
      document.getElementById('next-btn').addEventListener('click', () => navigate(1, 'left'));

      document.addEventListener('keydown', (e) => {
        if (e.target && /input|textarea|select/i.test(e.target.tagName || '')) return;
        if (viewMode === 'card' && e.key === 'ArrowRight') {
          e.preventDefault();
          navigate(1, 'left');
        }
        if (viewMode === 'card' && e.key === 'ArrowLeft') {
          e.preventDefault();
          navigate(-1, 'right');
        }
        if (viewMode === 'card' && (e.code === 'Space' || e.key === ' ')) {
          e.preventDefault();
          navigate(1, 'left');
        }
        if (viewMode === 'review' && e.key === 'ArrowRight') {
          e.preventDefault();
          navigateReview(1, 'left');
        }
        if (viewMode === 'review' && e.key === 'ArrowLeft') {
          e.preventDefault();
          navigateReview(-1, 'right');
        }
        if (viewMode === 'review' && (e.code === 'Space' || e.key === ' ')) {
          e.preventDefault();
          navigateReview(1, 'left');
        }
      }, { passive: false });

      document.addEventListener('wheel', (e) => {
        if (viewMode !== 'card' && viewMode !== 'review') return;
        if (Math.abs(e.deltaY) < 16) return;
        if (wheelLock) return;
        wheelLock = true;
        setTimeout(() => { wheelLock = false; }, 170);
        e.preventDefault();
        if (viewMode === 'card') {
          if (e.deltaY > 0) navigate(1, 'left');
          else navigate(-1, 'right');
          return;
        }
        if (e.deltaY > 0) navigateReview(1, 'left');
        else navigateReview(-1, 'right');
      }, { passive: false });

      document.addEventListener('touchstart', (e) => {
        if (viewMode !== 'card' && viewMode !== 'review') return;
        const target = e.target;
        const shouldBlock = !!target && typeof target.closest === 'function' && (
          target.closest('#review-answer-input')
          || target.closest('input, textarea, select, button, [contenteditable="true"]')
        );
        if (shouldBlock) {
          touchSwipeBlocked = true;
          touchStartX = null;
          return;
        }
        touchSwipeBlocked = false;
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });

      document.addEventListener('touchend', (e) => {
        if (viewMode !== 'card' && viewMode !== 'review') return;
        if (touchSwipeBlocked || touchStartX === null) {
          touchSwipeBlocked = false;
          touchStartX = null;
          return;
        }
        const endX = e.changedTouches[0].clientX;
        const delta = touchStartX - endX;
        if (viewMode === 'card') {
          if (delta > 46) navigate(1, 'left');
          if (delta < -46) navigate(-1, 'right');
          return;
        }
        if (delta > 46) navigateReview(1, 'left');
        if (delta < -46) navigateReview(-1, 'right');
      }, { passive: true });

      document.getElementById('review-filter-all').addEventListener('change', (e) => {
        setReviewFilter('allWords', e.target.checked);
      });
      document.getElementById('review-filter-cat1').addEventListener('change', (e) => {
        setReviewFilter('cat1', e.target.checked);
      });
      document.getElementById('review-filter-cat2').addEventListener('change', (e) => {
        setReviewFilter('cat2', e.target.checked);
      });
      document.getElementById('review-filter-cat3').addEventListener('change', (e) => {
        setReviewFilter('cat3', e.target.checked);
      });
      document.getElementById('review-filter-core').addEventListener('change', (e) => {
        setReviewFilter('core', e.target.checked);
      });
      document.getElementById('review-filter-replacement').addEventListener('change', (e) => {
        setReviewFilter('replacement', e.target.checked);
      });
    }

    const VOICE_PREF_KEY = 'ielts538.voiceURI';
    let preferredVoiceURI = (() => {
      try { return localStorage.getItem(VOICE_PREF_KEY) || ''; } catch (_) { return ''; }
    })();

    function syncVoiceSelector() {
      const select = document.getElementById('voice-select');
      if (!select) return;
      const englishVoices = voicePool
        .filter(v => String(v.lang || '').toLowerCase().startsWith('en-'))
        .sort((a, b) => String(a.lang).localeCompare(String(b.lang)) || String(a.name).localeCompare(String(b.name)));
      const previous = preferredVoiceURI;
      select.innerHTML = '<option value="">自动选择</option>' + englishVoices.map(voice => {
        const value = sanitizeHTML(String(voice.voiceURI || voice.name || ''));
        const label = sanitizeHTML(`${voice.name} · ${voice.lang}${voice.localService ? ' · 本地' : ''}`);
        return `<option value="${value}">${label}</option>`;
      }).join('');
      if (previous && englishVoices.some(v => String(v.voiceURI || v.name || '') === previous)) select.value = previous;
      else if (previous) {
        preferredVoiceURI = '';
        try { localStorage.removeItem(VOICE_PREF_KEY); } catch (_) {}
      }
      if (!select.dataset.bound) {
        select.addEventListener('change', () => {
          preferredVoiceURI = select.value || '';
          try {
            if (preferredVoiceURI) localStorage.setItem(VOICE_PREF_KEY, preferredVoiceURI);
            else localStorage.removeItem(VOICE_PREF_KEY);
          } catch (_) {}
          const it = curList[curIdx];
          if (it && it.word) speak(it.word);
        });
        select.dataset.bound = '1';
      }
    }

    function initVoices() {
      const refresh = () => {
        voicePool = window.speechSynthesis ? speechSynthesis.getVoices() || [] : [];
        syncVoiceSelector();
      };
      refresh();
      if (!window.speechSynthesis) return;
      if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = refresh;
      if (speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', refresh);
    }

    function pickIOSVoice() {
      if (!voicePool.length) return null;
      const usVoices = voicePool.filter((voice) => String(voice.lang || '').toLowerCase().startsWith('en-us'));
      if (!usVoices.length) return null;
      const byName = (name) => usVoices.find((voice) => String(voice.name || '').toLowerCase() === name);
      const nonCompactVoices = usVoices.filter((voice) => {
        const name = String(voice.name || '').toLowerCase();
        const uri = String(voice.voiceURI || '').toLowerCase();
        return !name.includes('compact') && !uri.includes('compact');
      });
      return (
        byName('samantha')
        || nonCompactVoices.find((voice) => voice.default)
        || nonCompactVoices[0]
        || usVoices.find((voice) => !String(voice.name || '').toLowerCase().includes('compact'))
        || usVoices[0]
        || null
      );
    }

    function pickVoice() {
      if (!voicePool.length) return null;
      if (preferredVoiceURI) {
        const preferred = voicePool.find(voice => String(voice.voiceURI || voice.name || '') === preferredVoiceURI);
        if (preferred) return preferred;
      }
      if (shouldUseNativeMobileSpeech()) {
        return pickIOSVoice();
      }
      const langPrefix = accent === 'en-US' ? 'en-us' : 'en-gb';
      const preferredNames = accent === 'en-US'
        ? ['ava', 'allison', 'jenny', 'aria', 'samantha', 'emma', 'olivia', 'google us english']
        : ['libby', 'sonia', 'serena', 'daniel', 'kate', 'hazel', 'google uk english female'];
      const unwantedHints = ['novelty', 'whisper', 'trinoids', 'zarvox', 'bad news', 'good news', 'hysterical'];
      const scoreVoice = (voice) => {
        const lang = String(voice.lang || '').toLowerCase();
        const name = String(voice.name || '').toLowerCase();
        let score = 0;
        if (lang === langPrefix) score += 90;
        else if (lang.startsWith(langPrefix)) score += 75;
        else if (lang.startsWith('en-')) score += 20;
        if (voice.localService) score += 18;
        if (voice.default) score += 8;
        if (preferredNames.some(h => name.includes(h))) score += 24;
        if (name.includes('female')) score += 4;
        if (name.includes('male')) score -= 3;
        if (name.includes('premium') || name.includes('enhanced')) score += 8;
        if (name.includes('google')) score += 10;
        if (name.includes('natural') || name.includes('neural')) score += 12;
        if (name.includes('compact') || name.includes('lite')) score -= 8;
        if (unwantedHints.some(h => name.includes(h))) score -= 60;
        return score;
      };
      return [...voicePool].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;
    }

    function stopSpeaking() {
      activeSpeechToken += 1;
      window.clearTimeout(speakTimer);
      try {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } catch (err) {
        console.warn('speech cancel failed', err);
      }
    }

    function speak(text, options = {}) {
      if (!text) return;
      try {
        if (shouldUseNativeMobileSpeech() && !speechUnlocked) {
          syncSpeechUnlockOverlay();
          return;
        }
        const mode = options.mode || 'normal';
        const token = activeSpeechToken + 1;
        stopSpeaking();
        activeSpeechToken = token;
        const spokenText = mode === 'slow' ? buildSlowSpeakText(text) : buildNaturalSpeakText(text);
        const utter = new SpeechSynthesisUtterance(spokenText);
        utter.lang = accent;
        utter.volume = 1;
        utter.rate = mode === 'slow' ? 0.56 : 0.72;
        utter.pitch = mode === 'slow' ? 0.9 : 0.96;
        let voice = pickVoice();
        const delay = mode === 'slow' ? 110 : 70;
        const performSpeak = () => {
          if (token !== activeSpeechToken) return;
          if (!utter.voice) {
            const refreshedVoice = pickVoice();
            if (refreshedVoice) utter.voice = refreshedVoice;
          }
          window.speechSynthesis.speak(utter);
        };
        if (voice) utter.voice = voice;
        if (shouldUseNativeMobileSpeech() && !voice) {
          initVoices();
          speakTimer = window.setTimeout(() => {
            voice = pickVoice();
            if (voice) utter.voice = voice;
            performSpeak();
          }, Math.max(delay, 180));
          return;
        }
        speakTimer = window.setTimeout(performSpeak, delay);
      } catch (err) {
        console.warn('speak failed', err);
      }
    }

    function navigate(step, dir) {
      if (!curList.length) return;
      const target = curIdx + step;
      if (target < 0 || target >= curList.length) return;
      const card = document.getElementById('main-card');
      card.classList.remove('flipped');
      card.classList.add(dir === 'left' ? 'slide-left' : 'slide-right');
      setTimeout(() => {
        card.classList.remove('slide-left', 'slide-right');
        curIdx = target;
        render({ autoplay: true });
        updateProgress();
      }, 165);
    }

    function renderEmptyState() {
      stopSpeaking();
      const card = document.getElementById('main-card');
      card.classList.remove('flipped', 'slide-left', 'slide-right');
      document.getElementById('f-cat').innerText = 'SEARCH';
      document.getElementById('f-word').innerText = '未找到匹配词';
      document.getElementById('f-ipa').innerText = '重新搜索 [--]';
      document.getElementById('f-repl').innerHTML = '<span class="chip-btn" aria-disabled="true">暂无结果</span>';
      const backHost = document.getElementById('b-content');
      backHost.className = 'back-scroll';
      backHost.innerHTML = `
        <article class="face empty">
          <div class="empty-title">没有找到匹配词</div>
          <div class="empty-text">请换一个关键词，或清空搜索框恢复全部词卡。</div>
        </article>
      `;
    }

    function render(options = {}) {
      const it = curList[curIdx];
      if (!it) {
        renderEmptyState();
        return;
      }

      document.getElementById('f-cat').innerText = it.category || 'IELTS';
      frontWordShowsSyllables = false;
      backWordShowsSyllables = false;
      setWordButtonText('f-word', it.word, frontWordShowsSyllables);
      const ipa = accent === 'en-US' ? it.ipa_us : it.ipa_uk;
      document.getElementById('f-ipa').innerText = `${ipa} [${accent === 'en-US' ? 'US' : 'UK'}]`;

      const replWords = parseSynonyms(it.synonym_raw);
      renderReplacementChips('f-repl', replWords, it);

      const coreView = normalizeCoreFields(it);
      const phraseHtml = formatPhraseHTML(coreView.phrases || []);
      const exampleHtml = formatExampleHTML(coreView.example);
      const rootBlock = shouldDisplayRootMemory(coreView.root)
        ? `<div class="item sheet-card"><span class="label l2">词根记忆</span><div class="txt">${sanitizeHTML(coreView.root)}</div></div>`
        : '';
      const backDensityClass = getCopyDensityClass(
        [coreView.meaning, coreView.root, coreView.example, (coreView.phrases || []).join(' ')],
        replWords.length * 7,
      );
      const meaningFitClass = getHeadlineFitClass(coreView.meaning);
      const backHtml = `
        <div class="sheet-meaning ${meaningFitClass}">${sanitizeHTML(coreView.meaning || '（释义待校验）')}</div>
        <div class="sheet-wordline">
          <button id="b-word" class="sheet-word" aria-label="切换音节显示并播放 ${sanitizeHTML(it.word)}">${sanitizeHTML(it.word)}</button>
          <div class="sheet-sub">${sanitizeHTML(it.ipa_us || '')}</div>
        </div>
        ${rootBlock}
        <div class="item"><span class="label l1">关联词汇</span><div class="chips chips-left" id="b-repl"></div></div>
        <div class="item"><span class="label l3">高频词组</span><div class="txt">${phraseHtml}</div></div>
        <div class="item"><span class="label l4">雅思真题例句</span><div class="txt example">${exampleHtml}</div></div>
      `;
      const backHost = document.getElementById('b-content');
      backHost.className = `back-scroll ${backDensityClass}`.trim();
      backHost.innerHTML = backHtml;
      const backWordBtn = document.getElementById('b-word');
      if (backWordBtn) {
        backWordBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleBackWordDisplay();
        });
      }
      renderReplacementChips('b-repl', replWords, it);

      if (options.autoplay) {
        speak(it.word);
      }
    }

    function renderReplacementChips(containerId, words, coreItem) {
      const el = document.getElementById(containerId);
      if (!el) return;
      if (!words.length) {
        el.innerHTML = '<span class="chip-btn" aria-disabled="true">暂无</span>';
        return;
      }
      el.innerHTML = words.map(w => (
        `<button class="chip-btn" data-word="${sanitizeHTML(w)}" aria-label="查看 ${sanitizeHTML(w)} 详情">${sanitizeHTML(w)}</button>`
      )).join('');
      el.querySelectorAll('.chip-btn[data-word]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const word = btn.getAttribute('data-word') || '';
          openSheet(word, coreItem);
        });
      });
    }

    function shuffleArray(items) {
      const out = Array.isArray(items) ? [...items] : [];
      for (let i = out.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    }

    function areReviewSubfiltersAllSelected() {
      return reviewFilters.cat1
        && reviewFilters.cat2
        && reviewFilters.cat3
        && reviewFilters.core
        && reviewFilters.replacement;
    }

    function isReviewPrimaryFilter(name) {
      return name === 'cat1' || name === 'cat2' || name === 'cat3';
    }

    function getReviewSourceCoreItems() {
      return curList.filter(item => coreByWord.has(String(item.word || '').toLowerCase()));
    }

    function getSelectedReviewCoreItems() {
      const sourceCoreItems = getReviewSourceCoreItems();
      const hasCatFilter = reviewFilters.cat1 || reviewFilters.cat2 || reviewFilters.cat3;
      if (!hasCatFilter) return [];
      return sourceCoreItems.filter(coreItem => coreMatchesSelectedCats(coreItem));
    }

    function getEffectiveReviewCardKinds() {
      const kinds = [];
      if (reviewFilters.core) kinds.push('core');
      if (reviewFilters.replacement) kinds.push('replacement');
      return kinds;
    }

    function getRelatedWordsForCore(coreItem) {
      if (!coreItem) return [];
      const anchored = (replacementByCoreId.get(coreItem.id) || []).map(item => String(item.word || '').trim()).filter(Boolean);
      if (anchored.length) return anchored;
      return parseSynonyms(coreItem.synonym_raw);
    }

    function getReviewCardIpa(card) {
      if (!card) return '';
      return String(accent === 'en-US' ? (card.ipa_us || card.ipa_uk || '') : (card.ipa_uk || card.ipa_us || '')).trim();
    }

    function computeReviewScopeStats() {
      const sourceCoreItems = getReviewSourceCoreItems();
      const selectedPrimaryCoreItems = getSelectedReviewCoreItems();
      let coreCount = 0;
      let replacementCount = 0;
      let cat1Count = 0;
      let cat2Count = 0;
      let cat3Count = 0;
      for (const coreItem of sourceCoreItems) {
        const replacementCards = collectReplacementCardsForCore(coreItem);
        coreCount += 1;
        replacementCount += replacementCards.length;
        const totalForCat = 1 + replacementCards.length;
        const categoryId = getCategoryId(coreItem);
        if (categoryId === 1) cat1Count += totalForCat;
        if (categoryId === 2) cat2Count += totalForCat;
        if (categoryId === 3) cat3Count += totalForCat;
      }
      let selectedCoreCount = 0;
      let selectedReplacementCount = 0;
      for (const coreItem of selectedPrimaryCoreItems) {
        const replacementCards = collectReplacementCardsForCore(coreItem);
        selectedCoreCount += 1;
        selectedReplacementCount += replacementCards.length;
      }
      return {
        all: coreCount + replacementCount,
        cat1: cat1Count,
        cat2: cat2Count,
        cat3: cat3Count,
        core: selectedCoreCount,
        replacement: selectedReplacementCount,
      };
    }

    function renderReviewScopeStats() {
      const stats = computeReviewScopeStats();
      const bindings = {
        'review-count-all': stats.all,
        'review-count-cat1': stats.cat1,
        'review-count-cat2': stats.cat2,
        'review-count-cat3': stats.cat3,
        'review-count-core': stats.core,
        'review-count-replacement': stats.replacement,
      };
      for (const [id, count] of Object.entries(bindings)) {
        const el = document.getElementById(id);
        if (el) el.innerText = String(count);
      }
    }

    function renderReviewSelectionSummary() {
      const summaryEl = document.getElementById('review-selection-summary');
      if (!summaryEl) return;
      const selectedCats = [];
      if (reviewFilters.cat1) selectedCats.push('第一类');
      if (reviewFilters.cat2) selectedCats.push('第二类');
      if (reviewFilters.cat3) selectedCats.push('第三类');
      const effectiveKinds = getEffectiveReviewCardKinds();
      const selectedKinds = effectiveKinds.map(kind => kind === 'core' ? '核心词' : '关联词');
      const catText = selectedCats.length ? selectedCats.join('、') : '全部分类';
      const kindText = selectedKinds.length ? selectedKinds.join('、') : '未选题型';
      summaryEl.innerText = `已选：${catText}｜${kindText}`;
    }

    function syncReviewFilterUI() {
      const bindings = {
        'review-filter-all': reviewFilters.allWords,
        'review-filter-cat1': reviewFilters.cat1,
        'review-filter-cat2': reviewFilters.cat2,
        'review-filter-cat3': reviewFilters.cat3,
        'review-filter-core': reviewFilters.core,
        'review-filter-replacement': reviewFilters.replacement,
      };
      for (const [id, checked] of Object.entries(bindings)) {
        const el = document.getElementById(id);
        if (el) el.checked = !!checked;
      }
      renderReviewScopeStats();
      renderReviewSelectionSummary();
    }

    function setReviewFilter(name, checked) {
      if (name === 'allWords') {
        reviewFilters.allWords = checked;
        reviewFilters.cat1 = checked;
        reviewFilters.cat2 = checked;
        reviewFilters.cat3 = checked;
        reviewFilters.core = checked;
        reviewFilters.replacement = checked;
      } else {
        reviewFilters[name] = checked;
        reviewFilters.allWords = areReviewSubfiltersAllSelected();
      }
      syncReviewFilterUI();
      resetReviewDeck();
    }

    function getCategoryId(coreItem) {
      const explicit = Number(coreItem && (coreItem.category_id ?? coreItem.categoryId));
      if ([1, 2, 3].includes(explicit)) return explicit;
      const match = String(coreItem && coreItem.category || '').match(/\bCAT\s*([123])\b/i);
      return match ? Number(match[1]) : 0;
    }

    function coreMatchesSelectedCats(coreItem) {
      const categoryId = getCategoryId(coreItem);
      const hasCatFilter = reviewFilters.cat1 || reviewFilters.cat2 || reviewFilters.cat3;
      if (!hasCatFilter) return true;
      return (reviewFilters.cat1 && categoryId === 1)
        || (reviewFilters.cat2 && categoryId === 2)
        || (reviewFilters.cat3 && categoryId === 3);
    }

    function collectReplacementCardsForCore(coreItem) {
      if (!coreItem) return [];
      return getRelatedWordsForCore(coreItem).map((word) => {
        const replacementItem = replacementByWord.get(String(word || '').toLowerCase()) || {};
        const meaningCn = String(replacementItem.meaning_cn || '').trim();
        if (!meaningCn || meaningCn === '（中文释义待校验）') return null;
        return {
          kind: 'replacement',
          id: replacementItem.id || `inferred:${coreItem.id}:${word}`,
          word: replacementItem.word || word,
          category: coreItem.category || '',
          anchorCoreId: coreItem.id,
          anchorCoreWord: coreItem.word,
          meaning_cn: meaningCn,
          meaning_en: replacementItem.meaning_en || '',
          ipa_us: replacementItem.ipa_us || '',
          ipa_uk: replacementItem.ipa_uk || '',
        };
      }).filter(Boolean);
    }

    function normalizeReviewText(value) {
      return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
    }

    function renderAnswerDiff(expected, actual) {
      const expectedText = String(expected || '');
      const actualText = String(actual || '');
      const len = expectedText.length;
      const chars = [];
      for (let i = 0; i < len; i += 1) {
        const expChar = expectedText[i] || '';
        const matched = !!expChar && i < actualText.length && expChar.toLowerCase() === actualText[i].toLowerCase();
        const cssClass = matched ? 'hit' : 'gap';
        const displayChar = matched ? expChar : '_';
        chars.push(`<span class="review-diff-char ${cssClass}">${sanitizeHTML(displayChar)}</span>`);
      }
      return `
        <div class="review-answer-diff">
          <div class="review-diff-line">${chars.join('')}</div>
        </div>
      `;
    }

    function checkReviewAnswer(card, answer) {
      const expected = normalizeReviewText(card && card.word);
      const actual = normalizeReviewText(answer);
      const correct = !!expected && expected === actual;
      return { correct, expected, actual, diffHtml: renderAnswerDiff(card && card.word, answer) };
    }

    function buildReviewDeck() {
      const deck = [];
      const seen = new Set();
      const effectiveCardKinds = getEffectiveReviewCardKinds();
      const canIncludeCore = effectiveCardKinds.includes('core');
      const canIncludeReplacement = effectiveCardKinds.includes('replacement');
      const sourceCoreItems = getSelectedReviewCoreItems();

      for (const coreItem of sourceCoreItems) {
        if (canIncludeCore) {
          const coreCard = {
            kind: 'core',
            id: coreItem.id,
            word: coreItem.word,
            category: coreItem.category || '',
            meaning_cn: coreItem.meaning_cn || '',
            meaning_en: coreItem.meaning_en || '',
            ipa_us: coreItem.ipa_us || '',
            ipa_uk: coreItem.ipa_uk || '',
          };
          const key = `core:${coreCard.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            deck.push(coreCard);
          }
        }

        if (canIncludeReplacement) {
          for (const replacementCard of collectReplacementCardsForCore(coreItem)) {
            const key = `replacement:${replacementCard.id || replacementCard.word}:${replacementCard.anchorCoreId}`;
            if (seen.has(key)) continue;
            seen.add(key);
            deck.push(replacementCard);
          }
        }
      }

      return deck;
    }

    function resetReviewDeck() {
      syncReviewFilterUI();
      reviewDeck = shuffleArray(buildReviewDeck());
      reviewIndex = 0;
      reviewCardFlipped = false;
      reviewAnswer = '';
      reviewLastWrongAnswer = '';
      reviewAnswerFeedbackHtml = '';
      renderReviewCard(reviewDeck[reviewIndex], { autoplay: true });
    }

    function flipReviewCard() {
      if (reviewMode !== 'cn') return;
      reviewCardFlipped = !reviewCardFlipped;
      const flipHost = document.getElementById('review-card-flip');
      if (flipHost) {
        flipHost.classList.toggle('is-flipped', reviewCardFlipped);
      }
    }

    function navigateReview(step, dir) {
      if (!reviewDeck.length) return;
      const target = reviewIndex + step;
      if (target < 0 || target >= reviewDeck.length) return;
      const host = document.getElementById('review-card-container');
      if (!host) {
        reviewIndex = target;
        reviewCardFlipped = false;
        reviewAnswer = '';
        reviewLastWrongAnswer = '';
        reviewAnswerFeedbackHtml = '';
        renderReviewCard(reviewDeck[reviewIndex], { autoplay: true });
        return;
      }
      host.classList.add(dir === 'left' ? 'slide-left' : 'slide-right');
      window.setTimeout(() => {
        host.classList.remove('slide-left', 'slide-right');
        reviewIndex = target;
        reviewCardFlipped = false;
        reviewAnswer = '';
        reviewLastWrongAnswer = '';
        reviewAnswerFeedbackHtml = '';
        renderReviewCard(reviewDeck[reviewIndex], { autoplay: true });
      }, 165);
    }

    function speakReviewWord(card) {
      if (!card || !card.word) return;
      speak(card.word);
    }

    function submitReviewAnswer() {
      if (reviewMode !== 'en') return;
      const card = reviewDeck[reviewIndex];
      if (!card) return;
      const result = checkReviewAnswer(card, reviewAnswer);
      if (result.correct) {
        reviewCardFlipped = true;
        reviewAnswer = '';
        reviewLastWrongAnswer = '';
        reviewAnswerFeedbackHtml = '';
        const flipHost = document.getElementById('review-card-flip');
        if (flipHost) {
          flipHost.classList.toggle('is-flipped', true);
          return;
        }
        renderReviewCard(card, { autoplay: false });
        return;
      }
      reviewCardFlipped = false;
      reviewLastWrongAnswer = reviewAnswer;
      reviewAnswer = '';
      reviewAnswerFeedbackHtml = result.diffHtml;
      renderReviewCard(card, { autoplay: false });
    }

    function markReviewWordForgotten() {
      if (reviewMode !== 'en') return;
      const card = reviewDeck[reviewIndex];
      if (!card) return;
      reviewCardFlipped = true;
      reviewAnswer = '';
      reviewLastWrongAnswer = '';
      reviewAnswerFeedbackHtml = '';
      renderReviewCard(card, { autoplay: false });
    }

    function bindReviewInputTouchGuards(answerInput) {
      if (!answerInput) return;
      const guardSwipe = (e) => {
        touchSwipeBlocked = true;
        touchStartX = null;
        e.stopPropagation();
      };
      ['touchstart', 'touchmove', 'touchend', 'click'].forEach((eventName) => {
        answerInput.addEventListener(eventName, guardSwipe, { passive: true });
      });
    }

    function renderReviewCard(card, options = {}) {
      const host = document.getElementById('review-card-container');
      if (!host) return;
      if (reviewMode === 'cn') {
        if (!card) {
          host.innerHTML = `
            <article class="review-card">
              <div class="review-card-empty">暂无匹配复习卡片</div>
              <div class="review-card-subtitle">当前筛选下没有题目，请调整范围筛选。</div>
            </article>
          `;
          return;
        }
        const reviewIpa = getReviewCardIpa(card);
        const relatedWords = card.kind === 'core'
          ? getRelatedWordsForCore(card)
          : [];
        const relatedHtml = card.kind === 'core' && relatedWords.length
          ? `
            <div class="review-related-module" data-review-related="core">
              <div class="review-related-label">关联词</div>
              <div class="review-related-list">
                ${relatedWords.map(word => `<span class="review-related-chip">${sanitizeHTML(word)}</span>`).join('')}
              </div>
            </div>
          `
          : '';
        const densityClass = getCopyDensityClass(
          [card.meaning_cn, relatedWords.join(' ')],
          relatedWords.length * 8,
        );
        const meaningFitClass = getHeadlineFitClass(card.meaning_cn);
        host.innerHTML = `
          <div class="review-card-shell v2-review-card-shell ${densityClass}">
            <div class="review-card-flip ${reviewCardFlipped ? 'is-flipped' : ''}" id="review-card-flip">
              <article class="review-card-face front ${densityClass}">
                <div class="review-card-meta">${sanitizeHTML(card.kind === 'replacement' ? '关联词' : '核心词')} · ${sanitizeHTML(card.category || '全部范围')}</div>
                <button id="review-word-btn" class="review-word-btn" aria-label="再次发音 ${sanitizeHTML(card.word || 'review')}">${sanitizeHTML(card.word || 'review')}</button>
                ${reviewIpa ? `<div class="review-card-ipa">${sanitizeHTML(reviewIpa)}</div>` : ''}
                <div class="review-card-hint">点击单词可再次发音，点击卡片翻面。</div>
              </article>
              <article class="review-card-face back ${densityClass}">
                <div class="review-card-meta">${sanitizeHTML(card.kind === 'replacement' ? '关联词' : '核心词')} · 背面</div>
                <div class="review-card-word-back">${sanitizeHTML(card.word || 'review')}</div>
                ${reviewIpa ? `<div class="review-card-ipa">${sanitizeHTML(reviewIpa)}</div>` : ''}
                <div class="review-card-meaning-cn ${meaningFitClass}">${sanitizeHTML(card.meaning_cn || '（中文含义待校验）')}</div>
                ${relatedHtml}
                <button id="review-next-btn" class="review-next-btn" type="button">下一个</button>
              </article>
            </div>
          </div>
        `;
        const flipHost = document.getElementById('review-card-flip');
        if (flipHost) {
          flipHost.addEventListener('click', (e) => {
            if (e.target.closest('#review-word-btn')) return;
            flipReviewCard();
          });
        }
        const wordBtn = document.getElementById('review-word-btn');
        if (wordBtn) {
          wordBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            speakReviewWord(card);
          });
        }
        const nextBtn = document.getElementById('review-next-btn');
        if (nextBtn) {
          nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateReview(1, 'left');
          });
        }
        if (options.autoplay) {
          speakReviewWord(card);
        }
        return;
      }
      if (reviewMode === 'en') {
        if (!card) {
          host.innerHTML = `
            <article class="review-card">
              <div class="review-card-empty">暂无匹配复习卡片</div>
              <div class="review-card-subtitle">当前筛选下没有题目，请调整范围筛选。</div>
            </article>
          `;
          return;
        }
        const reviewIpa = getReviewCardIpa(card);
        const backRelatedWords = card.kind === 'core'
          ? getRelatedWordsForCore(card)
          : [];
        const backRelatedHtml = card.kind === 'core' && backRelatedWords.length
          ? `
            <div class="review-related-module" data-review-related="core">
              <div class="review-related-label">关联词</div>
              <div class="review-related-list">
                ${backRelatedWords.map(word => `<span class="review-related-chip">${sanitizeHTML(word)}</span>`).join('')}
              </div>
            </div>
          `
          : '';

        const shouldShowBack = reviewCardFlipped;
        const frontDensityClass = getCopyDensityClass(card.meaning_cn);
        const backDensityClass = getCopyDensityClass(
          [card.meaning_cn, backRelatedWords.join(' ')],
          backRelatedWords.length * 8,
        );
        const shellDensityClass = backDensityClass || frontDensityClass;
        const meaningFitClass = getHeadlineFitClass(card.meaning_cn);
        const reviewFrontHtml = `
          <div class="review-card-shell v2-review-card-shell ${shellDensityClass}">
            <div class="review-card-flip ${shouldShowBack ? 'is-flipped' : ''}" id="review-card-flip">
              <article class="review-card-face front review-en-front ${frontDensityClass}">
                <div class="review-front-top">
                  <div class="review-card-meta">${sanitizeHTML(card.kind === 'replacement' ? '关联词' : '核心词')} · ${sanitizeHTML(card.category || '全部范围')}</div>
                  <button id="review-word-btn" class="review-replay-btn" aria-label="再次发音 ${sanitizeHTML(card.word || 'review')}">再听一次</button>
                </div>
                <div class="review-front-main v2-review-answer-grid">
                  <div class="review-card-meaning-cn ${meaningFitClass}">${sanitizeHTML(card.meaning_cn || '（中文含义待校验）')}</div>
                  <input
                    id="review-answer-input"
                    class="review-answer-input"
                    type="text"
                    inputmode="text"
                    autocomplete="off"
                    autocapitalize="none"
                    spellcheck="false"
                    placeholder="请输入英文拼写"
                    value="${sanitizeHTML(reviewAnswer)}"
                  />
                  <div class="review-error-slot">${reviewAnswerFeedbackHtml}</div>
                  <div class="review-action-row">
                    <button id="review-forget-btn" class="review-forget-btn" type="button">忘记了</button>
                    <button id="review-confirm-btn" class="review-confirm-btn" type="button">确认</button>
                  </div>
                </div>
              </article>
              <article class="review-card-face back ${backDensityClass}">
                <div class="review-card-meta">${sanitizeHTML(card.kind === 'replacement' ? '关联词' : '核心词')} · 背面</div>
                <div class="review-card-word-back">${sanitizeHTML(card.word || 'review')}</div>
                ${reviewIpa ? `<div class="review-card-ipa">${sanitizeHTML(reviewIpa)}</div>` : ''}
                <div class="review-card-meaning-cn ${meaningFitClass}">${sanitizeHTML(card.meaning_cn || '（中文含义待校验）')}</div>
                ${backRelatedHtml}
                <button id="review-next-btn" class="review-next-btn" type="button">下一个</button>
              </article>
            </div>
          </div>
        `;
        host.innerHTML = reviewFrontHtml;
        const wordBtn = document.getElementById('review-word-btn');
        const answerInput = document.getElementById('review-answer-input');
        const confirmBtn = document.getElementById('review-confirm-btn');
        const forgetBtn = document.getElementById('review-forget-btn');
        const nextBtn = document.getElementById('review-next-btn');
        if (wordBtn) {
          wordBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            speakReviewWord(card);
          });
        }
        if (answerInput) {
          bindReviewInputTouchGuards(answerInput);
          answerInput.addEventListener('input', (e) => {
            reviewAnswer = e.target.value;
          });
          answerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submitReviewAnswer();
            }
          });
          if (!shouldShowBack) {
            window.setTimeout(() => {
              answerInput.focus();
              answerInput.select();
            }, 0);
          }
        }
        if (confirmBtn) {
          confirmBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            submitReviewAnswer();
          });
        }
        if (forgetBtn) {
          forgetBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            markReviewWordForgotten();
          });
        }
        if (nextBtn) {
          nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateReview(1, 'left');
          });
        }
        if (options.autoplay) {
          speakReviewWord(card);
        }
        return;
      }
    }

    function reviewModeView() {
      renderReviewCard(reviewDeck[reviewIndex], { autoplay: false });
    }

    function setReviewMode(mode) {
      reviewMode = mode === 'cn' ? 'cn' : 'en';
      const isEn = reviewMode === 'en';
      const reviewTabEn = document.getElementById('review-tab-en');
      const reviewTabCn = document.getElementById('review-tab-cn');
      reviewTabEn.classList.toggle('active', isEn);
      reviewTabCn.classList.toggle('active', !isEn);
      reviewTabEn.setAttribute('aria-selected', String(isEn));
      reviewTabCn.setAttribute('aria-selected', String(!isEn));
      resetReviewDeck();
    }

    async function loadRootbookIndex() {
      if (rootbookIndexCache) return rootbookIndexCache;
      if (rootbookIndexPromise) return rootbookIndexPromise;
      rootbookIndexPromise = fetch('./rootbook_index.json', { cache: 'no-store' })
        .then(res => res.ok ? res.json() : {})
        .catch(() => ({}))
        .then(data => {
          rootbookIndexCache = data || {};
          return rootbookIndexCache;
        });
      return rootbookIndexPromise;
    }

    async function loadSupplementalDetails() {
      if (supplementalDetailCache) return supplementalDetailCache;
      if (supplementalDetailPromise) return supplementalDetailPromise;
      const bundled = window.__IELTS_DATA__ && window.__IELTS_DATA__.supplemental_details;
      if (bundled && typeof bundled === 'object') {
        supplementalDetailCache = bundled;
        return supplementalDetailCache;
      }
      supplementalDetailPromise = fetch('./supplemental_replacement_details.json', { cache: 'no-store' })
        .then(res => res.ok ? res.json() : {})
        .catch(() => ({}))
        .then(data => {
          supplementalDetailCache = data || {};
          return supplementalDetailCache;
        });
      return supplementalDetailPromise;
    }

    function buildDetailFromRootbook(word, entry) {
      if (!entry || typeof entry !== 'object') return null;
      const meaningCn = String(entry.meaning_cn || '').trim();
      const rootMemory = String(entry.root_memory || '').trim();
      const ipa = String(entry.ipa || '').trim();
      const phrases = Array.isArray(entry.phrases) ? entry.phrases : [];
      const example = String(entry.ielts_example || '').trim();
      if (!meaningCn && !rootMemory && !ipa && !phrases.length && !example) return null;
      return {
        word,
        ipa_us: ipa,
        ipa_uk: ipa,
        meaning_cn: meaningCn || '（中文释义待校验）',
        meaning_en: '',
        root_memory: rootMemory || '（词根待校验，避免误导）',
        phrases,
        ielts_example: example,
        source: 'rootbook'
      };
    }

    async function getSupplementalDetail(word) {
      const key = String(word || '').trim().toLowerCase();
      if (!key) return null;
      const supplementalDetails = await loadSupplementalDetails();
      if (supplementalDetails[key]) {
        return { source: 'supplemental_detail', ...supplementalDetails[key] };
      }
      if (AUDITED_DETAIL_OVERRIDES[key]) {
        return { word, source: 'audited_override', ...AUDITED_DETAIL_OVERRIDES[key] };
      }
      const index = await loadRootbookIndex();
      const entry = index[key] || null;
      return buildDetailFromRootbook(word, entry);
    }

    function getReplacementDetail(word, coreItem) {
      const wl = String(word || '').toLowerCase();
      const coreHit = coreByWord.get(wl);
      if (coreHit) {
        return {
          word: coreHit.word,
          ipa_us: coreHit.ipa_us || '',
          ipa_uk: coreHit.ipa_uk || '',
          meaning_cn: coreHit.meaning_cn || '',
          meaning_en: coreHit.meaning_en || '',
          root_memory: coreHit.root_memory || '（词根待补充）',
          phrases: coreHit.phrases || [],
          ielts_example: coreHit.ielts_example || '',
          source: 'core'
        };
      }

      const repl = replacementByWord.get(wl);
      if (repl) {
        const mean = String(repl.meaning_cn || '').replace(/^与主词.*?关系[；;]?/g, '').trim() || '（释义待校验）';
        return {
          word: repl.word || word,
          ipa_us: repl.ipa_us || '',
          ipa_uk: repl.ipa_uk || '',
          meaning_cn: mean,
          meaning_en: repl.meaning_en || '（英文释义待校验）',
          root_memory: repl.root_memory || '（词根待校验，避免误导）',
          phrases: repl.phrases || [],
          ielts_example: repl.ielts_example || '',
          source: 'replacement'
        };
      }

      return {
        word,
        ipa_us: '',
        ipa_uk: '',
        meaning_cn: '（中文释义待校验）',
        meaning_en: '',
        root_memory: '（词根待校验，避免误导）',
        phrases: [],
        ielts_example: '',
        source: 'fallback'
      };
    }

    function renderEnglishMeaningBlock(item) {
      const english = String(item.meaning_en || '').trim();
      if (!english || isPendingText(english)) return '';
      return `
        <details class="detail-optional">
          <summary>展开英文释义（辅助参考）</summary>
          <div class="muted-block">${sanitizeHTML(english)}</div>
        </details>
      `;
    }

    async function openSheet(word, coreItem) {
      let item = getReplacementDetail(word, coreItem);
      if (item.source === 'fallback' || isPendingText(item.meaning_cn) || isPendingText(item.root_memory)) {
        const supplemental = await getSupplementalDetail(word);
        if (supplemental) item = supplemental;
      }
      activeSheetItem = item;
      sheetWordShowsSyllables = false;
      const accentIpa = accent === 'en-US' ? item.ipa_us : item.ipa_uk;
      document.getElementById('sheet-title').innerText = `${item.word}（替换/命题词）`;
      const phraseHtml = formatPhraseHTML(item.phrases || []);
      const exampleHtml = formatExampleHTML(item.ielts_example);
      const englishBlock = renderEnglishMeaningBlock(item);
      const rootBlock = shouldDisplayRootMemory(item.root_memory)
        ? `<div class="item sheet-card"><span class="label l3">词根记忆</span><div class="txt">${sanitizeHTML(item.root_memory)}</div></div>`
        : '';
      const meaningFitClass = getHeadlineFitClass(item.meaning_cn);
      document.getElementById('sheet-body').innerHTML = `
        <div class="sheet-meaning ${meaningFitClass}">${sanitizeHTML(item.meaning_cn || '（中文释义待校验）')}</div>
        <div class="sheet-wordline">
          <button id="sheet-word-btn" class="sheet-word" aria-label="切换音节显示并播放 ${sanitizeHTML(item.word)}">${sanitizeHTML(item.word)}</button>
          <div class="sheet-sub">${sanitizeHTML(accentIpa || item.ipa_us || item.ipa_uk || '')}</div>
        </div>
        ${rootBlock}
        <div class="item"><span class="label l4">高频词组</span><div class="txt">${phraseHtml}</div></div>
        <div class="item"><span class="label l5">雅思真题例句</span><div class="txt example">${exampleHtml}</div></div>
        ${englishBlock}
      `;
      setWordButtonText('sheet-word-btn', item.word, sheetWordShowsSyllables);
      const sheetWordBtn = document.getElementById('sheet-word-btn');
      if (sheetWordBtn) {
        sheetWordBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleSheetWordDisplay();
        });
      }
      document.getElementById('modal-mask').classList.add('show');
      document.getElementById('bottom-sheet').classList.add('show');
      speak(item.word);
    }

    function closeSheet() {
      activeSheetItem = null;
      sheetWordShowsSyllables = false;
      document.getElementById('modal-mask').classList.remove('show');
      document.getElementById('bottom-sheet').classList.remove('show');
      stopSpeaking();
    }

    function switchView(mode) {
      closeSheet();
      viewMode = mode;
      document.getElementById('card-view').style.display = mode === 'card' ? 'flex' : 'none';
      document.getElementById('list-view').style.display = mode === 'list' ? 'flex' : 'none';
      document.getElementById('review-view').style.display = mode === 'review' ? 'flex' : 'none';
      document.getElementById('main-footer').style.display = mode === 'card' ? 'flex' : 'none';
      document.getElementById('tab-card').classList.toggle('active', mode === 'card');
      document.getElementById('tab-list').classList.toggle('active', mode === 'list');
      document.getElementById('tab-review').classList.toggle('active', mode === 'review');
      if (mode === 'list') {
        listPage = Math.floor(curIdx / perPage);
        renderList();
      } else if (mode === 'review') {
        resetReviewDeck();
      } else {
        render({ autoplay: false });
      }
    }

    function renderList() {
      const start = listPage * perPage;
      const items = curList.slice(start, start + perPage);
      const host = document.getElementById('list-items');
      if (!items.length) {
        host.innerHTML = `
          <div class="list-row v2-list-row">
            <div class="v2-list-meta">
              <div class="list-word">未找到匹配词</div>
              <div class="list-mean">请换一个关键词，或清空搜索恢复全部词卡。</div>
            </div>
            <div class="list-syn">搜索支持主词、中文义、替换词</div>
          </div>
        `;
        document.getElementById('page-num').innerText = '0 / 0';
        host.scrollTop = 0;
        return;
      }
      host.innerHTML = items.map((it, i) => {
        const replPreview = parseSynonyms(it.synonym_raw).join(', ');
        return `
          <button class="list-row v2-list-row" onclick="jumpTo(${start + i})" aria-label="打开 ${sanitizeHTML(it.word)}">
            <div class="v2-list-meta">
              <div class="list-word">${sanitizeHTML(it.word)}</div>
              <div class="list-mean">${sanitizeHTML(it.meaning_cn || '（中文释义待校验）')}</div>
            </div>
            <div class="list-syn">替换词: ${sanitizeHTML(replPreview || '暂无')}</div>
          </button>
        `;
      }).join('');
      document.getElementById('page-num').innerText = `${listPage + 1} / ${Math.max(1, Math.ceil(curList.length / perPage))}`;
      host.scrollTop = 0;
    }

    function jumpTo(idx) {
      curIdx = idx;
      switchView('card');
      render({ autoplay: true });
      updateProgress();
    }

    function changePage(step) {
      const max = Math.ceil(curList.length / perPage);
      const next = listPage + step;
      if (next < 0 || next >= max) return;
      listPage = next;
      renderList();
    }

    function onSearch() {
      const q = document.getElementById('search').value.trim().toLowerCase();
      if (!q) {
        curList = [...coreData];
      } else {
        curList = coreData.filter(it => {
          const base = [it.word, it.meaning_cn, it.meaning_en, it.root_memory, it.synonym_raw].join(' ').toLowerCase();
          if (base.includes(q)) return true;
          const anchoredReplacements = replacementByCoreId.get(it.id) || [];
          const replWords = parseSynonyms(it.synonym_raw).join(' ').toLowerCase();
          if (replWords.includes(q)) return true;
          return anchoredReplacements.some(repl => {
            const replacementBase = [
              repl.word,
              repl.meaning_cn,
              repl.meaning_en,
              repl.root_memory,
              repl.ielts_example,
              Array.isArray(repl.phrases) ? repl.phrases.join(' ') : '',
            ].join(' ').toLowerCase();
            return replacementBase.includes(q);
          });
        });
      }
      curIdx = 0;
      listPage = 0;
      if (viewMode === 'card') render({ autoplay: false });
      else if (viewMode === 'list') renderList();
      else resetReviewDeck();
      updateProgress();
    }

    function updateProgress() {
      const total = curList.length;
      const shown = total ? curIdx + 1 : 0;
      document.getElementById('progress').innerText = `${shown} / ${total}`;
    }

    init();
