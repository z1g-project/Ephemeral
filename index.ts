import { createServer } from "node:http";
import { createBareServer } from "@nebula-services/bare-server-node";
import express from "express";
import { Socket, Head } from "ws";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import path from "path";
import cors from "cors";
import compression from "compression";
import { argv } from "node:process";
import config from "dotenv";
import wisp from "wisp-server-node";
// @ts-expect-error stfu
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
// @ts-expect-error stfu
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
// @ts-expect-error stfu
import { baremuxPath } from "@mercuryworkshop/bare-mux";
config.config();

const bare = createBareServer("/bend/", {});
const app = express();
const port = process.env.PORT || 8080;
const corsOptions = {
	origin: `http://localhost:${port}`,
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
};
const compressionOptions = {
	threshold: 0,
	filter: () => true,
};
const masqr = process.env.MASQR && process.env.MASQR.toLowerCase() === "true";
if (masqr) {
	console.log(`Masqr is Enabled`);
} else {
	console.log(`Masqr is Disabled`);
}
app.use(compression(compressionOptions));
app.use(cors(corsOptions));
app.use(
	express.static("dist", {
		setHeaders: (res, path) => {
			if (path.endsWith("cjs")) {
				res.setHeader("Content-Type", "text/javascript");
			}
		},
	}),
);
app.use("/libcurl/", express.static(libcurlPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));
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
console.log(argv);
if (argv[2] != "--dev") {
	app.get("*", (_, response) => {
		response.sendFile(path.resolve("dist", "index.html"));
	});
}

const server = createServer();
server.on("request", (request, response) => {
	if (bare.shouldRoute(request)) {
		// if (
		// 	request.headers["x-bare-host"] &&
		// 	request.headers["x-bare-host"] != "asdf.com"
		// ) {
		// 	console.log(request.headers);
		// 	request.socket.write(
		// 		'HTTP/1.1 200 NOT OK\n\n"NO LEAKING MY IP!!! GO TO ASDF.COM NOW"',
		// 	);
		// 	request.socket.end();
		// }
		bare.routeRequest(request, response);
	} else {
		app(request, response);
	}
});

server.on("upgrade", (req: Request, socket: Socket, head: Head) => {
	if (req.url.endsWith("/wisp/")) {
		wisp.routeRequest(req, socket, head);
	} else if (req.url.endsWith("/bend")) {
		// @ts-expect-error no?
		bare.routeUpgrade(req, socket, head);
	}
});

server.listen({
	port: port,
});
console.log(`Ephemeral is Running on port http://localhost:${port}`);
