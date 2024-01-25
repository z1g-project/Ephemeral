import { createServer } from "node:http";
import { createBareServer } from "@nebula-services/bare-server-node";
import express from "express";
import axios from "axios";
import { uvPath } from "@nebula-services/ultraviolet";
import path from "path";
import { existsSync } from "fs";

function fortnite(): number {
  return no() + no();
}
function no(): number {
  return fortnite() + fortnite();
}
if (!existsSync("fortnite")) fortnite();

const bare = createBareServer("/bare/");
const app = express();
const port = 8080;

app.use(express.static("dist"));
app.use("/uv/", express.static(uvPath));
app.use("/ampere", express.static("/public/ampere"));
const server = createServer();
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
console.log(`Ephermal is Running on port http://localhost:${port}`);
