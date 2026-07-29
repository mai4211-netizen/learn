from pathlib import Path
import json, re

text = Path('data.js').read_text(encoding='utf-8').strip()
prefix = 'window.__IELTS_DATA__ = '
assert text.startswith(prefix)
payload = text[len(prefix):].rstrip(';\n ')
data = json.loads(payload)
core = data.get('core', [])
repl = data.get('replacement', [])
all_items = [('core', x) for x in core] + [('replacement', x) for x in repl]

print('COUNTS', len(core), len(repl), len(all_items))

# Hard integrity checks
assert len(core) == 376, len(core)
assert len(all_items) == 538, len(all_items)
ids = [x.get('id') for _, x in all_items]
assert len(ids) == len(set(ids)), 'duplicate ids'
words = [(k, str(x.get('word','')).strip().lower()) for k,x in all_items]
missing_word = [x.get('id') for _,x in all_items if not str(x.get('word','')).strip()]
assert not missing_word, missing_word

# Placeholder / low-confidence inventory
for marker in ['待校验', '待补充', '中文释义待校验']:
    hits = [(kind, x.get('id'), x.get('word')) for kind,x in all_items if marker in json.dumps(x, ensure_ascii=False)]
    print(f'MARKER {marker}: {len(hits)}')
    print('  ', hits[:30])

# Obvious copy/paste root-memory mismatch heuristic.
def latin_chunks(s):
    return [t.lower() for t in re.findall(r'[A-Za-z]{3,}', str(s or ''))]

def normalize_word(w):
    return re.sub(r'[^a-z]', '', str(w or '').lower())

sus = []
for kind, x in all_items:
    mem = str(x.get('root_memory') or '')
    if not mem or not re.search(r'[A-Za-z]', mem):
        continue
    w = normalize_word(x.get('word'))
    chunks = latin_chunks(mem)
    # Keep affix/root chunks that plausibly overlap target spelling.
    overlaps = [c for c in chunks if c in w or (len(c) >= 4 and w[:3] in c) or (len(w) >= 5 and c[:3] in w)]
    long_chunks = [c for c in chunks if len(c) >= 4 and c not in {'word','reading','fixed','phrase'}]
    if long_chunks and not overlaps:
        sus.append((kind, x.get('id'), x.get('word'), mem, long_chunks[:8]))
print('ROOT_MEMORY_SUSPECTS', len(sus))
for row in sus[:120]: print('ROOT?', *row)

# IPA dialect duplicates are not automatically wrong, but flag common vowel spellings where
# copying UK to US is especially suspicious and worth authoritative review.
ipa_sus=[]
for kind,x in all_items:
    us=str(x.get('ipa_us') or '').strip(); uk=str(x.get('ipa_uk') or '').strip()
    if us and uk and us == uk and any(sym in us for sym in ['ɒ','əʊ']):
        ipa_sus.append((kind,x.get('id'),x.get('word'),us,uk))
print('IPA_DIALECT_SUSPECTS', len(ipa_sus))
for row in ipa_sus[:120]: print('IPA?', *row)

# Broken typography / OCR-like tokens in phrases.
phrase_sus=[]
for kind,x in all_items:
    for p in x.get('phrases') or []:
        if re.search(r'[A-Za-z]{3,}-[A-Za-z]{3,}', str(p)):
            phrase_sus.append((kind,x.get('id'),x.get('word'),p))
print('PHRASE_HYPHEN_SUSPECTS', len(phrase_sus))
for row in phrase_sus[:80]: print('PHRASE?', *row)

# Replacement references integrity
repl_ids={x.get('id') for x in repl}
missing_refs=[]
for x in core:
    for rid in x.get('replacement_ids') or []:
        if rid not in repl_ids: missing_refs.append((x.get('id'),rid))
print('MISSING_REPLACEMENT_REFS', len(missing_refs), missing_refs[:30])
assert not missing_refs
