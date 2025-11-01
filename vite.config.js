import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5000,
    proxy: {
      '/api': {
        // target: 'http://localhost:3000',
        target: 'https://heavenlybackend-goc0.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
