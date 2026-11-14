import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/dataset': { target: 'http://localhost:8010', changeOrigin: true },
      '/narasi': { target: 'http://localhost:8010', changeOrigin: true },
      '/cari-dataset': { target: 'http://localhost:8010', changeOrigin: true },
      '/tahun-dataset': { target: 'http://localhost:8010', changeOrigin: true },
    },
  },
})
