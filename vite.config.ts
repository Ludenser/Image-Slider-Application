import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
console.log(process.env.VITE_API_BASE_URL);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
