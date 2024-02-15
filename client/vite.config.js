import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'client/dist', // Specify the output directory
    emptyOutDir: true, // Clear the output directory before building
    rollupOptions: {
      input: '/client/src/main.jsx', // Specify the entry point
    },
  },
});