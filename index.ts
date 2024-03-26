#!/usr/bin/env tsx
import { createServer, IncomingMessage } from "node:http";
import { createServer as createViteServer } from "vite";
import { createBareServer } from "@nebula-services/bare-server-node";
import express from "express";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import path from "path";
import cors from "cors";
import compression from "compression";
import { argv } from "node:process";
import { Socket } from "node:net";
import config from "dotenv";
import wisp from "wisp-server-node";
// @ts-expect-error stfu
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
// @ts-expect-error stfu
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
// @ts-expect-error stfu
import { baremuxPath } from "@mercuryworkshop/bare-mux";
const devMode = argv.includes("--dev");
const usingMasqr = process.env.MASQR || argv.includes("--masqr");
const noIpLeak = argv.includes("--no-ip-leak");
const port =
	process.env.PORT ||
	(argv.includes("--port") && argv[argv.indexOf("--port") + 1]) ||
	8080;
config.config();
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
	maintainer: {
		website: "https://z1g-project.vercel.app",
		// todo: change this
		email: "tgt@incognitotgt.me",
	},
});
const vite = await createViteServer({
	server: { middlewareMode: true },
});
const app = express();
const corsOptions = {
	origin: `http://localhost:${port}`,
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
const setCjsHeaders = {
	setHeaders: (res: express.Response, path: string) => {
		if (path.endsWith("cjs")) {
			res.setHeader("Content-Type", "text/javascript");
		}
	},
};
app.use(compression(compressionOptions));
app.use(cors(corsOptions));
app.get("/json/apps", async (_, response) => {
	try {
		const data = await fetch("https://incognitotgt.me/ephemeral/apps.json")
			.then(statusValidator)
			.then((response) => response.json())
			.then((response) => Array(20).fill(response).flat())
			.catch(statusCatcher);

		response.json({ status: "success", data });
	} catch (error) {
		console.log(error);
		response.status(500).json({
			status: "error",
			error: {
				message: "An error occurred while retrieving the apps",
				detail: error,
			},
		});
	}
});
if (!devMode) {
	app.use(express.static("dist", setCjsHeaders));
} else {
	app.use(vite.middlewares);
}
app.use("/libcurl/", express.static(libcurlPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath, setCjsHeaders));
app.use("/uv/", express.static(uvPath));
const statusValidator = (response: Response) =>
	response.ok ? response : Promise.reject(response);
const statusCatcher = ({ status, statusText }: Response) => {
	throw `API returned ${status} ${statusText}`;
};
app.get("/search", async (request, response) => {
	const query = request.query.q;

	try {
		const data = await fetch(
			`http://api.duckduckgo.com/ac?q=${query}&format=json`,
		)
			.then(statusValidator)
			.then((reponse) => reponse.json())
			.then((response) =>
				response.map((item: { phrase: string }) => item.phrase),
			)
			.catch(statusCatcher);
		response.json({
			status: "success",
			data,
		});
	} catch (error) {
		response.status(500).json({
			status: "error",
			error: {
				message: "An error occured while querying the API",
				detail: error,
			},
		});
	}
});
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

server.listen({
	port: port,
});
console.log(`
\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Running on port ${port} in ${devMode ? "dev" : "production"} mode
Configured with Masqr: ${masqr}
Configured with IP Leak Protection: ${noIpLeak}
`);
