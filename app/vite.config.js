import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'esnext'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  },
  plugins: [react()],
})
