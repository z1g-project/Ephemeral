// vite.config.ts
import million from "file:///C:/Users/interpolation/Desktop/github/Ephermal/node_modules/.pnpm/million@3.0.3/node_modules/million/dist/packages/compiler.mjs";
import path from "path";
import { defineConfig } from "file:///C:/Users/interpolation/Desktop/github/Ephermal/node_modules/.pnpm/vite@5.1.1_@types+node@20.11.17/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/interpolation/Desktop/github/Ephermal/node_modules/.pnpm/@vitejs+plugin-react@4.2.1_vite@5.1.1/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { viteStaticCopy } from "file:///C:/Users/interpolation/Desktop/github/Ephermal/node_modules/.pnpm/vite-plugin-static-copy@1.0.1_vite@5.1.1/node_modules/vite-plugin-static-copy/dist/index.js";
import { uvPath } from "file:///C:/Users/interpolation/Desktop/github/Ephermal/node_modules/.pnpm/@nebula-services+ultraviolet@1.0.1-1.patch.7/node_modules/@nebula-services/ultraviolet/lib/index.cjs";
var __dirname = path.resolve();
var vite_config_default = defineConfig({
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
			"/bare": {
				target: "http://localhost:8080/bare",
				changeOrigin: true,
				rewrite: (path2) => path2.replace(/^\/bend/, ""),
			},
			"/search": {
				target: "http://localhost:8080/search",
				changeOrigin: true,
				rewrite: (path2) => path2.replace(/^\/search/, ""),
			},
		},
	},
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxpbnRlcnBvbGF0aW9uXFxcXERlc2t0b3BcXFxcZ2l0aHViXFxcXEVwaGVybWFsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxpbnRlcnBvbGF0aW9uXFxcXERlc2t0b3BcXFxcZ2l0aHViXFxcXEVwaGVybWFsXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9pbnRlcnBvbGF0aW9uL0Rlc2t0b3AvZ2l0aHViL0VwaGVybWFsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IG1pbGxpb24gZnJvbSBcIm1pbGxpb24vY29tcGlsZXJcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgeyB2aXRlU3RhdGljQ29weSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1zdGF0aWMtY29weVwiO1xyXG5pbXBvcnQgeyB1dlBhdGggfSBmcm9tIFwiQG5lYnVsYS1zZXJ2aWNlcy91bHRyYXZpb2xldFwiO1xyXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLnJlc29sdmUoKTtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgdml0ZVN0YXRpY0NvcHkoe1xyXG4gICAgICB0YXJnZXRzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgc3JjOiBgJHt1dlBhdGh9L3V2LiouanNgLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpLFxyXG4gICAgICAgICAgZGVzdDogXCJ1dlwiLFxyXG4gICAgICAgICAgb3ZlcndyaXRlOiBmYWxzZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNyYzogYCR7X19kaXJuYW1lfS9ub2RlX21vZHVsZXMvbG9jYWxmb3JhZ2UvZGlzdC9sb2NhbGZvcmFnZS4qLmpzYC5yZXBsYWNlKFxyXG4gICAgICAgICAgICAvXFxcXC9nLFxyXG4gICAgICAgICAgICBcIi9cIixcclxuICAgICAgICAgICksXHJcbiAgICAgICAgICBkZXN0OiBcImxvY2FsZm9yYWdlXCIsXHJcbiAgICAgICAgICBvdmVyd3JpdGU6IGZhbHNlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICB9KSxcclxuICAgIG1pbGxpb24udml0ZSh7IGF1dG86IHRydWUgfSksXHJcbiAgICByZWFjdCgpLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwcm94eToge1xyXG4gICAgICBcIi9iYXJlXCI6IHtcclxuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2JhcmVcIixcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2JlbmQvLCBcIlwiKSxcclxuICAgICAgfSxcclxuICAgICAgXCIvc2VhcmNoXCI6IHtcclxuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3NlYXJjaFwiLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvc2VhcmNoLywgXCJcIiksXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdVLE9BQU8sYUFBYTtBQUM1VixPQUFPLFVBQVU7QUFDakIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsc0JBQXNCO0FBQy9CLFNBQVMsY0FBYztBQUN2QixJQUFNLFlBQVksS0FBSyxRQUFRO0FBRy9CLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLGVBQWU7QUFBQSxNQUNiLFNBQVM7QUFBQSxRQUNQO0FBQUEsVUFDRSxLQUFLLEdBQUcsTUFBTSxXQUFXLFFBQVEsT0FBTyxHQUFHO0FBQUEsVUFDM0MsTUFBTTtBQUFBLFVBQ04sV0FBVztBQUFBLFFBQ2I7QUFBQSxRQUNBO0FBQUEsVUFDRSxLQUFLLEdBQUcsU0FBUyxrREFBa0Q7QUFBQSxZQUNqRTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsVUFDQSxNQUFNO0FBQUEsVUFDTixXQUFXO0FBQUEsUUFDYjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFFBQVEsS0FBSyxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQUEsSUFDM0IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLFdBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsU0FBUztBQUFBLFFBQ1AsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsV0FBVyxFQUFFO0FBQUEsTUFDL0M7QUFBQSxNQUNBLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLGFBQWEsRUFBRTtBQUFBLE1BQ2pEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
