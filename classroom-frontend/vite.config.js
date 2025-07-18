// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    proxy: {
      "/evaluations": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
