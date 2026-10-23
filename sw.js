const CACHE_NAME = 'futsal-app-dinamico'; 

// 1. Instalar y tomar el control inmediatamente
self.addEventListener('install', event => {
  self.skipWaiting();
});

// 2. Activar y DESTRUIR cualquier caché viejo que haya quedado en el móvil
self.addEventListener('activate', event => {
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
  self.clients.claim();
});

// 3. Estrategia: Red primero (Network First), respaldado por Caché
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si hay internet, mostramos la versión oficial del servidor y actualizamos la copia oculta
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red (sin cobertura), sacamos la copia del caché
        return caches.match(event.request);
      })
  );
});
