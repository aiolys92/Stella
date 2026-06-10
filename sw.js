/* ══════════════════════════════════════════════
   LE REGISTRE — Service worker  v1
   Coquille applicative en cache → 100 % hors-ligne.
   ══════════════════════════════════════════════ */
'use strict';

const VERSION    = 'registre-v2';
const CORE_CACHE = `core-${VERSION}`;
const FONT_CACHE = `fonts-${VERSION}`;

const CORE_FILES = [
  './',
  'index.html',
  'inventaire.html',
  'style.css',
  'inventory.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
];

/* Installation : mise en cache de la coquille */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CORE_CACHE)
      .then(c => c.addAll(CORE_FILES))
      .then(() => self.skipWaiting())
  );
});

/* Activation : purge des anciens caches */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CORE_CACHE && k !== FONT_CACHE)
          .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

/* Récupération :
   – polices Google → cache opportuniste (stale-while-revalidate simplifié)
   – le reste       → cache d'abord, réseau en secours, mise à jour silencieuse */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  /* Polices */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(FONT_CACHE).then(async cache => {
        const cached = await cache.match(e.request);
        const fetched = fetch(e.request)
          .then(res => { if (res.ok) cache.put(e.request, res.clone()); return res; })
          .catch(() => cached);
        return cached || fetched;
      })
    );
    return;
  }

  if (url.origin !== location.origin) return;

  /* Pages HTML & scripts : RÉSEAU d'abord (les mises à jour arrivent tout de suite),
     cache en secours pour le mode hors-ligne. */
  const isFresh = e.request.mode === 'navigate' ||
                  url.pathname.endsWith('.html') ||
                  url.pathname.endsWith('.js')   ||
                  url.pathname.endsWith('.css');
  if (isFresh) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) caches.open(CORE_CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() =>
        caches.match(e.request, { ignoreSearch: true })
          .then(c => c || caches.match('index.html'))
      )
    );
    return;
  }

  /* Ressources statiques (icônes…) : cache d'abord, mise à jour silencieuse */
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(cached => {
      const fetched = fetch(e.request).then(res => {
        if (res.ok) caches.open(CORE_CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
