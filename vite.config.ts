import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'logo.png'],
      manifest: {
        name: 'Mis compras - FraileDev',
        short_name: 'Mis compras',
        description: 'Aplicación para el control y seguimiento de compras del hogar',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        orientation: 'any',
        categories: ['shopping', 'lifestyle', 'utilities'],
        start_url: '/',
        shortcuts: [
          {
            name: 'Lista de compras',
            short_name: 'Lista',
            url: '/shopping-list',
            icons: [{ src: 'icon-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'Compra rapida',
            short_name: 'Compra',
            url: '/quick-purchase',
            icons: [{ src: 'icon-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'Inventario',
            short_name: 'Inventario',
            url: '/inventory',
            icons: [{ src: 'icon-192x192.png', sizes: '192x192' }],
          },
        ],
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: [
            '@mui/material',
            '@mui/icons-material',
            '@mui/x-data-grid',
            '@mui/x-date-pickers',
          ],
          recharts: ['recharts'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
