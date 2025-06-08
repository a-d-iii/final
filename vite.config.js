
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'

export default defineConfig({
  root: 'ui',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'ui/main.js')
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'ui')
    }
  },
  plugins: [vue()]
})
