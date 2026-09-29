const CACHE_NAME = "ielts-part2-q4-offline-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.webmanifest",
  "./icon.svg",
  "./data.js",
  "./patch-ui-v2.js",
  "./patch-ui-v3.js",
  "./patch-ui-v4.js",
  "./patch-ui-v5.js",
  "./reviewed-a.js",
  "./reviewed-b1.js",
  "./reviewed-b2.js",
  "./reviewed-length.js",
  "./reviewed-smooth.js",
  "./reviewed-smooth2.js",
  "./reviewed-keywords2.js",
  "./reviewed-q22.js",
  "./reviewed-merge1.js",
  "./reviewed-merge2.js",
  "./reviewed-merge3.js",
  "./reviewed-simplelevel.js",
  "./reviewed-finalpolish.js",
  "./reviewed-merge4.js",
  "./reviewed-final2.js",
  "./reviewed-comments2.js",
  "./reviewed-merge5.js",
  "./reviewed-q24collab.js",
  "./app.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        if (req.mode === "navigate") {
          return (await caches.match("./index.html")) || (await caches.match("./"));
        }
        throw new Error("Offline and not cached");
      })
  );
});
