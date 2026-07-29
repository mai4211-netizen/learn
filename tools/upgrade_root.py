from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
EXPECTED_BLOB = "7ab78719c38bf8f715626cb39f5ba14d5091f12a"


def fail(message):
    raise SystemExit(message)


def regex_once(text, pattern, replacement, label):
    out, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        fail(f"{label}: expected one replacement, got {count}")
    return out


html = INDEX.read_text(encoding="utf-8")
blob_payload = f"blob {len(html.encode('utf-8'))}\0".encode() + html.encode("utf-8")
if hashlib.sha1(blob_payload).hexdigest() != EXPECTED_BLOB:
    fail("index.html source revision changed; refusing unsafe patch")

old_viewport = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />'
new_viewport = '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />'
if html.count(old_viewport) != 1:
    fail("viewport anchor mismatch")
html = html.replace(old_viewport, new_viewport, 1)

search_line = '    <input id="search" class="search-box" type="text" placeholder="搜索单词、含义或同义词..." oninput="onSearch()" />'
audio_settings = '''    <input id="search" class="search-box" type="search" inputmode="search" autocomplete="off" placeholder="搜索单词、含义或同义词..." oninput="onSearch()" />
    <details class="audio-settings" id="audio-settings">
      <summary>发音设置</summary>
      <div class="audio-settings-body">
        <label for="voice-select">声音</label>
        <select id="voice-select" aria-label="选择英语发音声音"><option value="">自动选择</option></select>
      </div>
    </details>'''
if html.count(search_line) != 1:
    fail("search anchor mismatch")
html = html.replace(search_line, audio_settings, 1)

style_match = re.search(r"<style>(.*?)</style>", html, re.S)
if not style_match:
    fail("style block missing")
css = style_match.group(1).strip() + "\n"
html = html[:style_match.start()] + '<link rel="stylesheet" href="./styles.css?v=20260730">' + html[style_match.end():]

scripts = list(re.finditer(r"<script(?:\s[^>]*)?>(.*?)</script>", html, re.S))
if len(scripts) != 2:
    fail(f"expected 2 inline scripts, found {len(scripts)}")
data_match = next((m for m in scripts if "window.__IELTS_DATA__" in m.group(1)), None)
app_match = next((m for m in scripts if "window.__IELTS_DATA__" not in m.group(1)), None)
if not data_match or not app_match:
    fail("could not identify data/app scripts")
data_js = data_match.group(1).strip() + "\n"
app_js = app_match.group(1).strip() + "\n"
for start, end, replacement in sorted([
    (data_match.start(), data_match.end(), '<script src="./data.js?v=20260730"></script>'),
    (app_match.start(), app_match.end(), '<script src="./app.js?v=20260730"></script>'),
], reverse=True):
    html = html[:start] + replacement + html[end:]

syllable_block = r'''const SYLLABLE_OVERRIDES = Object.freeze({
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

    function buildPronHint'''
app_js = regex_once(
    app_js,
    r"function splitSyllables\(word\) \{.*?\n\s*\}\n\n\s*function buildPronHint",
    syllable_block,
    "syllable refactor",
)

example_block = r'''function normalizeExampleBlocks(value) {
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

    function parseSynonyms'''
app_js = regex_once(
    app_js,
    r"function formatExampleHTML\(text\) \{.*?\n\s*\}\n\n\s*function parseSynonyms",
    example_block,
    "example parser refactor",
)

category_block = r'''function getCategoryId(coreItem) {
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

    function collectReplacementCardsForCore'''
app_js = regex_once(
    app_js,
    r"function coreMatchesSelectedCats\(coreItem\) \{.*?\n\s*\}\n\n\s*function collectReplacementCardsForCore",
    category_block,
    "category filter refactor",
)
app_js = regex_once(
    app_js,
    r"\s*const category = String\(coreItem\.category \|\| ''\)\.toUpperCase\(\);\n\s*if \(/\^CAT 1\\b/\.test\(category\)\) cat1Count \+= totalForCat;\n\s*if \(/\^CAT 2\\b/\.test\(category\)\) cat2Count \+= totalForCat;\n\s*if \(/\^CAT 3\\b/\.test\(category\)\) cat3Count \+= totalForCat;",
    "\n        const categoryId = getCategoryId(coreItem);\n        if (categoryId === 1) cat1Count += totalForCat;\n        if (categoryId === 2) cat2Count += totalForCat;\n        if (categoryId === 3) cat3Count += totalForCat;",
    "category stats refactor",
)

voice_block = r'''const VOICE_PREF_KEY = 'ielts538.voiceURI';
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

    function pickIOSVoice'''
app_js = regex_once(
    app_js,
    r"function initVoices\(\) \{.*?\n\s*\}\n\n\s*function pickIOSVoice",
    voice_block,
    "voice init refactor",
)

