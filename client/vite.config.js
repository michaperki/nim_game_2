import vite from 'vite';
import react from '@vitejs/plugin-react';

export default vite.defineConfig({ 
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true
      }
    }
  },
  build: {
    outDir: '../server/public' // Adjust this path as needed
  }
});
