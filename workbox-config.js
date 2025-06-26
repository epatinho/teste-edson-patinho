module.exports = {
  "globDirectory": "build/",
  "globPatterns": [
    "**/*.{html,css,js,json,png,jpg,jpeg,svg,ico,webp}"
  ],
  "swDest": "build/service-worker.js",
  "clientsClaim": true,
  "skipWaiting": true,
  "runtimeCaching": [
    {
      "urlPattern": /^https:\/\/api\.spotify\.com\/v1\//,
      "handler": "NetworkFirst",
      "options": {
        "cacheName": "spotify-api-cache",
        "expiration": {
          "maxAgeSeconds": 3600
        },
        "cacheableResponse": {
          "statuses": [0, 200]
        }
      }
    },
    {
      "urlPattern": /^https:\/\/i\.scdn\.co\//,
      "handler": "CacheFirst",
      "options": {
        "cacheName": "spotify-images-cache",
        "expiration": {
          "maxEntries": 50,
          "maxAgeSeconds": 86400
        },
        "cacheableResponse": {
          "statuses": [0, 200]
        }
      }
    },
    {
      "urlPattern": /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      "handler": "CacheFirst",
      "options": {
        "cacheName": "images",
        "expiration": {
          "maxEntries": 60,
          "maxAgeSeconds": 86400
        }
      }
    },
    {
      "urlPattern": /\.(?:js|css)$/,
      "handler": "StaleWhileRevalidate",
      "options": {
        "cacheName": "static-resources",
        "expiration": {
          "maxAgeSeconds": 604800
        }
      }
    },
    {
      "urlPattern": /\.(?:woff|woff2|ttf|eot|otf)$/,
      "handler": "CacheFirst",
      "options": {
        "cacheName": "fonts",
        "expiration": {
          "maxEntries": 20,
          "maxAgeSeconds": 2592000
        }
      }
    }
  ]
}
