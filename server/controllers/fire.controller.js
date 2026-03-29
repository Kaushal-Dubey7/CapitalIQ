const Finance = require('../models/Finance.model');
const Goal = require('../models/Goal.model');
const fireEngine = require('../services/fireEngine');
const aiService = require('../services/aiService');
const { sendSuccess, sendError } = require('../utils/responseUtils');

exports.generateFirePlan = async (req, res, next) => {
  try {
    const { age, retirementAge, monthlyIncome, monthlyExpenses,
      currentSavings, riskProfile, goals, inflationRate } = req.body;

    const projections = fireEngine.computeFireProjection({
      age, retirementAge, monthlyIncome, monthlyExpenses,
      currentSavings, riskProfile, goals,
      inflationRate: inflationRate || 6
    });

    await Finance.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, monthlyIncome, monthlyExpenses },
      { upsert: true, new: true }
    );

    if (goals?.length) {
      await Goal.deleteMany({ userId: req.user._id });
      await Goal.insertMany(goals.map(g => ({ ...g, userId: req.user._id })));
    }

    const aiNarrative = await aiService.generateFireNarrative({
      projections, age, retirementAge, monthlyIncome
    });

    sendSuccess(res, 200, 'FIRE plan generated', { projections, aiNarrative });
  } catch (err) { next(err); }
};

exports.getFirePlan = async (req, res, next) => {
  try {
    const goals = await Goal.find({ userId: req.user._id });
    const finance = await Finance.findOne({ userId: req.user._id });
    sendSuccess(res, 200, 'FIRE plan fetched', { goals, finance });
  } catch (err) { next(err); }
};

exports.addGoal = async (req, res, next) => {
  try {
    const goal = await Goal.create({ ...req.body, userId: req.user._id });
    sendSuccess(res, 201, 'Goal added', { goal });
  } catch (err) { next(err); }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body, { new: true }
    );
    if (!goal) return sendError(res, 404, 'Goal not found');
    sendSuccess(res, 200, 'Goal updated', { goal });
  } catch (err) { next(err); }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    sendSuccess(res, 200, 'Goal deleted');
  } catch (err) { next(err); }
};
