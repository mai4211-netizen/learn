from pathlib import Path

patcher = Path(__file__).with_name('upgrade_root.py')
source = patcher.read_text(encoding='utf-8')

old_scripts = '''data_match = next((m for m in scripts if "window.__IELTS_DATA__" in m.group(1)), None)\napp_match = next((m for m in scripts if "window.__IELTS_DATA__" not in m.group(1)), None)\nif not data_match or not app_match:\n    fail("could not identify data/app scripts")'''
new_scripts = '''data_match, app_match = scripts\nif "window.__IELTS_DATA__" not in data_match.group(1):\n    fail("first inline script is not the dataset")'''
if old_scripts not in source:
    raise SystemExit('script detection compatibility anchor missing')
source = source.replace(old_scripts, new_scripts, 1)

old_sub = "out, count = re.subn(pattern, replacement, text, count=1, flags=re.S)"
new_sub = "out, count = re.subn(pattern, lambda _match: replacement, text, count=1, flags=re.S)"
if old_sub not in source:
    raise SystemExit('regex replacement compatibility anchor missing')
source = source.replace(old_sub, new_sub, 1)

namespace = {'__file__': str(patcher), '__name__': '__main__'}
exec(compile(source, str(patcher), 'exec'), namespace)
