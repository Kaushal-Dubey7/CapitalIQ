const mongoose = require('mongoose');

const coupleLinkSchema = new mongoose.Schema({
  partner1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  partner2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending','active'], default: 'pending' },
  sharedGoals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],
  combinedNetWorth: Number,
  optimizationPlan: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('CoupleLink', coupleLinkSchema);
