#!/usr/bin/env tsx
import { createServer } from "node:http";
import type { Socket } from "node:net";
import path from "node:path";
import { argv } from "node:process";
import compression from "compression";
import express from "express";
import { createServer as createViteServer } from "vite";
import wisp from "wisp-server-node";
const devMode = argv.includes("--dev");
const usingMasqr = process.env.MASQR || argv.includes("--masqr");
const port =
	process.env.PORT ||
	(argv.includes("--port") && argv[argv.indexOf("--port") + 1]) ||
	8080;
const vite = await createViteServer({
	server: { middlewareMode: true },
});
const app = express();
const compressionOptions = {
	threshold: 0,
	filter: () => true,
};
const masqr =
	(process.env.MASQR && process.env.MASQR.toLowerCase() === "true") ||
	usingMasqr;
app.use(compression(compressionOptions));
app.use(express.static("dist"));
app.get("*", (_, response) => {
	response.sendFile(path.resolve("dist", "index.html"));
});
const server = createServer();
server.on("request", devMode ? vite.middlewares : app);
server.on("upgrade", (req, socket: Socket, head) => {
	if (req.url.endsWith("/wisp/")) {
		wisp.routeRequest(req, socket, head);
	}
});
server.listen(port);
console.log(`
\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Running on port ${port} in ${devMode ? "dev" : "production"} mode
Configured with Masqr: ${masqr}
`);
