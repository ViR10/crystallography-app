// CrystalloGraphy Service Worker
// Cache strategy: Cache-First for static, Stale-While-Revalidate for dynamic

const STATIC_CACHE = 'crystallography-static-v2';
const DYNAMIC_CACHE = 'crystallography-dynamic-v2';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/styles.css',
    '/script.js',
    '/app.webmanifest',
    '/robots.txt',
    '/icon-192.png',
    '/icon-512.png',
    '/icon-96.png',
    '/icon-72.png',
    '/assets/favico.png'
];

// ─── INSTALL: pre-cache all static assets ────────────────────────────────────
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Pre-caching static assets');
                // addAll fails silently per asset so we use Promise.allSettled-like approach
                return Promise.all(
                    STATIC_ASSETS.map(url =>
                        cache.add(url).catch(err => {
                            console.warn(`[SW] Could not cache: ${url}`, err);
                        })
                    )
                );
            })
    );
    self.skipWaiting();
});

// ─── ACTIVATE: clean up old caches ───────────────────────────────────────────
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    const KEEP = [STATIC_CACHE, DYNAMIC_CACHE];
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((name) => !KEEP.includes(name))
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            )
        )
    );
    self.clients.claim();
});

// ─── FETCH: choose caching strategy based on request type ────────────────────
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Only handle GET requests
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    // Ignore cross-origin requests (e.g. Google Fonts CDN handled by browser cache)
    if (url.origin !== self.location.origin) return;

    // Strategy 1 — Cache-First for known static assets
    if (isStaticAsset(url.pathname)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Strategy 2 — Stale-While-Revalidate for everything else
    event.respondWith(staleWhileRevalidate(request));
});

// ─── STRATEGIES ──────────────────────────────────────────────────────────────

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch {
        return new Response('Offline – asset not cached.', { status: 503 });
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(() => cached);

    return cached || fetchPromise;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function isStaticAsset(pathname) {
    return (
        pathname === '/' ||
        pathname.endsWith('.html') ||
        pathname.endsWith('.css') ||
        pathname.endsWith('.js') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.webmanifest') ||
        pathname.endsWith('.ico')
    );
}

// ─── BACKGROUND SYNC (future analytics) ──────────────────────────────────────
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-analytics') {
        event.waitUntil(syncAnalytics());
    }
});

async function syncAnalytics() {
    // Placeholder: send queued analytics when back online
    console.log('[SW] Background sync: analytics');
}

// ─── PUSH NOTIFICATIONS (optional future feature) ────────────────────────────
self.addEventListener('push', (event) => {
    if (!event.data) return;
    const options = {
        body: event.data.text(),
        icon: 'icon-192.png',
        badge: 'icon-72.png',
        vibrate: [200, 100, 200]
    };
    event.waitUntil(
        self.registration.showNotification('CrystalloGraphy', options)
    );
});
