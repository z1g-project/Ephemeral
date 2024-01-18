import million from "million/compiler";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { uvPath } from "@nebula-services/ultraviolet";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: `${uvPath}/uv.*.js`.replace(/\\/g, "/"),
          dest: "uv",
          overwrite: false,
        },
      ],
    }),
    million.vite({ auto: true }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/bare": {
        target: "http://localhost:8080/bare",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bare/, ""),
      },
      "/search": {
        target: "http://localhost:8080/search",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/search/, ""),
      },
    },
  },
});
