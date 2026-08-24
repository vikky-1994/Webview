// sw.js - Uppdaterad Service Worker med rensning av gammal cache
const CACHE_NAME = 'webview-v2';
const ASSETS = [
    './',
    './index.html',
    './Anvandare.html',
    './Mottagare.html'
];

// 1. Installera och cacha nya filer
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// 2. Ta bort alla gamla cacher (t.ex. webview-v1) vid aktivering
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Hämtningsstrategi
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
