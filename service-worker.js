const CACHE_NAME = 'tareas-diarias-v1';
const urlsToCache = [
  '/Tareas-Diarias/',
  '/Tareas-Diarias/index.html',
  '/Tareas-Diarias/styles.css',
  '/Tareas-Diarias/script.js',
  '/Tareas-Diarias/manifest.json',
  '/Tareas-Diarias/icons/icon-144x144.svg',
  '/Tareas-Diarias/icons/icon-192x192.svg',
  '/Tareas-Diarias/icons/icon-512x512.svg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Pacifico&display=swap'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Estrategia de caché: Cache con actualización en red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve la respuesta en caché si está disponible
        if (response) {
          return response;
        }
        
        // Si no está en caché, busca en la red
        return fetch(event.request)
          .then(response => {
            // Si la respuesta no es válida, devuelve la respuesta original
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clona la respuesta para guardarla en caché
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
      })
  );
});

// Activación y limpieza de cachés antiguos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Elimina los cachés que no están en la lista blanca
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});