import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Ensures assets load correctly on GitHub Pages
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.binance.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
