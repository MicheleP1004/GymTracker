// Importa i file necessari per il service worker
import { build, files, version } from '$service-worker';

// Dichiara il nome della cache
const CACHE = `cache-${version}`;

// Unisci tutte le risorse necessarie nella cache
const ASSETS = [
    ...build, // l'app stessa
    ...files  // tutti i file in `static`
];

// Gestisci l'evento di installazione del service worker
self.addEventListener('install', (event) => {
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll(ASSETS);
    }

    event.waitUntil(addFilesToCache());
});

// Gestisci l'evento di attivazione del service worker
self.addEventListener('activate', (event) => {
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE) await caches.delete(key);
        }
    }

    event.waitUntil(deleteOldCaches());
});

// Gestisci le richieste di fetch (utilizza la cache o la rete)
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    async function respond() {
        const url = new URL(event.request.url);
        const cache = await caches.open(CACHE);

        // Se il file è nella lista degli asset, prova a servirlo dalla cache
        if (ASSETS.includes(url.pathname)) {
            const cachedResponse = await cache.match(url.pathname);
            if (cachedResponse) {
                return cachedResponse;
            }
        }

        // In caso contrario, prova a fare una richiesta di rete e metti in cache la risposta
        try {
            const response = await fetch(event.request);
            const isNotExtension = url.protocol == 'http:';
            const isSuccess = response.status == 200;

            if (isNotExtension && isSuccess) {
                cache.put(event.request, response.clone());
            }

            return response;
        } catch {
            const cachedResponse = await cache.match(url.pathname);
            if (cachedResponse) {
                return cachedResponse;
            }
            return caches.match('/offline.html');
        }
    }

    event.respondWith(respond());
});
