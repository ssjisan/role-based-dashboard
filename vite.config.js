// vite.config.js
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite"; // <--- REMOVE loadEnv

export default defineConfig({
  // <--- Remove the destructuring ({ mode }) =>
  plugins: [react()],
  // Remove the 'define' property entirely
  // Remove the entire 'loadEnv' block
  build: { chunkSizeWarningLimit: 3200 },
  server: {
    host: true,
    port: 5173,
  },
});
