
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  root: 'ui',
  // Use relative paths so Electron can load assets via the file protocol
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'ui/main.js'),
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: '[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  },
  optimizeDeps: {
    include: ['swiper/modules']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'ui')
    }
  },
  plugins: [vue()]
})
