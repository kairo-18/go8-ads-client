import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import taildwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    taildwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Change this to your API URL
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
