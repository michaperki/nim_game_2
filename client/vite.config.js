import { defineConfig } from 'vite'; // Import defineConfig function from 'vite'
import react from '@vitejs/plugin-react'; // Import the 'react' plugin separately

export default defineConfig({ // Use defineConfig to define your configuration object
  plugins: [react()], // Include the 'react' plugin in the plugins array
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
