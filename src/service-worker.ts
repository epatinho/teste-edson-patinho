declare global {
  interface ServiceWorkerGlobalScope {
    __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
  }
}

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'spotify-app-cache-v1';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const urlsToCache = self.__WB_MANIFEST || [];

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/css/',
  '/static/js/',
  '/manifest.json',
  `${process.env.PUBLIC_URL}/logo192.png`,
  `${process.env.PUBLIC_URL}/logo512.png`,
  '/favicon.ico',
];

self.addEventListener('install', event => {
  const swEvent = event as ExtendableEvent;
  self.skipWaiting();
  swEvent.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([...STATIC_ASSETS]);
    })
  );
});

self.addEventListener('activate', event => {
  const swEvent = event as ExtendableEvent;
  swEvent.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('message', event => {
  const msgEvent = event as ExtendableMessageEvent;
  if (msgEvent.data && msgEvent.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const cacheFirstStrategy = async (request: Request) => {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
};

const networkFirstStrategy = async (request: Request) => {
  try {
    const requestClone = request.clone();

    try {
      const networkResponse = await fetch(requestClone);

      if (networkResponse && networkResponse.status === 200) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }

      return networkResponse;
    } catch (networkError) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      throw networkError;
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Você está offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

self.addEventListener('fetch', event => {
  const fetchEvent = event as FetchEvent;
  if (fetchEvent.request.method !== 'GET') return;
  const url = new URL(fetchEvent.request.url);
  if (url.hostname === 'api.spotify.com') {
    fetchEvent.respondWith(networkFirstStrategy(fetchEvent.request));
    return;
  }
  if (
    url.hostname === self.location.hostname ||
    STATIC_ASSETS.some(asset => url.pathname.includes(asset))
  ) {
    fetchEvent.respondWith(cacheFirstStrategy(fetchEvent.request));
    return;
  }
  fetchEvent.respondWith(fetch(fetchEvent.request));
});
export {};
