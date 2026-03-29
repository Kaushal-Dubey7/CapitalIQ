const SYSTEM_PROMPT = `You are CapitalIQ, an expert AI personal finance mentor for India. You provide accurate, actionable, personalized financial advice. Always cite specific Indian tax sections, SEBI guidelines, or regulatory frameworks when relevant. Format responses with clear sections. Use Indian terminology (₹, lakhs, crores, SIP, EMI, PPF etc.). Always add a disclaimer: "This is educational guidance, not SEBI-registered investment advice." Be concise, warm, and empowering.`;

const callAI = async (userMessage, systemOverride = null) => {
  // Try to use Anthropic SDK if available
  try {
    if (!process.env.AI_API_KEY || process.env.AI_API_KEY === 'your_anthropic_api_key_here') {
      throw new Error('Dummy API Key detected');
    }
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: process.env.AI_API_KEY });
    const response = await client.messages.create({
      model: process.env.AI_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemOverride || SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });
    return response.content[0].text;
  } catch (err) {
    // Fallback: return structured mock response for demo
    console.log('AI Service fallback (no API key or SDK error):', err.message);
    return generateFallbackResponse(userMessage);
  }
};

const generateFallbackResponse = (prompt) => {
  return `## CapitalIQ AI Analysis

Based on your financial data, here are my recommendations:

### Key Insights
1. **Prioritize Emergency Fund** — Aim for 6 months of expenses in a liquid fund (e.g., Parag Parikh Liquid Fund or simply a bank FD).
2. **Maximize Tax Savings** — Ensure full utilization of Section 80C (₹1.5L), 80CCD(1B) for NPS (₹50K additional), and Section 80D for health insurance.
3. **SIP Strategy** — Start with index funds (Nifty 50 + Nifty Next 50) for long-term wealth creation. A monthly SIP of even ₹5,000 can grow to ₹1.1 Cr in 25 years at 12% CAGR.
4. **Insurance Check** — Term insurance should be 10-15x annual income. Health insurance cover of ₹10-20L is recommended.
5. **Debt Management** — Keep EMI-to-income ratio below 40%. Prioritize clearing high-interest debt (credit cards > personal loans > car loans).

### Action Items
- [ ] Set up auto-debit SIP on 1st of every month
- [ ] Review and increase SIP by 10% annually (step-up SIP)
- [ ] File ITR before July 31 to claim all deductions

> ⚠️ *This is educational guidance, not SEBI-registered investment advice.*`;
};

exports.generateFireNarrative = async ({ projections, age, retirementAge, monthlyIncome }) => {
  const prompt = `Generate a friendly, motivating FIRE plan summary for a ${age}-year-old Indian with ₹${monthlyIncome}/month income targeting retirement at ${retirementAge}. Key projections: ${JSON.stringify(projections)}. Give 3 specific action steps, monthly SIP recommendations, and timeline milestones.`;
  return await callAI(prompt);
};

exports.generateHealthInsights = async (scores, inputData) => {
  const prompt = `Analyze this Indian user's Money Health Score: ${JSON.stringify(scores)}. Input data: ${JSON.stringify(inputData)}. Give 5 specific, prioritized recommendations with ₹ amounts where possible. Identify the 2 most critical gaps.`;
  const text = await callAI(prompt);
  return text.split('\n').filter(l => l.trim()).slice(0, 8);
};

exports.generateTaxSuggestions = async (analysis) => {
  const prompt = `Indian tax analysis: ${JSON.stringify(analysis)}. Identify specific missed deductions under 80C, 80D, 80CCD, 24(b), HRA. Recommend the optimal regime (old vs new) with exact ₹ savings. List top 5 tax-saving investments ranked by liquidity and risk.`;
  const text = await callAI(prompt);
  return text.split('\n').filter(l => l.trim()).slice(0, 10);
};

exports.generateRebalancingPlan = async (analysis) => {
  const prompt = `Mutual fund portfolio analysis: ${JSON.stringify(analysis)}. Provide a rebalancing plan with specific sell/buy recommendations. Flag high expense ratios (>1.5%). Identify sector overlaps >50%. Suggest index fund alternatives where active funds underperform.`;
  return await callAI(prompt);
};

exports.analyzeLifeEvent = async ({ eventType, eventDetails, finance, user }) => {
  const prompt = `Life event: ${eventType}. Details: ${JSON.stringify(eventDetails)}. User finance: ${JSON.stringify(finance)}. Provide a specific 5-step financial action plan optimized for Indian tax laws, risk management, and goal alignment. Include ₹ amounts.`;
  return await callAI(prompt);
};

exports.generateCouplesPlan = async ({ partner1Finance, partner2Finance, sharedGoals }) => {
  const prompt = `Indian couple's financial planning. Partner 1: ${JSON.stringify(partner1Finance)}. Partner 2: ${JSON.stringify(partner2Finance)}. Shared goals: ${JSON.stringify(sharedGoals)}. Optimize HRA claims, NPS contributions, SIP splits, and joint vs individual insurance. Provide combined net worth strategy.`;
  return await callAI(prompt);
};

exports.chat = async (message, history, userContext) => {
  const contextPrompt = `User context: ${JSON.stringify(userContext)}\nUser asks: ${message}`;
  try {
    if (!process.env.AI_API_KEY || process.env.AI_API_KEY === 'your_anthropic_api_key_here') {
      throw new Error('Dummy API Key detected');
    }
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: process.env.AI_API_KEY });
    const messages = [
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: contextPrompt }
    ];
    const response = await client.messages.create({
      model: process.env.AI_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    });
    return response.content[0].text;
  } catch (err) {
    return generateFallbackResponse(message);
  }
};
