/**
 * To allow offline mode, the first 100 queries made by the application will be cached.
 * We could have implemented a more specific cache with file extensions for example
 * But then we should define exactly what should be cached.
 * This can be quite complex, because we cannot just cache all images,
 * as some of them are WMTS or WMTS results and others ar icons.
 * So a simple solution here is to cache all the first queries that are done
 * by the application when it starts. With this we should have all the necessary
 * cache to be able to start the application in offline mode
 *
 * The WMTS tiles and other results coming from OGC-Services will be cached on demand
 * with the OfflineManager component of the application.
 */
let storeVersion; // Version of the store. Value is defined by OfflineManager.
let dbCacheName; // Name of the cache for downloaded data. Value is defined by OfflineManager.
let tilesStoreName; // Name of the store used to downloaded tiles. Value is defined by OfflineManager.
let logLevel; // Current log level. Value is defined by OfflineManager.
let audience; // List of domains for which the Authorization Token and cookies should be sent
let audienceExcludedPaths; // List of regex paths at audience where Authorization Token and cookies should not be sent
let accessToken; // The current access token
let authMode; // How the authentication should be sent to the audience
let refererPolicy; // RefererPolicy used for the queries. Default strict-origin-when-cross-origin
const offlineTimeout = 3000; // Timeout in case of not reachable IndexedDB. (3 sec.)
const appCacheName = 'pages'; // Name of the cache for application pages
const maxCacheCount = 300; // Number of queries that should be cached by the service-worker for offline usage.
let cacheCount = 0; // Counter related to the max value above
self.addEventListener('message', handleMessage);
self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        return;
    }
    event.respondWith(handleFetchEvent(event));
});
function handleMessage(event) {
    const data = event.data;
    if (data.logLevel) {
        logLevel = data.logLevel;
        log(`LogLevel changed: ${logLevel}`);
    }
    if (data.tilesStoreName) {
        tilesStoreName = data.tilesStoreName;
        log(`tilesStoreName changed: ${tilesStoreName}`);
    }
    if (data.storeVersion) {
        storeVersion = data.storeVersion;
        log(`storeVersion changed: ${storeVersion}`);
    }
    if (data.dbCacheName) {
        dbCacheName = data.dbCacheName;
        log(`dbCacheName changed: ${dbCacheName}`);
    }
    if (data.audience) {
        audience = data.audience ?? [];
        log(`audience changed: ${audience}`);
    }
    if (data.audienceExcludedPaths) {
        audienceExcludedPaths = data.audienceExcludedPaths ? data.audienceExcludedPaths.map((str) => new RegExp(str)) : [];
        log(`audienceExcludedPaths changed: ${audienceExcludedPaths}`);
    }
    if (data.access_token) {
        accessToken = data.access_token;
        log(`access_token changed: ${accessToken}`);
    }
    if (data.clear_access_token) {
        accessToken = undefined;
        log('access_token cleared');
    }
    if (data.authMode) {
        authMode = data.authMode;
        log(`authMode changed: ${authMode}`);
    }
    if (data.refererPolicy) {
        refererPolicy = data.refererPolicy;
        log(`refererPolicy changed: ${refererPolicy}`);
    }
}
function handleInstall() {
    self.skipWaiting();
    log('Service Worker installed');
}
function handleActivate(event) {
    event.waitUntil((async () => {
        if ('clients' in self) {
            const clientsList = await self.clients.matchAll({ type: 'window' });
            for (const client of clientsList) {
                client.navigate(client.url);
                log('Page reloaded by the Service Worker.');
            }
        }
    })());
}
async function handleFetchEvent(event) {
    const newRequest = getRequest(event.request);
    let response = await fetchAndCache(newRequest);
    // Use cache only for GET queries
    if (isCacheAllowed(event.request)) {
        if (!response) {
            // Fetch was unsuccessful. We try to load the data from cache.
            response = await loadFromCache(event.request);
        }
        if (!response) {
            // Not found in cache. We try to load from indexedDB
            response = await loadFromIndexedDB(event.request);
        }
    }
    return response ?? new Response(null, { status: 503 });
}
function isCacheAllowed(request) {
    if (request.method !== 'GET') {
        return false;
    }
    if (request.headers.get('Range')) {
        // RANGE Request (for COG, FlatGeoBuf or GeoParquet for example)
        return false;
    }
    return true;
}
/**
 * Execute a fetch for the query, and cache the result if successful
 * Returns null if unsuccessful
 */
