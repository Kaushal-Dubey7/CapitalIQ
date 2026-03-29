const axios = require('axios');

async function test() {
  const api = axios.create({ baseURL: 'http://localhost:5000/api/v1' });

  // 1. Register a test user
  let token;
  try {
    const reg = await api.post('/auth/register', {
      name: 'Testy', email: 'testy3@example.com', password: 'password123', phone: '123'
    });
    token = reg.data.data.token;
    console.log('Registered token:', token);
  } catch(e) {
    if (e.response && e.response.status === 409) {
      console.log('User exists, logging in...');
      const log = await api.post('/auth/login', { email: 'testy3@example.com', password: 'password123' });
      token = log.data.data.token;
    } else {
      console.error('Auth error:', e.response ? e.response.data : e.message);
      return;
    }
  }

  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // 2. Test Life Events
  try {
    const res = await api.post('/lifeevents/analyze', { eventType: 'child', eventDetails: 'Baby' });
    console.log('Life events OK:', !!res.data.data.advice);
  } catch(e) {
    console.error('Life events FAIL:', e.response ? e.response.data : e.message);
  }

  // 3. Test Health Score
  try {
    const res = await api.post('/health/compute', {
      emergencyMonths: 6, debtRatio: 30, savingsRate: 20, insuranceCoverage: 10, healthInsurance: 100, diversification: 75
    });
    console.log('Health OK:', !!res.data.data.healthScore);
  } catch(e) {
    console.error('Health FAIL:', e.response ? e.response.data : e.message);
  }

  // 4. Test Tax Wizard
  try {
     const res = await api.post('/tax/analyze', {
        salary: 1000000, 
        deductions80C: 150000,
        deductions80D: 25000,
        deductionsHRA: 100000,
        otherDeductions: 0
     });
     console.log('Tax OK:', !!res.data.data.record);
  } catch(e) {
     console.error('Tax FAIL:', e.response ? e.response.data : e.message);
  }
}

test();
