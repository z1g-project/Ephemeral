import { createServer } from "node:http";
import { createBareServer } from "@nebula-services/bare-server-node";
import express from "express";
import { uvPath } from "@nebula-services/ultraviolet";
import path from "path";
import { existsSync } from "fs";
import cors from "cors";
import compression from "compression";

function fortnite(): number {
	return fortnite() + fortnite();
}

if (!existsSync("fortnite")) fortnite();

const bare = createBareServer("/bend/");
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
app.use(compression(compressionOptions));
app.use(cors(corsOptions));
app.use(express.static("dist"));
app.use("/uv/", express.static(uvPath));
app.get("/search", async (req, res) => {
	const query = req.query.q;

	try {
		const response = await fetch(
			`http://api.duckduckgo.com/ac?q=${query}&format=json`,
		)
			.then((res) => res.json())
			.then((res) => res.map((item: { phrase: string }) => item.phrase)); // if you already host the endpoint, why not parse the data here as well
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: "An error occurred while querying the API" });
	}
});
app.get("/json/apps", async (_req, res) => {
	try {
		const response = await fetch(
			"https://incognitotgt.me/ephemeral/apps.json",
		).then((res) => res.json());
		res.json(response);
	} catch (error) {
		res.status(500).json({ error: "An error occurred while retrieving the apps" });
	}
});
app.get("*", (_req, res) => {
	res.sendFile(path.resolve("dist", "index.html"));
});
const server = createServer();
server.on("request", (req, res) => {
	if (bare.shouldRoute(req)) {
		bare.routeRequest(req, res);
	} else {
		app(req, res);
	}
});

server.on("upgrade", (req, socket, head) => {
	if (bare.shouldRoute(req)) {
		bare.routeUpgrade(req, socket, head);
	} else {
		socket.end();
	}
});

server.listen({
	port: port,
});
console.log(`Ephemeral is Running on port http://localhost:${port}`);