async function fetchAndCache(request) {
    try {
        const response = await fetch(request);
        if (cacheCount < maxCacheCount && isCacheAllowed(request) && response.type !== 'opaque') {
            // Fetch was successful. We cache the result if necessary and return the response.
            cacheCount++;
            log(`SW ${cacheCount}/${maxCacheCount} caching ${request.url} for offline use.`);
            const copy = response.clone();
            const cache = await caches.open(appCacheName);
            await cache.put(request, copy);
        }
        return response;
    }
    catch {
        return null;
    }
}
function getRequest(request) {
    if (request.mode === 'no-cors') {
        return request; // Cannot do anything here, the no-cors queries cannot be modified
    }
    try {
        const requestedUrl = new URL(request.url);
        const hostname = requestedUrl.hostname;
        const shouldExclude = audienceExcludedPaths.some((pattern) => pattern.test(requestedUrl.pathname));
        if (audience?.includes(hostname) && !shouldExclude) {
            // Prepare headers
            const headers = new Headers(request.headers);
            if (authMode == 'token' && accessToken) {
                headers.set('Authorization', `Bearer ${accessToken}`);
            }
            // Prepare options
            const fetchOptions = {
                headers: headers,
                credentials: authMode === 'cookie' ? 'include' : 'omit',
                referrer: request.referrer,
                referrerPolicy: refererPolicy
            };
            return new Request(request, fetchOptions);
        }
        // Return the initial request
        return request;
    }
    catch (error) {
        // In case of error, we return the initial request
        log('Error while creating the request with authentication', error);
        return request;
    }
}
/**
 * Try to load this request from local cache.
 * Returns null if unsuccessful
 */
async function loadFromCache(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || null;
}
/**
 * Try to load this request from indexedDB.
 * Returns null if unsuccessful
 */
async function loadFromIndexedDB(request) {
    try {
        const database = await openIndexedDB();
        const transaction = database.transaction([tilesStoreName], 'readonly');
        const store = transaction.objectStore(tilesStoreName);
        const index = store.index('url');
        return new Promise((resolve, reject) => {
            const dbRequest = index.get(request.url);
            dbRequest.onsuccess = () => {
                if (dbRequest.result) {
                    const blob = dbRequest.result.data;
                    log('Tile found in Cache.');
                    resolve(new Response(blob));
                }
                else {
                    log('Tile not found in cache.');
                    resolve(new Response(null, { status: 204 }));
                }
            };
            dbRequest.onerror = () => {
                reject(new Error('Error querying IndexedDB Store.'));
            };
        });
    }
    catch (error) {
        return null;
    }
}
/**
 * Open indexedDB
 */
async function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbCacheName, storeVersion);
        let timedOut = false;
        const timeoutId = setTimeout(() => {
            timedOut = true;
            reject(new Error('SW Timeout while opening IndexedDB'));
        }, offlineTimeout);
        request.onerror = (event) => {
            if (!timedOut) {
                clearTimeout(timeoutId);
                reject(event.target.error);
            }
        };
        request.onsuccess = (event) => {
            if (!timedOut) {
                clearTimeout(timeoutId);
                resolve(event.target.result);
            }
        };
    });
}
function log(str, error) {
    if (logLevel === 'debug') {
        console.debug(`SW: ${str}`, error);
    }
}
