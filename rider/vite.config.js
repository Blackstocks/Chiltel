import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  build: {
    // Remove the rollupOptions as we don't need to specify manifest.json as an entry
  },
  server: {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  },
  publicDir: 'public',  // This is where we'll put our manifest.json
  base: '/'
});