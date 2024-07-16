const staticCacheName = "prova";
const assets = [
    "/index.html",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css",
    "https://fonts.googleapis.com/css2?family=Cabin&family=Roboto&display=swap",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css",
    "https://www.moksy.com/templates/prova/assets/styles/styles.css",
    "https://code.jquery.com/jquery-3.6.0.min.js",
    "https://code.jquery.com/ui/1.13.2/jquery-ui.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery-migrate/3.4.0/jquery-migrate.min.js" 
];


// Cache assets on install
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log("Caching assets");
            return cache.addAll(assets);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== staticCacheName)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch event - serve cached assets if available, fall back to network
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return cacheRes || fetch(event.request).then(fetchRes => {
                return caches.open(staticCacheName).then(cache => {
                    if (event.request.url.startsWith(self.location.origin)) {
                        cache.put(event.request.url, fetchRes.clone());
                    }
                    return fetchRes;
                });
            });
        }).catch(() => {
            if (event.request.headers.get("accept").includes("text/html")) {
                return caches.match("/index.html");
            }
        })
    );
});
