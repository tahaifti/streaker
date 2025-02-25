const CACHE_NAME = 'streaker-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Install event handler
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE)
                    .catch(error => {
                        console.error('Cache addAll error:', error);
                        return Promise.reject(error);
                    });
            })
    );
    self.skipWaiting();
});

// Fetch event handler with network-first strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone the response before caching
                const responseToCache = response.clone();
                
                caches.open(CACHE_NAME)
                    .then(cache => {
                        // Only cache successful responses
                        if (event.request.method === 'GET' && response.status === 200) {
                            cache.put(event.request, responseToCache);
                        }
                    });
                
                return response;
            })
            .catch(() => {
                // If network fails, try to get from cache
                return caches.match(event.request);
            })
    );
});

// Activate event handler to clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});