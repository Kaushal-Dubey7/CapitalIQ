const Finance = require('../models/Finance.model');
const aiService = require('../services/aiService');
const { sendSuccess } = require('../utils/responseUtils');

exports.analyzeEvent = async (req, res, next) => {
  try {
    const { eventType, eventDetails } = req.body;
    const finance = await Finance.findOne({ userId: req.user._id });
    const advice = await aiService.analyzeLifeEvent({
      eventType, eventDetails, finance, user: req.user
    });
    sendSuccess(res, 200, 'Life event analyzed', { advice });
  } catch (err) { next(err); }
};
