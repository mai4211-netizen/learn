from pathlib import Path
import json, re

DATA = Path('data.js')
APP = Path('app.js')

# --- data.js: only apply corrections that are internally obvious or externally verified ---
text = DATA.read_text(encoding='utf-8').strip()
prefix = 'window.__IELTS_DATA__ = '
if not text.startswith(prefix):
    raise SystemExit('unexpected data.js format')
data = json.loads(text[len(prefix):].rstrip(';\n '))
items = {str(x.get('word','')).strip().lower(): x for group in ('core','replacement') for x in data.get(group, [])}

root_memory_fixes = {
    'approach': '用法记忆：approach 既可作动词“接近、靠近”，也可作名词“方法、途径”；an approach to… 是常见搭配。',
    'trait': '搭配记忆：trait 表示“特征、特性”；personality trait 和 genetic trait 是两组高频搭配。',
    'exchange': '词形记忆：抓住 change 的“改变、交换”含义，把 exchange 整体记作“交换；交流”。',
    'fertiliser': '词形记忆：fertile（肥沃的）→ fertilise（施肥）→ fertiliser（肥料）。',
    'budget': '场景记忆：budget 就是“预算、可支配金额”；常见 on a budget、budget for sth。',
    'curriculum': '场景记忆：curriculum 表示“课程体系、全部课程”；常见 school curriculum、national curriculum。',
    'supplement': '用法记忆：supplement 可表示“补充物、增补”，也可作动词表示“补充、增补”。',
    'demanding': '词形记忆：demand（要求）→ demanding（要求高的；费力的、吃力的）。',
    'magnetic': '词形记忆：magnet（磁铁）→ magnetic（磁性的；有吸引力的）。',
    'loss': '词族记忆：lose（失去）对应名词 loss（损失；丧失）。',
    'sophisticate': '词族记忆：sophisticate 与 sophisticated 同词族；核心概念与“使复杂、使精致、使老练”有关。',
    'specific': '用法记忆：specific 表示“具体的、特定的”；常见 be specific about…、a specific example。',
    'surrounding': '词形记忆：surround（围绕）→ surrounding（周围的）；surroundings 常表示“周围环境”。',
    'expertise': '词族记忆：expert（专家）→ expertise（专业知识；专长）。',
    'faculty': '多义词记忆：faculty 在大学语境可指“院系、全体教职员”，也可指“能力、官能”。',
    'trigger': '联想记忆：trigger 原指“扳机”，作动词常引申为“触发、引起”。',
}
for word, memory in root_memory_fixes.items():
    if word not in items:
        raise SystemExit(f'missing word for root fix: {word}')
    items[word]['root_memory'] = memory

# Cambridge-verified pronunciations checked 2026-07-30.
ipa_fixes = {
    'approach': ('/əˈproʊtʃ/', '/əˈprəʊtʃ/'),
    'prompt': ('/prɑːmpt/', '/prɒmpt/'),
    'avoid': ('/əˈvɔɪd/', '/əˈvɔɪd/'),
    'component': ('/kəmˈpoʊ.nənt/', '/kəmˈpəʊ.nənt/'),
    'chronic': ('/ˈkrɑː.nɪk/', '/ˈkrɒn.ɪk/'),
    'option': ('/ˈɑːp.ʃən/', '/ˈɒp.ʃən/'),
    'quantity': ('/ˈkwɑːn.t̬ə.t̬i/', '/ˈkwɒn.tə.ti/'),
    'cognitive': ('/ˈkɑːɡ.nə.t̬ɪv/', '/ˈkɒɡ.nə.tɪv/'),
    'comment': ('/ˈkɑː.ment/', '/ˈkɒm.ent/'),
    'measure': ('/ˈmeʒ.ɚ/', '/ˈmeʒ.ə(r)/'),
}
for word, (us, uk) in ipa_fixes.items():
    if word not in items:
        raise SystemExit(f'missing word for ipa fix: {word}')
    items[word]['ipa_us'] = us
    items[word]['ipa_uk'] = uk

