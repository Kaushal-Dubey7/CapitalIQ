exports.extractForm16 = async (buffer) => {
  // Production: parse buffer with pdf-parse or call Python service
  return {
    salaryIncome: 1250000,
    deductionsHRA: 110000,
    deductions80C: 150000,
    deductions80D: 25000
  };
};

exports.extractCAMSStatement = async (buffer) => {
  // Production: parse CAMS PDF table with tabula-py or pdf-parse
  return [
    { schemeName: 'Parag Parikh Flexi Cap', category: 'Equity', investedValue: 350000, currentValue: 500000, expenseRatio: 0.70, xirr: 18.2 },
    { schemeName: 'Nifty 50 Index', category: 'Equity', investedValue: 200000, currentValue: 300000, expenseRatio: 0.10, xirr: 15.1 },
    { schemeName: 'SBI Liquid Fund', category: 'Debt', investedValue: 180000, currentValue: 200000, expenseRatio: 0.25, xirr: 6.5 }
  ];
};
