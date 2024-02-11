import { createServer } from "node:http";
import { createBareServer } from "@nebula-services/bare-server-node";
import express from "express";
import axios from "axios";
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
    const response = await axios.get(
      `http://api.duckduckgo.com/ac?q=${query}&format=json`,
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while querying the API" });
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
