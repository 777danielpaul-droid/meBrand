import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: im Dev-Modus '/', im Production-Build '/ErdBaeren2/' (GitHub Pages)
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: mode === "production" ? "./" : "/",
    plugins: [react(), tailwindcss()],
    server: { host: true },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react-vendor'
            }
            if (id.includes('node_modules/framer-motion')) {
              return 'framer-motion'
            }
          },
        },
      },
    },
  }
})