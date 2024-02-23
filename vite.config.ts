import million from "million/compiler";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { uvPath } from "@nebula-services/ultraviolet";
const __dirname = path.resolve();

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		sourcemap: true,
		target: "ES2022",
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: `${uvPath}/uv.*.js`.replace(/\\/g, "/"),
					dest: "uv",
					overwrite: false,
				},
				{
					src: `${__dirname}/node_modules/localforage/dist/localforage.*.js`.replace(
						/\\/g,
						"/",
					),
					dest: "localforage",
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
			"/bend": {
				target: "http://localhost:8080/bend",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/bend/, ""),
			},
			"/search": {
				target: "http://localhost:8080/search",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/search/, ""),
			},
			"/json/applications": {
				target: "http://localhost:8080/json/apps",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/json\/apps/, ""),
			},
		},
	},
});
