const CACHE_NAME = 'ofmc2026-v20';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './data.js',
  './encuesta_cena.html',
  './estadisticas.html',
  './avisos.json',
  './manifest.json',
  './assets/qr_wifi_visitas_uv.png',
  './assets/wifi_visitas_uv.mobileconfig',
  './logos/auspiciadores/logo_copas_coastal.png',
  './logos/auspiciadores/logo_cr2.png',
  './logos/auspiciadores/logo_invap.png',
  './logos/auspiciadores/logo_asl.png',
  './logos/auspiciadores/logo_nortek.png',
  './logos/auspiciadores/logo_cio2.png',
  './logos/auspiciadores/logo_ucn.png',
  './logos/auspiciadores/CascoAntiguo.jpg',
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
  
  // Network-First para avisos, datos, estadisticas, encuesta e index (para reflejar cambios en tiempo real)
  if (url.pathname.endsWith('avisos.json') || url.pathname.endsWith('data.js') || url.pathname.endsWith('estadisticas.html') || url.pathname.endsWith('encuesta_cena.html') || url.pathname.endsWith('index.html') || url.pathname.endsWith('/app_congreso/') || url.pathname.endsWith('/app_congreso')) {
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
