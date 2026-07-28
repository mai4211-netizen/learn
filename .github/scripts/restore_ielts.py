from pathlib import Path
import base64
import gzip
import hashlib
import traceback

source = Path('ielts-part2-shared-v2/assets')
debug = []
try:
    parts = []
    for i in range(8):
        path = source / f'part-{i:02d}.txt'
        text = path.read_text(encoding='utf-8').strip()
        debug.append(f'{path}: {len(text)} chars')
        parts.append(text)
    encoded = ''.join(parts)
    debug.append(f'encoded: {len(encoded)} chars')
    compressed = base64.b64decode(encoded, validate=True)
    debug.append(f'compressed: {len(compressed)} bytes')
    raw = gzip.decompress(compressed)
    debug.append(f'uncompressed: {len(raw)} bytes')
    digest = hashlib.sha256(raw).hexdigest()
    debug.append(f'sha256: {digest}')
    expected = 'f77da22c265c39ee51f20ba3c1d17360995d370a653692557558a0e856092a09'
    if digest != expected:
        raise RuntimeError(f'checksum mismatch: {digest}')
    html = raw.decode('utf-8')
    debug.append(f'cards: {html.count("class=\"card\"")}')
    for target in (
        Path('ielts-part2-shared-v2/index.html'),
        Path('ielts-part2-shared-v2-direct/index.html'),
        Path('ielts-part2-shared-v2-static/index.html'),
    ):
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(raw)
        debug.append(f'wrote {target}')
except Exception:
    debug.append(traceback.format_exc())

Path('ielts-restore-debug.txt').write_text('\n'.join(debug), encoding='utf-8')
print('\n'.join(debug))
if not Path('ielts-part2-shared-v2-static/index.html').exists():
    raise SystemExit(1)
