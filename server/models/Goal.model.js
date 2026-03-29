const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  type: { type: String, enum: ['retirement','education','home','vehicle','wedding','emergency','travel','other'] },
  targetAmount: Number,
  targetDate: Date,
  currentSaved: { type: Number, default: 0 },
  monthlyContribution: Number,
  priority: { type: String, enum: ['high','medium','low'] },
  status: { type: String, enum: ['active','achieved','paused'], default: 'active' },
  aiPlan: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
