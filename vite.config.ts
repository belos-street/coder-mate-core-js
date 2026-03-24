import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: '.',
  resolve: {
    alias: {
      lib: path.resolve(__dirname, 'lib'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'browser',
    outDir: 'dist'
  },
  server: {
    port: 3000
  }
})
