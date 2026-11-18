const CACHE_NAME = "sade-react-cache-v1.0.0";

const assets = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.svg",
  "https://cdn.jsdelivr.net/npm/fuse.js@7.5.0",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        const networkFetch = fetch(e.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(e.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Falha silenciosa de rede caso esteja totalmente offline
          });

        return cachedResponse || networkFetch;
      });
    }),
  );
});
