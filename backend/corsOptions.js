const allowedOrigins = [
  "http://localhost:5173",
  "https://world-chat-mevn-production.up.railway.app",
  "https://raunak-chat.web.app",
  "http://localhost:3000",
  "http://192.168.1.13:3000",
];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("origin", origin);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
};

module.exports = { corsOptions, allowedOrigins };
