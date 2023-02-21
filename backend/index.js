"use strict";

// Import modules
const express = require("express");
const cors = require("cors");
const { corsOptions, allowedOrigins } = require("./corsOptions.js");
const { connectDb } = require("./db.js");
const http = require("http");
const WebSocket = require("ws");
const { getChats, addChat } = require("./crud.js");

// Create Express app
const app = express();
app.use(cors(corsOptions));

// Register the error handler middleware
app.use(async (err, req, res, next) => {
  // get origin
  const origin = await req.headers.origin;
  if (err) {
    return await res.status(403).send({
      status: 403,
      message: err.message,
    });
  } else {
    await next();
  }
});

// Connect to the database
(async () => {
  try {
    await connectDb();
  } catch (error) {
    console.error("Error connecting to database:", error);
  }

  // Create HTTP server and WebSocket server
  const server = http.createServer(app);
  const wss = new WebSocket.Server({
    server,
    verifyClient: (info, done) => {
      if (allowedOrigins.includes(info.origin)) {
        done(true);
      } else {
        console.log("ws Origin Blocked: ", info.origin);
        done(false, 403, "Invalid Origin");
      }
    },
  });
  const clients = new Map();
  // Set to keep track of penalized IPs and their penalty end time
  const penalizedIps = new Map();

  // WebSocket connection handler
  wss.on("connection", async (ws, req) => {
    const ip = req.socket.remoteAddress;

    if (penalizedIps.has(ip)) {
      const penaltyEndTime = penalizedIps.get(ip);
      console.log(
        "penaltyEndTime Seconds: ",
        (penaltyEndTime - Date.now()) / 1000
      );
      if (penalizedIps.has(ip) && penaltyEndTime < Date.now()) {
        penalizedIps.delete(ip);
      } else {
        const timeLeft = Math.ceil((penaltyEndTime - Date.now()) / 1000 / 60);
        ws.send(
          JSON.stringify({
            type: "alert",
            message: `You are still penalized for spamming. Please try again in ${timeLeft} minutes.`,
          })
        );
        ws.close();
        return;
      }
    }

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

    let counter = 0; // counter to track number of messages sent
    const timer = setInterval(() => {
      counter = 0; // reset counter every 5 seconds
    }, 5000);

    clients.set(ip, ws);
    // send online count to all clients
    clients.forEach((clientWs) => {
      clientWs.send(
        JSON.stringify({
          type: "online",
          online: clients.size,
        })
      );
    });

    const ipv4 = ip.replace("::ffff:", "");
    console.log(`Client connected: ${ipv4}`);

    // WebSocket message handler
    ws.on("message", async (message) => {
      try {
        const msg = JSON.parse(message);
        if (msg.get) {
          const chats = { messages: await getChats(msg.continent) };
          return ws.send(JSON.stringify(chats));
        }

        // check if same IP is spamming
        counter++;
        if (counter > 5) {
          const mins = 10;
          const penaltyEndTime = Date.now() + mins * 60 * 1000;
          penalizedIps.set(ip, penaltyEndTime);

          ws.send(
            JSON.stringify({
              type: "alert",
              message: `You have been penalized for spamming. Please try again in ${mins} minutes.`,
            })
          );
          ws.close();
          clearInterval(timer);
          return;
        }

        // Send message to all clients except the sender
        clients.forEach((clientWs, clientIp) => {
          if (clientIp !== ip) {
            clientWs.send(JSON.stringify(msg));
          }
        });
        await addChat(msg);
      } catch (error) {
        console.log("Error handling WebSocket message:", error.message);
      }
    });

    // WebSocket disconnection handler
    ws.on("close", () => {
      console.log(`Client disconnected: ${ipv4}`);
      clients.delete(ip);
      clients.forEach((clientWs) => {
        clientWs.send(
          JSON.stringify({
            type: "online",
            online: clients.size,
          })
        );
      });
      clearInterval(timer);
    });
  });

  app.get("/", function (req, res) {
    const msg = { msg: "Unlocked!" };
    return res.send(msg);
  });

  app.use(function (_, res) {
    res.status(404).send({
      status: 404,
      message: "Sorry can't find that!",
    });
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log("Server listening on port", PORT);
  });
})();
