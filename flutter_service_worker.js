'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "2560e8a36d0ad39cfedc554a8bc167d0",
"index.html": "02b8067064dea66a8b02d0173af0cf32",
"/": "02b8067064dea66a8b02d0173af0cf32",
"main.dart.js": "2be11dd4e6139f8bb4df3663eefcee27",
"flutter.js": "1cfe996e845b3a8a33f57607e8b09ee4",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "bd85a4e0cdfcd5015bb12645e2b22099",
"assets/AssetManifest.json": "38d50eab2b8d4e9ee308509466b58e1d",
"assets/NOTICES": "30e65e23405d88f7ed4811355b8b1732",
"assets/FontManifest.json": "d85102c407dec6cfc3940582910d870f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/assets/video/toplay.mp4": "c6650d015e9b70f61f964f14648e35c8",
"assets/assets/doc.svg": "864dab1040ddf1b2f3a201e35b18949d",
"assets/assets/png/error.png": "1637dfeb43664b1ad8c536680a847995",
"assets/assets/png/logo.png": "8a3642aed828013ab1dbb62f37d3c9fe",
"assets/assets/png/doc2.png": "85be4a0f61373d21f42aed1a32a5465d",
"assets/assets/fonts/lufga/LufgaThinItalic.ttf": "1249eb2dece0bb0a22298a1f84ef1eea",
"assets/assets/fonts/lufga/LufgaExtraLight.ttf": "40e1d2ea9bd0e6f6145c471b8d2258d8",
"assets/assets/fonts/lufga/LufgaLight.ttf": "1ddf17687f8773fda121f4ef0e6a9885",
"assets/assets/fonts/lufga/LufgaItalic.ttf": "d8f169e34feae34deafd580f227a3e9f",
"assets/assets/fonts/lufga/LufgaMediumItalic.ttf": "9d9c7b7114cd7ffaea39d8dcbff15df2",
"assets/assets/fonts/lufga/LufgaBoldItalic.ttf": "a818526e213cad1ab89ad23b7da355fc",
"assets/assets/fonts/lufga/LufgaBlackItalic.ttf": "25fc4be833ac3dbf682ea2c543277721",
"assets/assets/fonts/lufga/LufgaLightItalic.ttf": "089d17df7fd5a9b1c68e7fd7c2169ae7",
"assets/assets/fonts/lufga/LufgaExtraLightItalic.ttf": "7df43127232ea7f51629d0656e41e695",
"assets/assets/fonts/lufga/LufgaExtraBoldItalic.ttf": "7f6a56a09034eefe59d7879e6d30ca6f",
"assets/assets/fonts/lufga/LufgaExtraBold.ttf": "c75c443b141cd41d4c93ebf9e4b9c4db",
"assets/assets/fonts/lufga/LufgaBold.ttf": "adecc4bca5b2a9687481c342a4fe9f40",
"assets/assets/fonts/lufga/LufgaThin.ttf": "d5d5c39332e5a1d490334bf508cb80f5",
"assets/assets/fonts/lufga/LufgaMedium.ttf": "9ab833326b202fb55eb336db57aa3508",
"assets/assets/fonts/lufga/LufgaSemiBoldItalic.ttf": "2b78ffbc04cd7dffa5cacbed005271f6",
"assets/assets/fonts/lufga/LufgaRegular.ttf": "9df35b2045f6e32dcfa5bbc421ed05b1",
"assets/assets/fonts/lufga/LufgaBlack.ttf": "b9752220c09f69872de74ee3173f26d5",
"assets/assets/fonts/lufga/LufgaSemiBold.ttf": "1e053b4805d075f403dd3e44a3d4ec31",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
