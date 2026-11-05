"""Generate stable, content-addressed Jenny MP3s only for changed final answers.

Files are named Q01-<text-hash>.mp3 so an older page cannot accidentally play
new audio with older answer text. Old named audio remains for existing offline tabs.
"""
import asyncio
import json
import math
import re
import subprocess
from pathlib import Path

import edge_tts
from mutagen.mp3 import MP3

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "audio"
MANIFEST = OUT / "audio-manifest.js"
EXPORTER = ROOT / "tools" / "export-audio-answers.js"

def get_answers():
    result = subprocess.run(["node", str(EXPORTER)], capture_output=True, text=True, check=True)
    return json.loads(result.stdout)

def name_for(q, entry):
    return f"{q}-{entry['hash'][:16]}.mp3"

def validate_audio(path, text):
    if not path.exists() or path.stat().st_size < 8000:
        raise ValueError(f"{path.name}: file missing or too small")
    duration = MP3(str(path)).info.length
    word_count = len(re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)?", text))
    if not math.isfinite(duration) or duration <= 0:
        raise ValueError(f"{path.name}: invalid MP3 duration")
    words_per_minute = word_count * 60 / duration
    if not 70 <= words_per_minute <= 250:
        raise ValueError(
            f"{path.name}: unexpected duration {duration:.1f}s for "
            f"{word_count} words ({words_per_minute:.0f} WPM)"
        )

async def synthesize(q, entry, voice, rate, semaphore):
    output = OUT / name_for(q, entry)
    part = OUT / ("." + output.name + ".part.mp3")
    async with semaphore:
        for attempt in range(4):
            try:
                part.unlink(missing_ok=True)
                await edge_tts.Communicate(entry["text"], voice=voice, rate=rate).save(str(part))
                validate_audio(part, entry["text"])
                part.replace(output)
                print(f"{q}: saved {output.name}, {output.stat().st_size} bytes", flush=True)
                return
            except Exception as ex:
                part.unlink(missing_ok=True)
                if attempt == 3:
                    raise RuntimeError(f"{q}: synthesis failed after 4 tries") from ex
                await asyncio.sleep(4 * (attempt + 1))

async def main():
    source = get_answers()
    items = source["items"]
    if len(items) != 58:
        raise ValueError(f"Expected 58 answers; got {len(items)}")
    OUT.mkdir(parents=True, exist_ok=True)
    changed = []
    for q, entry in sorted(items.items()):
        path = OUT / name_for(q, entry)
        if path.exists():
            validate_audio(path, entry["text"])
        else:
            changed.append((q, entry))
    print(f"Generate {len(changed)} / 58 immutable MP3s", flush=True)
    sem = asyncio.Semaphore(3)
    await asyncio.gather(*[
        synthesize(q, entry, source["voice"], source["rate"], sem)
        for q, entry in changed
    ])
    for q, entry in items.items():
        validate_audio(OUT / name_for(q, entry), entry["text"])
    versions = {q: entry["hash"][:16] for q, entry in sorted(items.items())}
    payload = {"voice": source["voice"], "rate": source["rate"], "versions": versions}
    manifest = ("window.P2_2026Q4_AUDIO = "
                + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n")
    if not MANIFEST.exists() or MANIFEST.read_text("utf8") != manifest:
        MANIFEST.write_text(manifest, encoding="utf8")
    print("Verified all 58 duration-checked, source-versioned MP3s", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
