const allowedOrigins = ["https://example.com"];
const corsOptions = {
  origin: function (origin, callback) {
    // console.log(origin);
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

module.exports = corsOptions;
