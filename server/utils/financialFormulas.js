// Financial formulas for server-side calculations

const computeSIP = (targetAmount, years, annualReturn) => {
  const monthlyRate = annualReturn / 12 / 100;
  const months = years * 12;
  if (monthlyRate === 0) return targetAmount / months;
  return targetAmount * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
};

const computeFV = (monthlyInvestment, years, annualReturn) => {
  const monthlyRate = annualReturn / 12 / 100;
  const months = years * 12;
  if (monthlyRate === 0) return monthlyInvestment * months;
  return monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
};

const computeXIRR = (cashflows, dates, guess = 0.1) => {
  if (!cashflows || cashflows.length < 2) return 0;
  const dayMs = 86400000;
  const firstDate = new Date(dates[0]).getTime();

  const xnpv = (rate) => {
    return cashflows.reduce((sum, cf, i) => {
      const days = (new Date(dates[i]).getTime() - firstDate) / dayMs;
      return sum + cf / Math.pow(1 + rate, days / 365);
    }, 0);
  };

  let rate = guess;
  for (let i = 0; i < 100; i++) {
    const npv = xnpv(rate);
    const dRate = 0.0001;
    const npvDeriv = (xnpv(rate + dRate) - npv) / dRate;
    if (Math.abs(npvDeriv) < 1e-10) break;
    const newRate = rate - npv / npvDeriv;
    if (Math.abs(newRate - rate) < 1e-8) break;
    rate = newRate;
  }
  return Math.round(rate * 10000) / 100;
};

const computeEMI = (principal, annualRate, tenureMonths) => {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / tenureMonths;
  return principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
};

const formatINR = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

module.exports = { computeSIP, computeFV, computeXIRR, computeEMI, formatINR };
