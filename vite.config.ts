import { execSync } from 'node:child_process';
import type { Socket } from 'node:net';
import path from 'node:path';
// @ts-expect-error stfu
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
// @ts-expect-error stfu
import { libcurlPath } from '@mercuryworkshop/libcurl-transport';
import { server as wisp } from '@mercuryworkshop/wisp-js/server';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import react from '@vitejs/plugin-react-swc';
import million from 'million/compiler';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		target: 'ES2022',
		chunkSizeWarningLimit: 2700,
	},
	plugins: [
		{
			name: 'vite-wisp-server',
			configureServer(server) {
				server.httpServer?.on('upgrade', (req, socket: Socket, head) =>
					req.url?.startsWith('/wisp')
						? wisp.routeRequest(req, socket, head)
						: undefined,
				);
			},
		},
		viteStaticCopy({
			targets: [
				{
					src: `${uvPath}/uv.*`.replace(/\\/g, '/'),
					dest: 'uv',
					overwrite: false,
				},
				{
					src: `${libcurlPath}/**/*`.replace(/\\/g, '/'),
					dest: 'libcurl',
					overwrite: false,
				},
				{
					src: `${epoxyPath}/**/*`.replace(/\\/g, '/'),
					dest: 'epoxy',
					overwrite: false,
				},
			],
		}),
		million.vite({ auto: true }),
		react(),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	define: {
		__BUILD_DATE__: Date.now(),
		__GIT_COMMIT__: JSON.stringify(
			process.env.VERCEL_GIT_COMMIT_SHA ??
				process.env.CF_PAGES_COMMIT_SHA ??
				execSync('git rev-parse HEAD').toString().trim(),
		),
	},
});
