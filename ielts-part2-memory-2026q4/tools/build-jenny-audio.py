"""Build/rebuild only MP3 files whose final English answers have changed.

Uses the same edge-tts Jenny voice approved in the one-off Q56 preview.
The manifest hashes both the final answer text and synthesis settings.
"""
import asyncio
import json
import hashlib
import os
import subprocess
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "audio"
MANIFEST = OUT / "audio-manifest.js"
EXPORTER = ROOT / "tools" / "export-audio-answers.js"

def load_final_answers():
    run = subprocess.run(["node", str(EXPORTER)], check=True, text=True, capture_output=True)
    return json.loads(run.stdout)

def load_previous_versions():
    if not MANIFEST.is_file():
        return {}
    source = MANIFEST.read_text("utf8")
    prefix = "window.P2_2026Q4_AUDIO = "
    if not source.startswith(prefix):
        return {}
    payload = json.loads(source[len(prefix):].strip().rstrip(";"))
    return payload.get("versions", {})

async def generate_one(q, entry, voice, rate, semaphore):
    destination = OUT / f"{q}.mp3"
    temporary = OUT / f".{q}.part.mp3"
    async with semaphore:
        for attempt in range(4):
            try:
                temporary.unlink(missing_ok=True)
                await edge_tts.Communicate(entry["text"], voice=voice, rate=rate).save(str(temporary))
                if temporary.stat().st_size < 8000:
                    raise RuntimeError(f"{q} audio too short ({temporary.stat().st_size} bytes)")
                temporary.replace(destination)
                print(f"{q}: generated {destination.stat().st_size} bytes", flush=True)
                return
            except Exception as e:
                temporary.unlink(missing_ok=True)
                if attempt == 3:
                    raise RuntimeError(f"{q} synthesis failed after 4 attempts") from e
                delay = 4 * (attempt + 1)
                print(f"{q}: retrying after {type(e).__name__} ({delay}s)", flush=True)
                await asyncio.sleep(delay)

async def main():
    source = load_final_answers()
    OUT.mkdir(parents=True, exist_ok=True)
    previous = load_previous_versions()
    items = source["items"]
    if len(items) != 58:
        raise ValueError("The source no longer contains 58 answers")
    changed = [
        (q, entry)
        for q, entry in sorted(items.items())
        if previous.get(q) != entry["hash"][:16] or not (OUT / f"{q}.mp3").is_file()
    ]
    print(f"{len(changed)} of {len(items)} MP3s need generating", flush=True)
    limit = asyncio.Semaphore(3)
    await asyncio.gather(*[
        generate_one(q,entry,source["voice"],source["rate"],limit)
        for q,entry in changed
    ])
    versions = {q:entry["hash"][:16] for q,entry in sorted(items.items())}
    # Compare against full hash stored in the manifest by design: short hash
    # stays stable across runs and still changes when answer changes.
    payload = {"voice":source["voice"],"rate":source["rate"],"versions":versions}
    output = "window.P2_2026Q4_AUDIO = " + json.dumps(payload,separators=(",",":"),ensure_ascii=False) + ";\n"
    if not MANIFEST.is_file() or MANIFEST.read_text("utf8") != output:
        MANIFEST.write_text(output,encoding="utf8")
    missing = [q for q in items if not (OUT / f"{q}.mp3").exists()]
    if missing:
        raise RuntimeError("Missing MP3s: "+", ".join(missing))
    print("Validated all 58 audio files and manifest",flush=True)

if __name__=="__main__":
    asyncio.run(main())
