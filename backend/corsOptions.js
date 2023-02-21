const allowedOrigins = [
  "https://world-chat-mevn-production.up.railway.app",
  "https://raunak-chat.web.app",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log("Origin Blocked: ", origin);
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
