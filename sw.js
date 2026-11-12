// Štěpkovač – service worker (offline režim)
// Při každé změně souborů zvyšte číslo verze, aby se telefon aktualizoval.
const CACHE = 'stepkovac-v7';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Cizí servery (výpočet trasy) jdou vždy přímo do sítě
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
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
