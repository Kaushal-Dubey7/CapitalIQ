const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  holdings: [{
    schemeName: String,
    schemeCode: String,
    units: Number,
    avgNav: Number,
    currentNav: Number,
    investedValue: Number,
    currentValue: Number,
    xirr: Number,
    expenseRatio: Number,
    category: String,
    amc: String,
  }],
  totalInvested: Number,
  totalCurrentValue: Number,
  overallXIRR: Number,
  overlapMatrix: { type: mongoose.Schema.Types.Mixed },
  benchmarkReturn: Number,
  aiRebalancingPlan: { type: mongoose.Schema.Types.Mixed },
  uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
