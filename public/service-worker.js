// the cache version gets updated every time there is a new deployment
const CACHE_VERSION = 1;
const CACHE_NAME = `offline-${CACHE_VERSION}`;

// these are the routes and files we are going to cache for offline support
const CACHE_FILES = [
    '/tests/webpack',
    '/tests/jsx',
    '/tests/what-watch',
    //"add other path or file"
];

// these are the manifest paths contain the path to files we are going to cache for offline support
const WEBPACK_MANIFESTS_JSON = [
    "/build/tests_config/manifest.json",
    //"add other manifest.json"
];

// add all resource files to cache
const addFilesToCache = async () => {
    console.log(`[sw] : caching all CACHE_FILES`);
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CACHE_FILES);
};

// add all resource from webpack to cache
const addWebpackFilesToCache = async () => {
    console.log(`[sw] : caching all WEBPACK_FILES`);
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(
        WEBPACK_MANIFESTS_JSON.map(async (path_to_manifest) => {
            fetch(path_to_manifest)
                .then((response) => response.json())
                .then(async (manifest_json) => {
                    await Promise.all(
                        Object.keys(manifest_json).map(async (k) => {
                            var build_url = manifest_json[k]
                            cache.add(new Request(build_url))
                        })
                    )
                })
        })
    )
};

// delete other curent cache
const deleteCache = async () => {
    caches.keys().then((keys) => {
        keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
    })
};

// fetch the resource from the network
const getResponse = async (request) => {
    try {
        // fetch the resource from the network
        const responseFromNetwork = await fetch(request);
        // Une réponse ne peut être utilisée qu'une fois
        // On la clone pour en mettre une copie en cache
        // et servir l'originale au navigateur
        updateCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error) {
        // fetch the resource from the browser cache
        const responseFromCache = await caches.match(request);
        if (responseFromCache) {
            console.log(`[sw] : the resource is from cache: ${request.url}`);
            return responseFromCache;
        } else {
            // TO DO custom page
            /*const error_connection = await caches.match(new Request("/pwa/static/error/connection"));
            return error_connection*/
            return new Response("Network error happened", {
                status: 408,
                headers: { "Content-Type": "text/plain" },
            });
       }
    }
}

// cache the current page to make it available for offline
const updateCache = async (request, response) => {
    console.log(`[sw] : caching new resource: ${request.url}`);
    const cache = await caches.open(CACHE_NAME);
    try {
        await cache.put(request, response);
    } catch (error) {
        console.log(`[sw] : caching put error`, error);
    }
}

// on activation we clean up the previously registered service workers
self.addEventListener('activate', (evt) => {
    console.log(`[sw] : activate`);
    // Dites au service worker actif de prendre immédiatement le contrôle de la page.
    self.clients.claim();
    evt.waitUntil(deleteCache());
});

// on install we download the files we want to cache for offline
self.addEventListener('install', (evt) => {
    console.log(`[sw] : install`);
    // Force le service worker en attente à devenir le service worker actif.
    self.skipWaiting();
    evt.waitUntil(addFilesToCache());
    evt.waitUntil(addWebpackFilesToCache());
});

self.addEventListener('fetch', (evt) => {
    console.log(`[sw] : fetch`);
    evt.respondWith(
        getResponse(evt.request)
    );
});