const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  age: Number,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  city: String,
  maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'] },
  dependents: { type: Number, default: 0 },
  riskProfile: { type: String, enum: ['conservative', 'moderate', 'aggressive'], default: 'moderate' },
  financialGoals: [String],
  preferredLanguage: { type: String, default: 'en' },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