pick_old = """function pickVoice() {
      if (shouldUseNativeMobileSpeech()) {
        return pickIOSVoice();
      }
      if (!voicePool.length) return null;"""
pick_new = """function pickVoice() {
      if (!voicePool.length) return null;
      if (preferredVoiceURI) {
        const preferred = voicePool.find(voice => String(voice.voiceURI || voice.name || '') === preferredVoiceURI);
        if (preferred) return preferred;
      }
      if (shouldUseNativeMobileSpeech()) {
        return pickIOSVoice();
      }"""
if app_js.count(pick_old) != 1:
    fail("pickVoice anchor mismatch")
app_js = app_js.replace(pick_old, pick_new, 1)

css += r'''

/* 2026-07-30: visual + resilience upgrade */
:root {
  --primary: #315f92;
  --primary-deep: #26231f;
  --secondary: #766654;
  --danger: #9b443c;
  --bg: #e3dac9;
  --card: #fbf7ef;
  --text: #292621;
  --muted: #6e6255;
  --line: rgba(58, 48, 39, 0.14);
  --chip: rgba(232, 224, 210, 0.72);
  --chip-border: rgba(58, 48, 39, 0.14);
  --shadow: 0 24px 60px rgba(67, 49, 30, 0.13), 0 2px 8px rgba(67, 49, 30, 0.06);
}
html { height: 100%; background: #d8ccb8; }
body {
  height: 100dvh;
  min-height: 100dvh;
  overflow: hidden;
  background: radial-gradient(circle at 20% -10%, rgba(255,255,255,.72), transparent 34%), linear-gradient(180deg, #e8dfcf 0%, #d7c9b2 100%);
  -webkit-text-size-adjust: 100%;
  text-rendering: optimizeLegibility;
}
header { width: min(100%, 1040px); margin-inline: auto; padding: max(20px, env(safe-area-inset-top)) 24px 10px; }
.head-row { gap: 18px; }
.title { font-size: clamp(28px, 4vw, 38px); }
.title::before { height: 7px; border-radius: 999px; box-shadow: 14px 0 0 rgba(49,95,146,.18); }
.tabs { padding: 4px; gap: 3px; background: rgba(250,246,238,.56); border: 1px solid rgba(58,48,39,.10); box-shadow: inset 0 1px rgba(255,255,255,.55); }
.tab-btn, .review-tab-btn { min-height: 38px; padding-inline: 15px; border: 0; background: transparent; box-shadow: none; }
.tab-btn.active, .review-tab-btn.active { background: #2c2925; color: #fffaf2; box-shadow: 0 5px 16px rgba(40,35,30,.16); }
.search-box { margin-top: 12px; min-height: 48px; border-radius: 16px; padding: 0 16px; background: rgba(251,247,239,.78); border-color: rgba(58,48,39,.13); box-shadow: 0 5px 18px rgba(67,49,30,.045), inset 0 1px rgba(255,255,255,.66); outline: none; }
.search-box:focus { border-color: rgba(49,95,146,.58); box-shadow: 0 0 0 3px rgba(49,95,146,.12); }
.audio-settings { margin-top: 7px; width: fit-content; color: var(--muted); font-size: 12px; }
.audio-settings summary { cursor: pointer; list-style: none; font-weight: 750; padding: 4px 2px; }
.audio-settings summary::-webkit-details-marker { display: none; }
.audio-settings summary::after { content: '  +'; opacity: .55; }
.audio-settings[open] summary::after { content: '  −'; }
.audio-settings-body { position: absolute; z-index: 8; margin-top: 4px; display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 14px; background: rgba(251,247,239,.97); border: 1px solid rgba(58,48,39,.12); box-shadow: 0 14px 34px rgba(67,49,30,.13); }
.audio-settings select { max-width: min(62vw, 320px); min-height: 36px; border: 1px solid rgba(58,48,39,.16); border-radius: 10px; background: #fffaf2; color: var(--text); padding: 0 8px; font: inherit; }
main { width: min(100%, 1040px); margin-inline: auto; overflow: hidden; }
#card-view, #list-view, #review-view { min-height: 0; }
.v2-card-wrap { width: min(88vw, 520px); height: min(70dvh, 680px); max-height: 680px; }
.face, .v2-shell .face { border-radius: 28px; border-color: rgba(58,48,39,.13); background: linear-gradient(180deg, rgba(255,255,255,.44), rgba(255,255,255,0) 24%), #fbf7ef; }
.face::before { height: 6px; border-radius: 999px; }
.word-btn { color: #25221f; letter-spacing: -.045em; }
.category { color: #746657; }
.ghost-pill, .chip-btn { transition: transform 140ms ease, background 140ms ease, border-color 140ms ease; }
.chip-btn { background: rgba(230,221,205,.68); }
.list-scroll, .v2-list-scroll { scrollbar-gutter: stable; }
.list-row, .v2-list-row, .review-scope-panel, .review-card-face { border-color: rgba(58,48,39,.12); }
#main-footer { width: min(calc(100% - 24px), 560px); margin: 0 auto max(10px, env(safe-area-inset-bottom)); border-radius: 22px; background: rgba(250,246,238,.72); border: 1px solid rgba(58,48,39,.10); box-shadow: 0 8px 24px rgba(67,49,30,.07); backdrop-filter: blur(14px); }
button:focus-visible, .search-box:focus-visible, .chip-btn:focus-visible, .word-btn:focus-visible, select:focus-visible, summary:focus-visible { outline: 3px solid rgba(49,95,146,.30); outline-offset: 2px; }
@media (hover: hover) {
  .tab-btn:hover:not(.active), .review-tab:hover:not(.active), .chip-btn:hover, .ghost-pill:hover { background: rgba(255,250,242,.72); }
  .chip-btn:hover, .ghost-pill:hover { transform: translateY(-1px); }
}
@media (max-width: 640px) {
  header { padding: max(10px, env(safe-area-inset-top)) 14px 7px; }
  .head-row { flex-direction: row; align-items: center; justify-content: space-between; gap: 8px; }
  .title { font-size: clamp(18px, 5.3vw, 22px); padding-top: 10px; }
  .tabs { flex: 0 0 auto; }
  .tab-btn { min-width: 48px; min-height: 36px; padding-inline: 10px; font-size: 12px; }
  .search-box { margin-top: 9px; min-height: 44px; font-size: 16px; }
  .audio-settings { margin-top: 3px; }
  main { width: 100%; }
  #card-view { padding: 4px 10px 8px; align-items: center; }
  .v2-card-wrap { width: min(94vw, 500px); height: min(62dvh, 520px); }
  .front { padding: 30px 18px 14px; }
  .back { padding: 30px 18px 18px; }
  .face { border-radius: 24px; }
  #main-footer { width: calc(100% - 20px); margin-bottom: max(6px, env(safe-area-inset-bottom)); }
}
@media (max-width: 390px) {
  .title { font-size: 17px; }
  .tab-btn { min-width: 44px; padding-inline: 8px; }
  .v2-card-wrap { height: min(60dvh, 488px); }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
}
'''

