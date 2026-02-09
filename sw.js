const CACHE_NAME = 'ganhos-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // cache-first para app estático
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(resp => {
        // opcional: cache de novos GET
        const copy = resp.clone();
        if (event.request.method === 'GET') {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(()=>{});
        }
        return resp;
      }).catch(() => cached);
    })
  );
});
