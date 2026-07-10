/**
 * BLITZ LEIHEN ADMIN — Service Worker
 * Gère le cache offline et les notifications push.
 */

const CACHE_NAME   = 'blitz-admin-v1';
const STATIC_CACHE = 'blitz-admin-static-v1';

// Ressources à mettre en cache immédiatement à l'installation
const PRECACHE_URLS = [
  './index.html',
  './manifest.json',
];

// -------------------------------------------------------
// INSTALLATION — mise en cache des ressources statiques
// -------------------------------------------------------
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// -------------------------------------------------------
// ACTIVATION — nettoyage des anciens caches
// -------------------------------------------------------
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== STATIC_CACHE)
            .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// -------------------------------------------------------
// FETCH — stratégie Network First pour l'API,
//          Cache First pour les ressources statiques
// -------------------------------------------------------
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Requêtes API → toujours réseau, cache uniquement en cas d'échec
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Ressources statiques → cache first
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request)
        .then(response => {
          // Mettre en cache la nouvelle ressource
          const clone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, clone));
          return response;
        })
      )
  );
});

// -------------------------------------------------------
// NOTIFICATIONS PUSH — affichage de la notification
// -------------------------------------------------------
self.addEventListener('push', event => {
  let data = { title: 'Blitz Leihen Admin', body: 'Neue Benachrichtigung' };

  try {
    if (event.data) data = event.data.json();
  } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(data.title || 'Blitz Leihen Admin', {
      body:    data.body    || '',
      icon:    './icon-192.png',
      badge:   './icon-192.png',
      tag:     data.tag     || 'blitz-admin',
      data:    data,
      vibrate: [200, 100, 200],
      actions: data.actions || [
        { action: 'open',    title: 'Öffnen' },
        { action: 'dismiss', title: 'Schließen' },
      ],
    })
  );
});

// -------------------------------------------------------
// CLIC SUR NOTIFICATION — ouverture ou focus de l'app
// -------------------------------------------------------
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = (event.notification.data && event.notification.data.url)
    || './index.html#demandes';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        const existing = clients.find(c => c.url.includes('admin-mobile'));
        if (existing) {
          existing.focus();
          existing.navigate(targetUrl);
        } else {
          self.clients.openWindow(targetUrl);
        }
      })
  );
});

// -------------------------------------------------------
// BACKGROUND SYNC — re-tentative d'envoi offline
// -------------------------------------------------------
self.addEventListener('sync', event => {
  if (event.tag === 'sync-statuts') {
    // Les mises à jour de statut faites hors ligne seront
    // ré-envoyées automatiquement dès la reconnexion.
    event.waitUntil(syncPendingUpdates());
  }
});

async function syncPendingUpdates() {
  // Placeholder : la logique de sync sera gérée par l'app
  // via IndexedDB → voir app.js, fonction syncOfflineQueue()
  const clients = await self.clients.matchAll();
  clients.forEach(c => c.postMessage({ type: 'SYNC_COMPLETE' }));
}
