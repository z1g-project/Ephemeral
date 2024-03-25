import million from "million/compiler";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
// @ts-expect-error stfu
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
// @ts-expect-error stfu
import { epoxyPath } from "@mercuryworkshop/epoxy-transport"
const __dirname = path.resolve();

// https://vitejs.dev/config/
export default defineConfig({
	build: {
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
				{
					src: `${epoxyPath}/**/*`.replace(/\\/g, "/"),
					dest: "epoxy",
					overwrite: false
				},
				{
					src: `${libcurlPath}/**/*`.replace(/\\/g, "/"),
					dest: "libcurl",
					overwrite: false
				},
			],
		}),
		million.vite({ auto: true }),
		chunkSplitPlugin({
			strategy: "all-in-one",
			customSplitting: {
				utils: [/src\/utils/],
				components: [/src\/components/],
				pages: [/src\/pages/],
			},
		}),
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
			"/json/apps": {
				target: "http://localhost:8080/json/apps",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/json\/apps/, ""),
			},
		},
	},
	define: {
		"process.env.STATIC": process.env.STATIC,
	},
});
