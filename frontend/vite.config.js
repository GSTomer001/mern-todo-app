import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite dev server configuration.
// The '/api' proxy forwards requests to the Express backend so the
// browser only ever talks to the frontend origin (no CORS issues in dev).
export default defineConfig({
  plugins: [react()],
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