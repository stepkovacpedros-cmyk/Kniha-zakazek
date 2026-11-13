// Štěpkovač – service worker (offline režim)
// Při každé změně souborů zvyšte číslo verze, aby se telefon aktualizoval.
const CACHE = 'stepkovac-v22';
const LIB_CACHE = 'stepkovac-lib-v1'; // knihovny z CDN (Firebase, Leaflet) – mění se jen s verzí v adrese
const ASSETS = ['./', './index.html', './config.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const LIB_HOSTS = ['www.gstatic.com', 'unpkg.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== LIB_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Knihovny (Firebase SDK, Leaflet): nejdřív mezipaměť, aby aplikace fungovala i bez signálu
  if (LIB_HOSTS.includes(url.hostname) && (url.pathname.startsWith('/firebasejs/') || url.pathname.startsWith('/leaflet@'))) {
    e.respondWith(
      caches.open(LIB_CACHE).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; })))
    );
    return;
  }
  // Ostatní cizí servery (mapy, trasy, ARES) jdou vždy přímo do sítě
  if (url.origin !== self.location.origin) return;
  // Vlastní soubory: nejdřív síť (aktuální verze), bez signálu z mezipaměti
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
  );
});
