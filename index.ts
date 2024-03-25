import { createServer } from "node:http";
import { createBareServer } from "@nebula-services/bare-server-node";
import express from "express";
import { uvPath } from "@nebula-services/ultraviolet";
import path from "path";
import cors from "cors";
import compression from "compression";
import { argv } from "node:process";
import config from "dotenv";
import wisp from "wisp-server-node"
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
app.use(express.static("dist"));
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

server.on("upgrade", (request, socket, head) => {
	if (bare.shouldRoute(request)) {
		bare.routeUpgrade(request, socket, head);
	} else {
		socket.end();
	}

	wisp.routeRequest(request, socket, head);
});

server.listen({
	port: port,
});
console.log(`Ephemeral is Running on port http://localhost:${port}`);
