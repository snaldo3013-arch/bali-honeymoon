const CACHE='bali-honeymoon-v59';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg','./couple-sync.js'];
const MAP_LIBS=['https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(CORE);await Promise.allSettled(MAP_LIBS.map(async url=>{const response=await fetch(url,{mode:'cors'});if(response.ok)await cache.put(url,response)}))})());self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('bali-honeymoon-')&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);const local=url.origin===self.location.origin;const mapLib=MAP_LIBS.includes(url.href);if(!local&&!mapLib)return;
if(local&&(req.mode==='navigate'||url.pathname.endsWith('/index.html'))){event.respondWith(fetch(req,{cache:'no-store'}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy)).catch(()=>{})}return response}).catch(async()=>await caches.match('./index.html')||Response.error()));return}
if(mapLib){event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(async response=>{if(response.ok)(await caches.open(CACHE)).put(req,response.clone());return response})));return}
event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(async response=>{if(response.ok)(await caches.open(CACHE)).put(req,response.clone());return response}).catch(()=>Response.error())))});
