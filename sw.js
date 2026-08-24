// sw.js - Uppdaterad till v3 med Network-First-strategi
const CACHE_NAME = 'webview-v3'; 
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

// 2. Ta bort alla gamla cacher vid aktivering
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

// 3. Hämtningsstrategi: Network-First (Hämta alltid nyaste koden först, använd cachen om offline)
self.addEventListener('fetch', (event) => {
    // Filtrera bort anrop som inte är vanliga HTTP/HTTPS GET-förfrågningar
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Spara en kopia i cachen om anropet lyckades
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Vid utebliven internetanslutning (offline) -> Hämta från cachen
                return caches.match(event.request);
            })
    );
});
