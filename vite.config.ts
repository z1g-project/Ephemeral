import million from "million/compiler";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [million.vite({ auto: true }), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/bare": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bare/, ""),
      },
    },
  },
});
