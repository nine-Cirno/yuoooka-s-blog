import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue'],
          'vendor-vuetify': ['vuetify'],
          'vendor-chartjs': ['chart.js', 'vue-chartjs'],
          'vendor-utils': ['typeit', 'markdown-it', 'front-matter'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
