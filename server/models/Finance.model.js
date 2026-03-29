const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  type: { type: String, enum: ['mutualfund','stocks','ppf','fd','gold','realestate','crypto','nps','other'] },
  name: String,
  currentValue: Number,
  investedAmount: Number,
  units: Number,
  purchaseDate: Date,
  nav: Number,
});

const liabilitySchema = new mongoose.Schema({
  type: { type: String, enum: ['homeloan','carloan','personalloan','creditcard','education','other'] },
  name: String,
  outstanding: Number,
  emi: Number,
  interestRate: Number,
  tenureLeft: Number,
});

const financeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  monthlyIncome: Number,
  monthlyExpenses: Number,
  annualBonus: Number,
  employmentType: { type: String, enum: ['salaried','selfemployed','business'] },
  taxRegime: { type: String, enum: ['old','new'], default: 'new' },
  assets: [assetSchema],
  liabilities: [liabilitySchema],
  insurancePolicies: [{
    type: { type: String, enum: ['term','health','ulip','vehicle','home','other'] },
    provider: String,
    sumAssured: Number,
    premium: Number,
    nominees: [String],
  }],
  emergencyFund: Number,
  monthlyInvestment: Number,
}, { timestamps: true });

module.exports = mongoose.model('Finance', financeSchema);
