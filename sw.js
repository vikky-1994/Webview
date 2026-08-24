//sw.js - Enkel Service Worker för cachning och offline-stöd
const CACHE_NAME = 'webview-v1';
const ASSETS = [
    './',
    './index.html',
    './Anvandare.html',
    './Mottagare.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
