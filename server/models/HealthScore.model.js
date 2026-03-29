const mongoose = require('mongoose');

const healthScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalScore: Number,
  scoreBreakdown: {
    emergencyFund: Number,
    debtManagement: Number,
    savingsRate: Number,
    lifeInsurance: Number,
    healthInsurance: Number,
    diversification: Number
  },
  aiInsights: [String],
  recommendations: [{ dimension: String, action: String, impact: String, priority: String }],
}, { timestamps: true });

module.exports = mongoose.model('HealthScore', healthScoreSchema);
