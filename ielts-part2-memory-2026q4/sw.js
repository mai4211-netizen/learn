/* Offline shell and MP3 caching for the IELTS Part 2 Jenny player. */
const CACHE_NAME = "ielts-part2-q4-offline-v71";
const AUDIO_CACHE = "ielts-part2-q4-mp3-v2";
const LEGACY_AUDIO_CACHE = "ielts-part2-q4-mp3-v1";
const APP_SHELL = [
  "./", "./index.html", "./overview.html", "./practice.html", "./site-tabs.css?v=modules-v33", "./feedback-v41.css?v=43", "./compact-v43.css?v=46", "./style.css?v=templates-v26",
  "./manifest.webmanifest", "./icon.svg", "./nice-editorial.css?v=skin-v2", "./nice-editorial.js?v=skin-v2",
  "./data.js", "./patch-ui-v2.js", "./patch-ui-v3.js",
  "./patch-ui-v4.js", "./patch-ui-v5.js",
  "./reviewed-a.js", "./reviewed-b1.js", "./reviewed-b2.js",
  "./reviewed-length.js", "./reviewed-smooth.js", "./reviewed-smooth2.js",
  "./reviewed-keywords2.js", "./reviewed-q22.js",
  "./reviewed-merge1.js", "./reviewed-merge2.js", "./reviewed-merge3.js",
  "./reviewed-simplelevel.js", "./reviewed-finalpolish.js",
  "./reviewed-merge4.js", "./reviewed-final2.js",
  "./reviewed-comments2.js", "./reviewed-merge5.js",
  "./reviewed-q24collab.js",
  "./supplement-q4.js", "./supplement-q4-extra.js",
  "./reviewed-user-feedback-nov.js?v=island-v18", "./cue-card-verified.js?v=cues-v22", "./category-flex.js?v=topic-fit-v20", "./translations-zh.js?v=island-v18",
  "./approved-topic-edits-nov.js?v=approved-v23",
  "./consistent-templates-nov.js?v=templates-v26",
  "./reuse-pass-nov.js?v=reuse-v36", "./topic-fit-review-nov.js?v=fit-v36", "./content-length-review-nov.js?v=length-v38", "./quality-review-nov.js?v=qa-v40", "./final-content-polish.js?v=43", "./audio/audio-manifest.js?v=audio-v2-20261110-10", "./app.js?v=44", "./recall-ui-v43.js?v=47", "./quality-alignment-v44.js?v=semantic-v18", "./final-answers-v2.js?v=answers-v2-20261110-16",
  "./sidebar-controls.js?v=shared-v30", "./speech-player.js?v=45", "./sticky-tabs-v43.js?v=46"
];

self.addEventListener("install",event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate",event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME && k !== AUDIO_CACHE && k !== LEGACY_AUDIO_CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Audio elements can request "Range: bytes=..." for native seeking. Cache API
// rejects 206 Partial Content; cache the full 200 MP3 and build 206 responses.
async function audioResponse(req,url) {
  const cache = await caches.open(AUDIO_CACHE);
  const key = new Request(url.href);
  let full = await cache.match(key);
  if (!full) {
    try {
      full = await fetch(key,{cache:"no-store"});
      if (full.status === 200) await cache.put(key,full.clone());
      else return fetch(req);
    } catch (err) {
      const saved = await cache.match(key);
      if (!saved) throw err;
      full = saved;
    }
  }
  const range = req.headers.get("range");
  if (!range) return full;
  const bytes = await full.arrayBuffer();
  const size = bytes.byteLength;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!match || (!match[1] && !match[2])) return full;
  let first = match[1] ? Number(match[1]) : Math.max(0,size-Number(match[2]));
  let last = match[2] && match[1] ? Math.min(size-1,Number(match[2])) : size-1;
  if (!Number.isSafeInteger(first) || !Number.isSafeInteger(last) || first < 0 || last >= size || first > last) {
    return new Response(null,{status:416,headers:{"Content-Range":"bytes */"+size}});
  }
  const headers = new Headers(full.headers);
  headers.set("Content-Type","audio/mpeg");
  headers.set("Accept-Ranges","bytes");
  headers.set("Content-Range","bytes "+first+"-"+last+"/"+size);
  headers.set("Content-Length",String(last-first+1));
  headers.delete("Content-Encoding");
  return new Response(bytes.slice(first,last+1),{status:206,headers});
}

// The Part 2 page loads many small scripts. Serve the versioned, precached
// shell assets immediately instead of forcing a network request on every tab
// revisit. HTML navigations remain network-first so content updates stay fresh.
const PRECACHED_ASSET_URLS = new Set(APP_SHELL
  .filter(path => path !== "./" && !/\.html(?:\?|$)/.test(path) && !path.includes("audio-manifest.js"))
  .map(path => new URL(path, self.registration.scope).href));

self.addEventListener("fetch",event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (/\.mp3$/i.test(url.pathname)) {
    event.respondWith(audioResponse(req,url));
    return;
  }
  if (PRECACHED_ASSET_URLS.has(url.href)) {
    event.respondWith(caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(req);
      if (cached) return cached;
      const response = await fetch(req);
      if (response.ok && response.status === 200)
        cache.put(req, response.clone()).catch(() => {});
      return response;
    }));
    return;
  }
  event.respondWith(fetch(req,{cache:"no-store"}).then(response => {
    if (response && response.ok && response.status===200) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req,copy)).catch(() => {});
    }
    return response;
  }).catch(async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    if (req.mode === "navigate")
      return (await caches.match("./index.html")) || (await caches.match("./"));
    throw new Error("Offline and not cached");
  }));
});
