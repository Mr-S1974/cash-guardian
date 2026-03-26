import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '.static-build',
    emptyOutDir: true,
    assetsDir: 'app-assets',
    cssCodeSplit: false,
    rollupOptions: {
      input: resolve(__dirname, 'index.src.html'),
      output: {
        entryFileNames: 'app-assets/app.js',
        chunkFileNames: 'app-assets/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'app-assets/app.css';
          }

          return 'app-assets/[name][extname]';
        },
      },
    },
  },
});
