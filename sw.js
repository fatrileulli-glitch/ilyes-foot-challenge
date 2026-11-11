/* Service worker : permet d'utiliser l'appli hors connexion. */
const CACHE = 'ifc-v1';
const FILES = [
  './', 'index.html', 'manifest.json', 'css/style.css', 'icons/icon.svg',
  'js/data-defis.js', 'js/data-quiz.js', 'js/store.js', 'js/charts.js', 'js/app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

/* Réseau d'abord (pour recevoir les mises à jour), cache si hors connexion. */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
