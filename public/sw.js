// Ghumo India — Progressive Web App Service Worker
const CACHE_NAME = 'ghumoindia-pwa-v1';

// Static core assets for fast offline shell loading
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/favicon.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-512x512.png',
  '/icons/apple-touch-icon.png'
];

// Install: Cache critical core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('[PWA ServiceWorker] Failed to cache some core assets:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache versions and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy for offline resilience without interfering with dynamic APIs
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Never intercept non-GET requests (POST/PUT/DELETE)
  if (request.method !== 'GET') {
    return;
  }

  // 2. Bypass live external APIs, tile servers, and AI streaming
  const bypassHosts = [
    'generativelanguage.googleapis.com',
    'google.com',
    'mt0.google.com',
    'mt1.google.com',
    'mt2.google.com',
    'mt3.google.com',
    'tile.openstreetmap.org',
    'cartocdn.com',
    'basemaps.cartocdn.com'
  ];

  if (bypassHosts.some((host) => url.hostname.includes(host))) {
    return; // Let browser perform native fetch directly
  }

  // 3. Navigation requests (HTML pages): Network-First, fallback to Cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // 4. Static assets (JS, CSS, images, fonts): Stale-While-Revalidate
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/icons/') ||
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: Network fetch
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
