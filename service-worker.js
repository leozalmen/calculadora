// ============================================================
// SERVICE WORKER PARA PWA - IMPORSALV
// ============================================================

const CACHE_NAME = 'imporsalv-v1';
const urlsToCache = [
    '/',
    '/index.html',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalación del Service Worker
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('📦 Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', function(event) {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('🗑️ Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar peticiones y servir desde cache
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Si encuentra en cache, devuelve eso
                if (response) {
                    return response;
                }
                
                // Si no, hace la petición a la red
                return fetch(event.request).then(function(response) {
                    // Si la respuesta es válida, la guarda en cache
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
    );
});

// Manejo de notificaciones push (opcional)
self.addEventListener('push', function(event) {
    const title = '🚗 Imporsalv';
    const options = {
        body: 'Tienes una nueva notificación de Imporsalv',
        icon: 'icon-192.png',
        badge: 'icon-192.png',
        vibrate: [200, 100, 200]
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

console.log('✅ Service Worker de Imporsalv cargado correctamente');