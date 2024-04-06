#!/usr/bin/env tsx
import { createServer } from "node:http";
import { createServer as createViteServer } from "vite";
import express from "express";
import path from "path";
import compression from "compression";
import { argv } from "node:process";
import { Socket } from "node:net";
import wisp from "wisp-server-node";
const devMode = argv.includes("--dev");
const usingMasqr = process.env.MASQR || argv.includes("--masqr");
const port =
	process.env.PORT ||
	(argv.includes("--port") && argv[argv.indexOf("--port") + 1]) ||
	8080;
process.chdir(import.meta.url.replace("file://", "").replace("index.ts", ""));
if (argv.includes("-h") || argv.includes("--help")) {
	console.log(`
\x1b[34;49mEphemeral
\x1b[37;49m
default: Run in production mode
--port <port>: Specify the port to run on
--dev: Run in development mode
--help, -h: Display this help message
--masqr: Enable masqr
    `);
	process.exit(0);
}
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
vite.bindCLIShortcuts({ print: true });
