exports.analyze = (data) => {
  const {
    grossSalary = 0, hra = 0, lta = 0, otherAllowances = 0,
    standard80C = 0, nps80CCD = 0, healthInsurance80D = 0,
    homeLoanInterest24 = 0, otherDeductions = 0,
    rentPaid = 0, metroCity = false
  } = data;

  const stdDeduction = 75000;
  const stdDeductionOld = 50000;

  const hraExempt = Math.min(
    hra || 0,
    Math.max(0, (rentPaid || 0) - 0.1 * grossSalary),
    metroCity ? 0.5 * grossSalary : 0.4 * grossSalary
  );

  const grossOld = grossSalary - stdDeductionOld - Math.max(0, hraExempt) - (lta || 0);
  const deductionsOld = Math.min(150000, standard80C) +
    Math.min(50000, nps80CCD) +
    Math.min(25000, healthInsurance80D) +
    Math.min(200000, homeLoanInterest24) +
    otherDeductions;
  const taxableOld = Math.max(0, grossOld - deductionsOld);
  const taxOldRegime = computeSlab(taxableOld, 'old');

  const taxableNew = Math.max(0, grossSalary - stdDeduction);
  const taxNewRegime = computeSlab(taxableNew, 'new');

  const savings = taxOldRegime - taxNewRegime;
  const recommendedRegime = savings > 0 ? 'old' : 'new';

  const missedDeductions = [];
  if (standard80C < 150000) missedDeductions.push({
    section: '80C', description: 'ELSS/PPF/NPS/LIC',
    maxLimit: 150000, currentUsed: standard80C,
    potentialSaving: Math.round((150000 - standard80C) * 0.3)
  });
  if (nps80CCD < 50000) missedDeductions.push({
    section: '80CCD(1B)', description: 'Additional NPS contribution',
    maxLimit: 50000, currentUsed: nps80CCD,
    potentialSaving: Math.round((50000 - nps80CCD) * 0.3)
  });
  if (healthInsurance80D < 25000) missedDeductions.push({
    section: '80D', description: 'Health Insurance Premium',
    maxLimit: 25000, currentUsed: healthInsurance80D,
    potentialSaving: Math.round((25000 - healthInsurance80D) * 0.3)
  });
  if (homeLoanInterest24 === 0) missedDeductions.push({
    section: '24(b)', description: 'Home Loan Interest (if applicable)',
    maxLimit: 200000, currentUsed: 0,
    potentialSaving: 60000
  });

  return {
    grossSalary,
    taxOldRegime: Math.round(taxOldRegime),
    taxNewRegime: Math.round(taxNewRegime),
    recommendedRegime,
    potentialSavings: Math.abs(Math.round(savings)),
    taxableIncomeOld: Math.round(taxableOld),
    taxableIncomeNew: Math.round(taxableNew),
    missedDeductions,
  };
};

function computeSlab(income, regime) {
  if (regime === 'new') {
    if (income <= 300000) return 0;
    if (income <= 700000) return (income - 300000) * 0.05;
    if (income <= 1000000) return 20000 + (income - 700000) * 0.10;
    if (income <= 1200000) return 50000 + (income - 1000000) * 0.15;
    if (income <= 1500000) return 80000 + (income - 1200000) * 0.20;
    return 140000 + (income - 1500000) * 0.30;
  } else {
    if (income <= 250000) return 0;
    if (income <= 500000) return (income - 250000) * 0.05;
    if (income <= 1000000) return 12500 + (income - 500000) * 0.20;
    return 112500 + (income - 1000000) * 0.30;
  }
}
