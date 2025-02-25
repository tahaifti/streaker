import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        short_name: "Streaker",
        name: "Streaker",
        description: "A simple habit tracker",
        icons: [
          {
            src: "/icons/favicon/icon-192x192.png",
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: "/icons/favicon/icon-512x512.png",
            type: "image/png",
            sizes: "512x512"
          }
        ],
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000"
      },
      includeAssets: ['icons/**/*'],
      registerType: 'autoUpdate'
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
