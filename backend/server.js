"use strict";

const app = require("express")();
const cors = require("cors");
const corsOptions = require("./corsOptions");
app.use(cors(corsOptions));
const db = require("./db.js");
const crud = require("./crud.js");

(async () => {
  await db.connectDb();
  app.use(require("./api.js"));

  const http = require("http");
  const server = http.createServer(app);
  const WebSocket = require("ws");
  const wss = new WebSocket.Server({ server });
  const clients = new Map();
  wss.on("connection", async (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`Client connected ${ip}`);
    if (clients.has(ip)) {
      ws.send(
        JSON.stringify({
          type: "alert",
          message: "You are already connected",
        })
      );
      ws.close();
      return;
    }
    clients.set(ip, ws);

    ws.on("message", async (message) => {
      const msg = JSON.parse(message);
      if (msg.get) {
        const chats = { messages: await crud.read(msg.continent) };
        return ws.send(JSON.stringify(chats));
      }
      ws.send(JSON.stringify(msg));
      crud.addMsg(msg);
    });

    ws.on("close", () => {
      console.log(`Client disconnected with IP address ${ip}`);
      clients.delete(ip);
    });
  });
  // start the server
  const reqs = server.listen(process.env.PORT || 3000, () => {
    console.log("Server listening on port", server.address().port);
  });
  // reqs.on("request", cors(corsOptions));
})();
