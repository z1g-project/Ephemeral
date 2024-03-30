#!/usr/bin/env tsx
import { createServer, IncomingMessage } from "node:http";
import { createServer as createViteServer } from "vite";
import { createBareServer } from "@tomphttp/bare-server-node";
import express from "express";
import path from "path";
import cors from "cors";
import compression from "compression";
import { argv } from "node:process";
import { Socket } from "node:net";
import wisp from "wisp-server-node";
const devMode = argv.includes("--dev");
const usingMasqr = process.env.MASQR || argv.includes("--masqr");
const noIpLeak = argv.includes("--no-ip-leak");
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
--no-ip-leak: only allow going to asdf.com
    `);
	process.exit(0);
}
const bare = createBareServer("/bend/", {
	blockLocal: false,
	maintainer: {
		website: "https://z1g-project.vercel.app",
		// todo: change this
		email: process.env.MAINTAINER_EMAIL || "tgt@incognitotgt.me",
	},
});
const vite = await createViteServer({
	server: { middlewareMode: true },
});
const app = express();
const corsOptions = {
	origin: `*`,
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
};
const compressionOptions = {
	threshold: 0,
	filter: () => true,
};
const masqr =
	(process.env.MASQR && process.env.MASQR.toLowerCase() === "true") ||
	usingMasqr;
app.use(compression(compressionOptions));
app.use(cors(corsOptions));
if (!devMode) {
	app.use(express.static("dist"));
} else {
	app.use(vite.middlewares);
}
if (!devMode) {
	app.get("*", (_, response) => {
		response.sendFile(path.resolve("dist", "index.html"));
	});
}

const server = createServer();
server.on("request", (request, response) => {
	if (bare.shouldRoute(request)) {
		if (noIpLeak) {
			if (
				request.headers["x-bare-host"] &&
				request.headers["x-bare-host"] != "asdf.com"
			) {
				console.log(request.headers);
				request.socket.write(
					'HTTP/1.1 406 Not Acceptable\n\n"NO LEAKING MY IP!!! GO TO ASDF.COM NOW"',
				);
				request.socket.end();
			}
		}
		bare.routeRequest(request, response);
	} else {
		app(request, response);
	}
});

server.on("upgrade", (req: IncomingMessage, socket: Socket, head) => {
	if (bare.shouldRoute(req)) {
		bare.routeUpgrade(req, socket, head);
	} else if (req.url.endsWith("/wisp/")) {
		wisp.routeRequest(req, socket, head);
	}
});
server.listen(port);
console.log(`
\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Running on port ${port} in ${devMode ? "dev" : "production"} mode
Configured with Masqr: ${masqr}
Configured with IP Leak Protection: ${noIpLeak}
`);
