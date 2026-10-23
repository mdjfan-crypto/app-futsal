const CACHE_NAME = 'futsal-app-dinamico'; 
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

// Instalar y tomar el control inmediatamente
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

// ESTRATEGIA: Red primero (Network First), respaldado por Caché
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si hay internet y el archivo es válido, lo mostramos y actualizamos el caché
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si no hay internet (falla el fetch), sacamos la copia guardada
        return caches.match(event.request);
      })
  );
});
