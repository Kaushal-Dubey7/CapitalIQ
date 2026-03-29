exports.compute = (data) => {
  const {
    emergencyMonths = 0,
    debtRatio = 0,
    savingsRate = 0,
    insuranceCoverage = 0,
    healthInsurance = 0,
    diversification = 0
  } = data;

  // Max score per dimension is ~16.66 to make 100
  const m = 16.66;

  // 1. Emergency Fund (ideal: 6+ months)
  const emergencyFund = Math.min(m, (emergencyMonths / 6) * m);

  // 2. Debt Management (ideal: < 30% debt ratio)
  // if 0 ratio -> full score. If > 50 -> 0
  const maxDebtLimit = 50;
  const debtManagement = Math.max(0, m - (debtRatio / maxDebtLimit) * m);

  // 3. Savings Rate (ideal: > 20%)
  const savingsScore = Math.min(m, (savingsRate / 20) * m);

  // 4. Life Insurance Coverage (ideal: > 10x)
  const lifeInsurance = Math.min(m, (insuranceCoverage / 10) * m);

  // 5. Health Insurance
  const hlthInsScore = healthInsurance > 50 ? m : (healthInsurance > 0 ? m/2 : 0);

  // 6. Diversification (ideal: > 75)
  const divScore = Math.min(m, (diversification / 75) * m);

  const totalScore = Math.round(emergencyFund + debtManagement + savingsScore + lifeInsurance + hlthInsScore + divScore);

  return {
    totalScore,
    scoreBreakdown: {
      emergencyFund: emergencyFund,
      debtManagement: debtManagement,
      savingsRate: savingsScore,
      lifeInsurance: lifeInsurance,
      healthInsurance: hlthInsScore,
      diversification: divScore
    }
  };
};
