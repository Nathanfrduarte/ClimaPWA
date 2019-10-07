const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

// Lista de arquivos em cache
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/scripts/install.js',
  '/scripts/luxon-1.11.4.js',
  '/styles/main.css',
  '/images/add.svg',
  '/images/ana.jpg',
  '/images/jose.jpg',
  '/images/maicon.jpg',
  '/images/nathan.jpg',
  '/images/clear-day.svg',
  '/images/clear-night.svg',
  '/images/cloudy.svg',
  '/images/fog.svg',
  '/images/hail.svg',
  '/images/install.svg',
  '/images/partly-cloudy-day.svg',
  '/images/partly-cloudy-night.svg',
  '/images/rain.svg',
  '/images/refresh.svg',
  '/images/sleet.svg',
  '/images/snow.svg',
  '/images/thunderstorm.svg',
  '/images/tornado.svg',
  '/images/wind.svg',
];

// Instalar Service Worker
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Instalado');
  // Capturar cache existente
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Capturando cache existente');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Ativado');
  // Remover cache antigo
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('[ServiceWorker] Removendo cache antigo', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Buscar dados
self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Buscando', evt.request.url);

  if (evt.request.url.includes('/forecast/')) {
    console.log('[Service Worker] Buscando (Dados)', evt.request.url);
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(evt.request)
          .then((response) => {
            // Se obteve resposta, guarda em cache
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          }).catch((err) => {
            // Acesso a rede falhou, tenta pegar do cache
            return cache.match(evt.request);
          });
      }));
    return;
  }
  evt.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(evt.request)
        .then((response) => {
          return response || fetch(evt.request);
        });
    })
  );
});
