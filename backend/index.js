"use strict";

// Import modules
const express = require("express");
const cors = require("cors");
const { corsOptions, allowedOrigins } = require("./corsOptions.js");
const { connectDb } = require("./db.js");
const { read, addMsg } = require("./crud.js");
const http = require("http");
const WebSocket = require("ws");

// Create Express app
const app = express();
app.use(cors(corsOptions));

// Register the error handler middleware

app.use(require("./api.js"));

// Connect to the database
(async () => {
  try {
    await connectDb();
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
  await app.use(async (err, req, res, next) => {
    // get origin
    const origin = await req.headers.origin;
    console.log("origin Index: ", origin);
    if (err) {
      return await res.status(403).send({
        status: 403,
        message: err.message,
      });
    } else {
      await next();
    }
  });
  // Create HTTP server and WebSocket server
  const server = http.createServer(app);
  const wss = new WebSocket.Server({
    server,
    verifyClient: (info, done) => {
      console.log("info.origin", info.origin);
      if (allowedOrigins.includes(info.origin)) {
        done(true);
      } else {
        done(false, 403, "Invalid Origin");
      }
    },
  });
  const clients = new Map();

  // WebSocket connection handler
  wss.on("connection", async (ws, req) => {
    const ip = req.socket.remoteAddress;
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
    console.log(`Client connected ${ip}`);
    clients.set(ip, ws);

    // WebSocket message handler
    ws.on("message", async (message) => {
      try {
        const msg = JSON.parse(message);
        if (msg.get) {
          const chats = { messages: await read(msg.continent) };
          return ws.send(JSON.stringify(chats));
        }

        // Send message to all clients except the sender
        clients.forEach((clientWs, clientIp) => {
          if (clientIp !== ip) {
            clientWs.send(message);
          }
        });

        addMsg(msg);
      } catch (error) {
        // console.log("Error handling WebSocket message:", error);
      }
    });

    // WebSocket disconnection handler
    ws.on("close", () => {
      console.log(`Client disconnected with IP address ${ip}`);
      clients.delete(ip);
    });
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log("Server listening on port", PORT);
  });
})();
