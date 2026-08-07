// Re-serves every response with COOP/COEP so SharedArrayBuffer works on GitHub
// Pages, which can't set custom headers. Registers itself when loaded as a page
// script; rewrites headers when running as the service worker.

if (typeof window === 'undefined') {
    // ---- service worker context ----
    self.addEventListener('install', () => self.skipWaiting());
    self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener('fetch', (event) => {
        const request = event.request;

        // Cache-only probes must pass through untouched
        if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return;

        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.status === 0) return response;  // opaque, no body to re-wrap

                    const headers = new Headers(response.headers);
                    headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
                    headers.set('Cross-Origin-Opener-Policy', 'same-origin');
                    headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers,
                    });
                })
                .catch((err) => {
                    console.error('[coi-serviceworker]', err);
                    return new Response('Network error', { status: 502 });
                })
        );
    });
} else {
    // ---- page context ----
    // A worker never handles the document that registered it, so one reload is
    // needed to pick up the headers. sessionStorage caps it at one per session.
    (() => {
        const RELOAD_KEY = 'coi-reload-attempted';

        if (window.crossOriginIsolated) {
            sessionStorage.removeItem(RELOAD_KEY);           // isolated, nothing to do
            return;
        }
        if (!navigator.serviceWorker) return;                // no SW support (e.g. file://)

        // Only valid synchronously, so read it before any await
        const scriptUrl = document.currentScript.src;
        const alreadyTried = sessionStorage.getItem(RELOAD_KEY) === '1';

        const reloadOnce = () => {
            if (sessionStorage.getItem(RELOAD_KEY) === '1') return;
            sessionStorage.setItem(RELOAD_KEY, '1');
            window.location.reload();
        };

        navigator.serviceWorker.addEventListener('controllerchange', reloadOnce);

        navigator.serviceWorker.register(scriptUrl).then(
            () => {
                // Worker from a previous visit is in charge, but this document predates it
                if (navigator.serviceWorker.controller && !alreadyTried) reloadOnce();
            },
            (err) => console.error('[coi-serviceworker] registration failed:', err)
        );
    })();
}
