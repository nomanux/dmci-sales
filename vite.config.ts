import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  }
  // test: {
  //   projects: [{
  //     extends: true,
  //     plugins: [
  //     storybookTest({
  //       configDir: path.join(dirname, '.storybook')
  //     })],
  //     test: {
  //       name: 'storybook',
  //       browser: {
  //         enabled: true,
  //         headless: true,
  //         provider: playwright({}),
  //         instances: [{
  //           browser: 'chromium'
  //         }]
  //       }
  //     }
  //   }]
  // }
});