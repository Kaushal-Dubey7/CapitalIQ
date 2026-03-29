export const formatINR = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

export const formatPercent = (dec) => {
  if (dec === undefined || dec === null) return '0%';
  return `${(dec * 100).toFixed(1)}%`;
};
