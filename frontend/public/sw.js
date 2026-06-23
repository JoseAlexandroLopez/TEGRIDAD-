const CACHE_NAME = 'tegridad-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/icons.svg',
  '/src/main.jsx',
  '/src/styles/index.css',
  '/src/styles/App.css'
];

// Evento de Instalación: Se guardan los componentes del App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Evento de Activación: Limpieza de cachés antiguas obsoletas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepción y manejo de peticiones de red
self.addEventListener('fetch', (event) => {
  // Excluir pasarelas externas de banco o mapas en tiempo real del almacenamiento local
  if (event.request.url.includes('culqi.com') || event.request.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        
        // Almacenamiento dinámico de las vistas visitadas para soporte sin conexión posterior
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return networkResponse;
      }).catch(() => {
        // En caso de caída total de red, devolvemos el punto de entrada index.html de la SPA
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});