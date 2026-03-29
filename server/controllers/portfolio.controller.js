const Portfolio = require('../models/Portfolio.model');
const portfolioEngine = require('../services/portfolioEngine');
const aiService = require('../services/aiService');
const pdfParser = require('../services/pdfParser');
const { sendSuccess } = require('../utils/responseUtils');

exports.analyzePortfolio = async (req, res, next) => {
  try {
    let holdings = req.body.holdings;
    if (req.file) {
      holdings = await pdfParser.extractCAMSStatement(req.file.buffer);
    }
    const analysis = portfolioEngine.analyze(holdings);
    const aiPlan = await aiService.generateRebalancingPlan(analysis);
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, ...analysis, aiRebalancingPlan: aiPlan,
        uploadedAt: new Date() },
      { upsert: true, new: true }
    );
    sendSuccess(res, 200, 'Portfolio analyzed', { portfolio });
  } catch (err) { next(err); }
};

exports.getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    sendSuccess(res, 200, 'Portfolio fetched', { portfolio });
  } catch (err) { next(err); }
};
