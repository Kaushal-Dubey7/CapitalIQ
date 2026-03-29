const Finance = require('../models/Finance.model');
const Goal = require('../models/Goal.model');
const HealthScore = require('../models/HealthScore.model');
const aiService = require('../services/aiService');
const { sendSuccess } = require('../utils/responseUtils');

exports.chat = async (req, res, next) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    const [finance, goals, healthScore] = await Promise.all([
      Finance.findOne({ userId: req.user._id }),
      Goal.find({ userId: req.user._id }),
      HealthScore.findOne({ userId: req.user._id }),
    ]);
    const userContext = { finance, goals, healthScore, user: req.user };
    const reply = await aiService.chat(message, conversationHistory, userContext);
    sendSuccess(res, 200, 'AI response', { reply });
  } catch (err) { next(err); }
};
