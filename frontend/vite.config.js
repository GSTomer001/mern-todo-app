import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite dev server configuration.
// The '/api' proxy forwards requests to the Express backend so the
// browser only ever talks to the frontend origin (no CORS issues in dev).
//
// When built for GitHub Pages the app lives in a sub-path
// (https://<user>.github.io/mern-todo-app/), so we set `base` accordingly.
export default defineConfig({
  plugins: [react()],
  // GH_PAGES=true is used by the deploy script so assets resolve under /mern-todo-app/.
  base: process.env.GH_PAGES === 'true' ? '/mern-todo-app/' : '/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});