if '<body class="v2-shell v2-only">' not in html:
    fail("body build anchor missing")
html = html.replace('<body class="v2-shell v2-only">', '<body class="v2-shell v2-only" data-build="2026-07-30">', 1)

(ROOT / "styles.css").write_text(css, encoding="utf-8")
(ROOT / "data.js").write_text(data_js, encoding="utf-8")
(ROOT / "app.js").write_text(app_js, encoding="utf-8")
INDEX.write_text(html, encoding="utf-8")

# Adversarial static checks.
checks = {
    "zoom enabled": "user-scalable=no" not in html and "maximum-scale" not in html,
    "css externalized": "<style>" not in html and html.count("styles.css") == 1,
    "scripts externalized": html.count("data.js") == 1 and html.count("app.js") == 1,
    "dataset not duplicated": "window.__IELTS_DATA__" not in html,
    "dynamic viewport": "100dvh" in css,
    "reduced motion": "prefers-reduced-motion" in css,
    "voice preference": "VOICE_PREF_KEY" in app_js and "localStorage.setItem(VOICE_PREF_KEY" in app_js,
    "category parser centralized": app_js.count("function getCategoryId") == 1,
    "structured examples first": "function normalizeExampleBlocks" in app_js,
}
failed = [name for name, ok in checks.items() if not ok]
if failed:
    fail("static checks failed: " + ", ".join(failed))

m = re.search(r"window\.__IELTS_DATA__\s*=\s*(\{.*\})\s*;?\s*$", data_js, re.S)
if not m:
    fail("data assignment parse failed")
bundle = json.loads(m.group(1))
core = bundle.get("core", [])
replacement = bundle.get("replacement", [])
if (len(core), len(replacement), len(core) + len(replacement)) != (376, 162, 538):
    fail(f"dataset count changed: {len(core)} + {len(replacement)}")
core_ids = [str(item.get("id")) for item in core]
if len(set(core_ids)) != len(core_ids):
    fail("duplicate core IDs")
core_id_set = set(core_ids)
orphans = [item.get("id") for item in replacement if str(item.get("anchor_core_id")) not in core_id_set]
if orphans:
    fail(f"orphan replacements: {orphans[:5]}")

print("PATCH_OK 376 core + 162 replacement; 0 orphan anchors")
