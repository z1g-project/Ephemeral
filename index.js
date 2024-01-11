import { createServer } from "node:http";
import { createBareServer } from "@tomphttp/bare-server-node";
import express from "express";
import path from "path";
const bare = createBareServer("/bare/");
const app = express();
const port = 8080;

app.use(express.static("dist"));
const server = createServer();
app.get('*', (req, res) => {
    res.sendFile(path.resolve('dist', 'index.html'));
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
