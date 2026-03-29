exports.computeFireProjection = ({
  age, retirementAge, monthlyIncome, monthlyExpenses,
  currentSavings, riskProfile, goals, inflationRate
}) => {
  const yearsToRetirement = retirementAge - age;
  const monthlySurplus = monthlyIncome - monthlyExpenses;
  const returnRate = riskProfile === 'aggressive' ? 0.12
    : riskProfile === 'moderate' ? 0.10 : 0.08;

  const fvCurrentSavings = currentSavings * Math.pow(1 + returnRate, yearsToRetirement);
  const monthlyReturn = returnRate / 12;
  const months = yearsToRetirement * 12;
  const fvSIP = monthlySurplus * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
  const totalCorpus = fvCurrentSavings + fvSIP;

  const inflatedAnnualExpenses = monthlyExpenses * 12 * Math.pow(1 + inflationRate / 100, yearsToRetirement);
  const requiredCorpus = inflatedAnnualExpenses * 25;

  const goalPlans = (goals || []).map(goal => {
    const yearsToGoal = Math.max(0, (new Date(goal.targetDate).getFullYear() - new Date().getFullYear()));
    const monthsToGoal = yearsToGoal * 12;
    const requiredSIP = monthsToGoal > 0 ? goal.targetAmount /
      ((Math.pow(1 + monthlyReturn, monthsToGoal) - 1) / monthlyReturn) : 0;
    return { ...goal, requiredSIP: Math.round(requiredSIP), yearsToGoal };
  });

  const milestones = [];
  for (let y = 1; y <= yearsToRetirement; y += 5) {
    const m = y * 12;
    const corpus = currentSavings * Math.pow(1 + returnRate, y) +
      monthlySurplus * ((Math.pow(1 + monthlyReturn, m) - 1) / monthlyReturn);
    milestones.push({ year: age + y, corpus: Math.round(corpus) });
  }

  return {
    totalCorpus: Math.round(totalCorpus),
    requiredCorpus: Math.round(requiredCorpus),
    corpusGap: Math.round(requiredCorpus - totalCorpus),
    fireAchievable: totalCorpus >= requiredCorpus,
    monthlySurplus,
    recommendedSIP: Math.round(monthlySurplus * 0.8),
    assetAllocation: riskProfile === 'aggressive'
      ? { equity: 80, debt: 15, gold: 5 }
      : riskProfile === 'moderate'
      ? { equity: 60, debt: 30, gold: 10 }
      : { equity: 40, debt: 50, gold: 10 },
    goalPlans,
    milestones,
  };
};
