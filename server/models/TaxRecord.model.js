const mongoose = require('mongoose');

const taxRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  financialYear: String,
  grossSalary: Number,
  hra: Number,
  lta: Number,
  otherAllowances: Number,
  standard80C: Number,
  nps80CCD: Number,
  healthInsurance80D: Number,
  homeLoanInterest24: Number,
  otherDeductions: Number,
  taxOldRegime: Number,
  taxNewRegime: Number,
  recommendedRegime: String,
  potentialSavings: Number,
  missedDeductions: [{ section: String, description: String, maxLimit: Number, currentUsed: Number, potentialSaving: Number }],
  aiSuggestions: [String],
}, { timestamps: true });

module.exports = mongoose.model('TaxRecord', taxRecordSchema);
