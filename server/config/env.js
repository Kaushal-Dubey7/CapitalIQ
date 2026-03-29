require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  aiApiKey: process.env.AI_API_KEY,
  aiModel: process.env.AI_MODEL || 'claude-sonnet-4-20250514',
  encryptionKey: process.env.ENCRYPTION_KEY,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
