import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure libraries like lucide-react are pre-bundled by Vite so icons
  // are resolved at dev-time instead of being requested individually at runtime.
});