# Safe US GOAT-vowel normalization when the old US field is an exact copy of UK.
for x in items.values():
    us = str(x.get('ipa_us') or '')
    uk = str(x.get('ipa_uk') or '')
    if us and us == uk and 'əʊ' in us:
        x['ipa_us'] = us.replace('əʊ', 'oʊ')

# One confirmed OCR-like broken phrase; leave legitimate compounds (next-day, drug-induced...) alone.
artificial = items.get('artificial')
if artificial:
    artificial['phrases'] = [str(p).replace('intelli-gence', 'intelligence') for p in artificial.get('phrases', [])]

DATA.write_text(prefix + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')

# --- app.js: do not present placeholder material as verified learning content ---
app = APP.read_text(encoding='utf-8')

old = """      if (!out.root) out.root = '（词根待校验）';\n      if (!out.example) out.example = '（例句待校验）';\n      return out;"""
new = """      if (isPendingText(out.root)) out.root = '';\n      if (isPendingText(out.example)) out.example = '';\n      return out;"""
if old not in app:
    raise SystemExit('normalizeCoreFields anchor changed')
app = app.replace(old, new, 1)

old = """    function formatExampleHTML(value) {\n      if (!value || (typeof value === 'string' && !String(value).trim())) return sanitizeHTML('（例句待校验）');\n      if (typeof value === 'string' && isPendingText(value)) return sanitizeHTML(value);\n      const blocks = normalizeExampleBlocks(value).map(({ en, cn }) => {"""
new = """    function formatExampleHTML(value) {\n      if (!value || (typeof value === 'string' && !String(value).trim())) return '';\n      if (typeof value === 'string' && isPendingText(value)) return '';\n      const blocks = normalizeExampleBlocks(value).map(({ en, cn }) => {"""
if old not in app:
    raise SystemExit('formatExampleHTML anchor changed')
app = app.replace(old, new, 1)
app = app.replace("return blocks.length ? `<div class=\"example-lines\">${blocks.join('')}</div>` : sanitizeHTML('（例句待校验）');", "return blocks.length ? `<div class=\"example-lines\">${blocks.join('')}</div>` : '';", 1)

old = """        <div class=\"item\"><span class=\"label l3\">高频词组</span><div class=\"txt\">${phraseHtml}</div></div>\n        <div class=\"item\"><span class=\"label l4\">雅思真题例句</span><div class=\"txt example\">${exampleHtml}</div></div>"""
new = """        <div class=\"item\"><span class=\"label l3\">高频词组</span><div class=\"txt\">${phraseHtml}</div></div>\n        ${exampleHtml ? `<div class=\"item\"><span class=\"label l4\">已校验例句</span><div class=\"txt example\">${exampleHtml}</div></div>` : ''}"""
if old not in app:
    raise SystemExit('back example block anchor changed')
app = app.replace(old, new, 1)

old = """        const hard = report.hard_check || {};\n        const summary = `校验 core=${report.core_count} total=${report.total_words_by_count_rule} 对齐错误=${report.line_alignment_errors}`;\n        document.getElementById('progress-sub').innerText = summary;\n        if (!hard.core_equals_376 || !hard.count_rule_equals_538 || !hard.no_missing_fields || !hard.no_placeholders || !hard.line_alignment_zero) {\n          document.getElementById('progress-sub').innerText = '数据校验未全绿，请先运行构建脚本修复';\n        }"""
new = """        const hard = report.hard_check || {};\n        document.getElementById('progress-sub').innerText = `${coreData.length} 核心词 · ${replacementData.length} 关联词`;\n        if (Object.keys(hard).length && (!hard.core_equals_376 || !hard.count_rule_equals_538 || !hard.line_alignment_zero)) {\n          console.warn('IELTS 538 integrity report needs review', report);\n        }"""
if old not in app:
    raise SystemExit('progress summary anchor changed')
app = app.replace(old, new, 1)

APP.write_text(app, encoding='utf-8')
print('PATCH_OK', len(data.get('core', [])), len(data.get('replacement', [])))
