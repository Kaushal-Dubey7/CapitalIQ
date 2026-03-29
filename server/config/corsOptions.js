const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins in development
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
module.exports = corsOptions;
