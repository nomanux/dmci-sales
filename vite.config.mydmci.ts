import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// MyDMCI: second app in this repo. Shares the sales theme and components
// through the "@" alias, but runs and builds on its own.
export default defineConfig({
  // Served under /mydmci/, so the admin is at /mydmci/admin.
  base: '/mydmci/',
  root: fileURLToPath(new URL('./mydmci', import.meta.url)),
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  server: { port: 5174 },
  preview: { port: 4174 },
  build: {
    outDir: fileURLToPath(new URL('./dist-mydmci', import.meta.url)),
    emptyOutDir: true
  }
});
