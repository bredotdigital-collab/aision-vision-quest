/* AISION Planner Service Worker */
const VERSION = "aision-v1";
const CORE_CACHE = `${VERSION}-core`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const CORE_ASSETS = [
  "/",
  "/dashboard",
  "/daily",
  "/weekly",
  "/monthly",
  "/year",
  "/tracking",
  "/settings",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) =>
      Promise.all(
        CORE_ASSETS.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => null),
        ),
      ),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(VERSION))
          .map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Network-first for navigations, fallback to cached shell
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then(
            (cached) =>
              cached ||
              caches.match("/dashboard") ||
              caches.match("/") ||
              new Response("Offline", { status: 503, statusText: "Offline" }),
          ),
        ),
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req)
          .then((res) => {
            if (res && res.status === 200 && res.type === "basic") {
              const copy = res.clone();
              caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => cached),
    ),
  );
});
