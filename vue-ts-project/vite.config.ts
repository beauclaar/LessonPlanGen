import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({

  base: './',
  plugins: [
    vue(),
    vuetify(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 3001,
    strictPort: true,
    middlewareMode: false,
    fs: {
      strict: true,
      allow: ['..']
    }
  }
});
