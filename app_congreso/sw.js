const CACHE_NAME = 'ofmc2026-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './data.js',
  './avisos.json',
  './manifest.json',
  './assets/qr_app_congreso.png',
  './assets/qr_programa_pdf.png',
  './icons/icon-192.png',
  './icons/icon-300.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.png',
  './logos/logo_ofmc.png',
  './logos/CEACC.jpeg',
  './logos/costar_GRANDE.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Network-First para avisos.json y data.js (para reflejar cambios en tiempo real)
  if (url.pathname.endsWith('avisos.json') || url.pathname.endsWith('data.js')) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return networkResponse;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-First con fallback a red para recursos estáticos
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
