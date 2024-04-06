import million from "million/compiler";
import path from "path";
import { execSync } from "child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
// @ts-expect-error stfu
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
// @ts-expect-error stfu
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
const __dirname = path.resolve();

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		target: "ES2022",
		chunkSizeWarningLimit: 2700,
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: `${uvPath}/uv.*`.replace(/\\/g, "/"),
					dest: "uv",
					overwrite: false,
				},
				{
					src: `${libcurlPath}/**/*`.replace(/\\/g, "/"),
					dest: "libcurl",
					overwrite: false,
				},
				{
					src: `${epoxyPath}/**/*`.replace(/\\/g, "/"),
					dest: "epoxy",
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
	define: {
		__BUILD_DATE__: Date.now(),
		__GIT_COMMIT__: JSON.stringify(
			process.env.VERCEL_GIT_COMMIT_SHA ??
				process.env.CF_PAGES_COMMIT_SHA ??
				execSync("git rev-parse HEAD").toString().trim(),
		),
	},
});
