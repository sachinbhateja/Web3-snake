import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // 🔥 IMPORTANT: prevent SDK from breaking build
  optimizeDeps: {
    exclude: ["@farcaster/miniapp-sdk"]
  },

  build: {
    target: "esnext", // ensures modern crypto support
    sourcemap: false
  }
});

