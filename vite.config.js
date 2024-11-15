import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const manifestForPlugin = {
  registerType: "autoUpdate", // Esto hará que el SW se actualice automáticamente
  includeAssets: ['favicon.ico', "apple-touch-icon.png", "masked-icon.png"],
  manifest: {
    name: "EduZona",
    short_name: "EduZona",
    description: "EduZona",
    icons: [
      {
        src: "./icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "./icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'apple touch icon',
      },
      {
        src: "./icon-144x144.png",
        sizes: "144x144",
        type: "image/png"
      },
      {
        src: "./icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    theme_color: "#181818",
    background_color: "#00314A",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",

    screenshots: [
      {
        src: "./screenshot-desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide"
      },
      {
        src: "./screenshot-mobile.png",
        sizes: "720x1280",
        type: "image/png"
      }
    ]
  },
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      ...manifestForPlugin,
      strategies: 'generateSW', // Se genera el Service Worker automáticamente
      workbox: { 
        globDirectory: 'public', // Directorio base donde están los recursos estáticos
        globPatterns: ['img/**/*.{png,jpg,jpeg,gif}'], // Precarga todas las imágenes de public/img
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24, // 1 día
              },
            },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://servidor-zonadoce.vercel.app', // URL base de la API
            handler: 'NetworkFirst', // o 'CacheFirst' si prefieres usar primero el caché
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10, // Espera en red antes de recurrir al caché
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
        maximumFileSizeToCacheInBytes: 3145728,  
      },
      devOptions: {
        enabled: true,  
      },
    })
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});
