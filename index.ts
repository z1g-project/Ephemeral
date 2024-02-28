import { createServer } from "node:http";
import { createBareServer } from "@nebula-services/bare-server-node";
import express from "express";
import { uvPath } from "@nebula-services/ultraviolet";
import path from "path";
import { existsSync } from "fs";
import cors from "cors";
import compression from "compression";
import config from "dotenv";
import wisp from "wisp-server-node"
import fs from "fs"
config.config();
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
app.get("/search", async (req, res) => {
	const query = req.query.q;
	try {
		const response = await fetch(
			`http://api.duckduckgo.com/ac?q=${query}&format=json`,
		)
			.then((res) => res.json())
			.then((res) => res.map((item: { phrase: string }) => item.phrase));
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
async function MasqFail(req, res) {
	if (!req.headers.host) {
	  return;
	}
	const unsafeSuffix = req.headers.host + ".html";
	const safeSuffix = path.normalize(unsafeSuffix).replace(/^(\.\.(\/|\\|$))+/, "");
	const safeJoin = path.join(process.cwd() + "/Masqrd", safeSuffix);
	try {
	  await fs.promises.access(safeJoin);
	  const failureFileLocal = await fs.promises.readFile(safeJoin, "utf8");
	  res.setHeader("Content-Type", "text/html");
	  res.send(failureFileLocal);
	  return;
	} catch (e) {
	  res.setHeader("Content-Type", "text/html");
	  res.send(fs.readFileSync("fail.html", "utf8"));
	  return;
	}
  }
if (masqr) {
	app.use(async (req, res, next) => {
	  if (req.headers.host && process.env.WHITELISTED_DOMAINS.includes(req.headers.host)) {
		next();
		return;
	  }
	  if (req.url.includes("/bare")) {
		next();
		return;
	  }
	  const authheader = req.headers.authorization;
	  if (req.cookies["authcheck"]) {
		next();
		return;
	  }
	  if (req.cookies['refreshcheck'] != "true") {
		res.cookie("refreshcheck",  "true",  {maxAge: 10000})
		MasqFail(req, res) 
		return;
	  }
	  if (!authheader) {   
		res.setHeader('WWW-Authenticate', 'Basic');
		res.status(401);
		MasqFail(req, res) 
		return;
	  }
  
	  const auth = Buffer.from(authheader.split(' ')[1],'base64').toString().split(':');
	  const user = auth[0];
	  const pass = auth[1];
	  const licenseCheck = ((await (await fetch(process.env.LICENSE_SERVER_URL + pass + "&host=" + req.headers.host)).json()))["status"]
	  console.log(`\x1b[0m${process.env.LICENSE_SERVER_URL}${pass}&host=${req.headers.host} ` + `returned: ${licenseCheck}`)
	  if (licenseCheck == "License valid") {
		  res.cookie("authcheck", "true", {expires: new Date((Date.now()) + (365*24*60*60 * 1000))})
		  res.send(`<script> window.location.href = window.location.href </script>`)
		  return;
	  }  
	  MasqFail(req, res)
	  return; 
	});
  }
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
	// @ts-expect-error stfu
	wisp.routeRequest(req, socket as Socket, head);
});

server.listen({
	port: port,
});
console.log(`Ephemeral is Running on port http://localhost:${port}`);
