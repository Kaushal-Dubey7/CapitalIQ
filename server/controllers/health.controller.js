const HealthScore = require('../models/HealthScore.model');
const healthScoreEngine = require('../services/healthScoreEngine');
const aiService = require('../services/aiService');
const { sendSuccess, sendError } = require('../utils/responseUtils');

exports.computeHealthScore = async (req, res, next) => {
  try {
    const scores = healthScoreEngine.compute(req.body);
    const aiInsights = await aiService.generateHealthInsights(scores, req.body);
    const record = await HealthScore.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, ...scores, aiInsights },
      { upsert: true, new: true }
    );
    sendSuccess(res, 200, 'Health score computed', { healthScore: record });
  } catch (err) { next(err); }
};

exports.getHealthScore = async (req, res, next) => {
  try {
    const record = await HealthScore.findOne({ userId: req.user._id });
    if (!record) return sendError(res, 404, 'No health score found');
    sendSuccess(res, 200, 'Health score fetched', { healthScore: record });
  } catch (err) { next(err); }
};
