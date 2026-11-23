// Uygulamanın telefona yüklenebilmesi için gereken küçük yardımcı.
// Uygulama dosyalarını telefonda saklar, böylece hızlı açılır.
const SURUM = 'fuar-v1';
const DOSYALAR = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(DOSYALAR)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== SURUM).map(x => caches.delete(x)))));
  self.clients.claim();
});

// Önce internetten dene, olmazsa telefondaki kopyayı aç.
// Kart gönderimi (Google'a giden istekler) hiç saklanmaz.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const kopya = r.clone(); caches.open(SURUM).then(c => c.put(e.request, kopya)); return r; })
      .catch(() => caches.match(e.request))
  );
});
