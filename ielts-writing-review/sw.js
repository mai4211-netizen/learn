const CACHE_NAME="ielts-writing-review-offline-v1";
const APP_SHELL=[
  "./",
  "./index.html",
  "./part1.b64",
  "./part2.b64",
  "./part3.b64",
  "./part4.b64",
  "./part5.b64",
  "./part6.b64",
  "./part7.b64",
  "./topics.html",
  "./topics.js",
  "./manifest.webmanifest",
  "./icon.svg"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const req=e.request;
  if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;
  e.respondWith(
    fetch(req).then(res=>{
      if(res&&res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy));}
      return res;
    }).catch(async()=>{
      const hit=await caches.match(req,{ignoreSearch:true});
      if(hit) return hit;
      if(req.mode==="navigate") return (await caches.match("./index.html"))||(await caches.match("./"));
      throw new Error("offline");
    })
  );
});