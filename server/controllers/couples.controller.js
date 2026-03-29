const CoupleLink = require('../models/CoupleLink.model');
const Finance = require('../models/Finance.model');
const User = require('../models/User.model');
const aiService = require('../services/aiService');
const { sendSuccess, sendError } = require('../utils/responseUtils');

exports.linkPartner = async (req, res, next) => {
  try {
    const { partnerEmail } = req.body;
    const partner = await User.findOne({ email: partnerEmail });
    if (!partner) return sendError(res, 404, 'Partner not found');
    const link = await CoupleLink.findOneAndUpdate(
      { $or: [{ partner1: req.user._id }, { partner2: req.user._id }] },
      { partner1: req.user._id, partner2: partner._id, status: 'active' },
      { upsert: true, new: true }
    );
    sendSuccess(res, 200, 'Partners linked', { link });
  } catch (err) { next(err); }
};

exports.generateCouplesPlan = async (req, res, next) => {
  try {
    const link = await CoupleLink.findOne({
      $or: [{ partner1: req.user._id }, { partner2: req.user._id }],
      status: 'active'
    });
    if (!link) return sendError(res, 404, 'No active couple link found');

    const [f1, f2] = await Promise.all([
      Finance.findOne({ userId: link.partner1 }),
      Finance.findOne({ userId: link.partner2 }),
    ]);

    const combinedNetWorth = (f1?.assets?.reduce((s, a) =>
      s + (a.currentValue || 0), 0) || 0) +
      (f2?.assets?.reduce((s, a) => s + (a.currentValue || 0), 0) || 0);

    const aiPlan = await aiService.generateCouplesPlan({
      partner1Finance: f1, partner2Finance: f2,
      sharedGoals: req.body.sharedGoals
    });

    link.combinedNetWorth = combinedNetWorth;
    link.optimizationPlan = aiPlan;
    await link.save();

    sendSuccess(res, 200, 'Couples plan generated', {
      link, combinedNetWorth, aiPlan
    });
  } catch (err) { next(err); }
};

exports.getCouplesPlan = async (req, res, next) => {
  try {
    const link = await CoupleLink.findOne({
      $or: [{ partner1: req.user._id }, { partner2: req.user._id }]
    }).populate('partner1 partner2', 'name email');
    sendSuccess(res, 200, 'Couples plan fetched', { link });
  } catch (err) { next(err); }
};
