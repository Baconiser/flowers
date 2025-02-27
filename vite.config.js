// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './', // Use relative paths
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
