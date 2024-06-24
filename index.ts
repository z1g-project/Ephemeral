#!/usr/bin/env tsx
import { createServer } from "node:http";
import type { Socket } from "node:net";
import path from "node:path";
import { argv } from "node:process";
import compression from "@fastify/compress";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import wisp from "wisp-server-node";
const port =
	Number.parseInt(process.env.PORT) ||
	(argv.includes("--port") &&
		Number.parseInt(argv[argv.indexOf("--port") + 1])) ||
	8080;
const app = Fastify({
	serverFactory: (handler) =>
		createServer(handler).on(
			"upgrade",
			(req, socket: Socket, head) =>
				req.url.endsWith("/wisp/") && wisp.routeRequest(req, socket, head),
		),
});
app.register(compression);
app.register(fastifyStatic, {
	root: path.resolve(import.meta.dirname, "dist"),
});
app.setNotFoundHandler((_, res) => {
	res.sendFile("index.html");
});

app.listen({ port }, (err, addr) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Running on ${addr}`);
});
