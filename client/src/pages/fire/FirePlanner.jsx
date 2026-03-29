import { useState, useEffect } from 'react';
import api from '../../services/api';
import StitchCard from '../../components/ui/StitchCard';
import StitchButton from '../../components/ui/StitchButton';
import StitchInput from '../../components/ui/StitchInput';
import { formatINR } from '../../utils/formatters';
import { Flame, CheckCircle2, ChevronRight, Activity, TrendingUp, Sparkles, Brain } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export default function FirePlanner() {
  const [step, setStep] = useState(0); 
  const [formData, setFormData] = useState({
    age: 30, retirementAge: 50, lifeExpectancy: 85,
    monthlyIncome: 100000, monthlyExpenses: 60000,
    currentSavings: 1000000, riskProfile: 'moderate',
    goals: [{ name: 'Child Education', amount: 2000000, yearsAway: 10 }]
  });
  const [computing, setComputing] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Check if plan exists
    api.get('/fire/plan').then(res => {
      // For now, if returning standard fields, we could hydrate form.
      // We will skip straight to the interactive form if no results exist.
    }).catch(console.error);
  }, []);

  const handleNext = () => setStep(step + 1);

  const submitFirePlan = async () => {
    try {
      setComputing(true);
      setStep(4);
      const { data } = await api.post('/fire/generate', formData);
      setResults(data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating FIRE plan');
      setStep(1);
    } finally {
      setComputing(false);
    }
  };

  const renderIntro = () => (
    <StitchCard style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '64px 24px' }}>
      <Flame size={48} color="var(--accent-emerald)" style={{ margin: '0 auto 24px' }} />
      <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>FIRE Path Planner</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '18px', lineHeight: 1.6 }}>
        Financial Independence, Retire Early. Map your journey to financial freedom with our AI-powered stochastic Monte Carlo simulations.
      </p>
      
      <StitchButton onClick={() => setStep(1)} style={{ padding: '16px 40px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
        Start Planning <ChevronRight size={20} />
      </StitchButton>
    </StitchCard>
  );

  const renderStep = () => {
    if (step === 1) return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
        <h2 style={{ fontSize: '24px', marginBottom: '32px' }}>The Basics</h2>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <StitchInput label="Current Age" type="number" value={formData.age} onChange={e=>setFormData({...formData, age: Number(e.target.value)})} />
            <StitchInput label="Target Retirement Age" type="number" value={formData.retirementAge} onChange={e=>setFormData({...formData, retirementAge: Number(e.target.value)})} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <StitchInput label="Monthly Income (₹)" type="number" value={formData.monthlyIncome} onChange={e=>setFormData({...formData, monthlyIncome: Number(e.target.value)})} />
            <StitchInput label="Monthly Expenses (₹)" type="number" value={formData.monthlyExpenses} onChange={e=>setFormData({...formData, monthlyExpenses: Number(e.target.value)})} />
          </div>
        </div>
      </motion.div>
    );

    if (step === 2) return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
        <h2 style={{ fontSize: '24px', marginBottom: '32px' }}>Current Assets & Risk</h2>
        <div style={{ display: 'grid', gap: '24px' }}>
          <StitchInput label="Current Total Savings & Investments (₹)" type="number" value={formData.currentSavings} onChange={e=>setFormData({...formData, currentSavings: Number(e.target.value)})} />
          
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Risk Profile</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['conservative', 'moderate', 'aggressive'].map(risk => (
                <div 
                  key={risk} 
                  onClick={() => setFormData({...formData, riskProfile: risk})}
                  style={{ 
                    flex: 1, padding: '16px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer',
                    border: formData.riskProfile === risk ? '2px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                    background: formData.riskProfile === risk ? 'var(--accent-emerald-dim)' : 'var(--bg-surface)',
                    textTransform: 'capitalize'
                  }}
                >
                  {risk}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );

    if (step === 3) return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Major Life Goals</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Upcoming massive expenses (Weddings, Housing downpayment, Education).</p>
        
        {formData.goals.map((g, i) => (
          <div key={i} style={{ display: 'grid', gap: '16px', padding: '16px', background: 'var(--bg-card-hover)', borderRadius: '12px', marginBottom: '16px' }}>
             <StitchInput label="Goal Name" value={g.name} onChange={e => { const ng = [...formData.goals]; ng[i].name = e.target.value; setFormData({...formData, goals: ng}); }} />
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
               <StitchInput label="Amount (₹ in today's value)" type="number" value={g.amount} onChange={e => { const ng = [...formData.goals]; ng[i].amount = Number(e.target.value); setFormData({...formData, goals: ng}); }} />
               <StitchInput label="Years Away" type="number" value={g.yearsAway} onChange={e => { const ng = [...formData.goals]; ng[i].yearsAway = Number(e.target.value); setFormData({...formData, goals: ng}); }} />
             </div>
             <StitchButton variant="ghost" onClick={() => { const ng = formData.goals.filter((_, idx) => idx !== i); setFormData({...formData, goals: ng}); }}>
                Remove Goal
             </StitchButton>
          </div>
        ))}

        <StitchButton variant="ghost" onClick={() => setFormData({...formData, goals: [...formData.goals, { name: 'New Goal', amount: 0, yearsAway: 5 }]})}>
           + Add Another Goal
        </StitchButton>
      </motion.div>
    );

    return null;
  };

  const renderResults = () => {
    if (computing || !results) {
      return (
        <StitchCard style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '64px 24px' }}>
           <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 32px' }}>
             <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '4px solid var(--border-subtle)', borderRadius: '50%' }} />
             <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '4px solid var(--accent-emerald)', borderRadius: '50%', borderLeftColor: 'transparent', animation: 'spin 1s linear infinite' }} />
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--accent-emerald)' }}>
               <Activity size={32} />
             </div>
           </div>
           <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Simulating 10,000 Scenarios...</h2>
           <p style={{ color: 'var(--text-secondary)' }}>Factoring inflation, market volatility, and your life goals to find your FIRE number.</p>
           <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </StitchCard>
      );
    }

    const { projections, aiNarrative } = results;
    const { 
      requiredCorpus: fireTargetAmount, 
      recommendedSIP: monthlySipRequired, 
      fireAchievable: isAchievable, 
      milestones: curve 
    } = projections || {};

    // Formatting chart data
    const chartData = (curve || []).map(c => ({
      age: c.year,
      Portfolio: c.corpus,
      Target: fireTargetAmount
    }));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <StitchCard style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px', background: isAchievable ? 'radial-gradient(circle at right, rgba(0,229,160,0.1), transparent 60%)' : 'radial-gradient(circle at right, rgba(245,166,35,0.1), transparent 60%)' }}>
          <div>
             <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Your FIRE Number</h2>
             <div style={{ color: 'var(--text-secondary)' }}>Based on 6% inflation, {formData.retirementAge} retirement age, {isAchievable ? 'and you are on track!' : 'but requires adjustment to achieve.'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="mono" style={{ fontSize: '48px', fontWeight: 800, color: isAchievable ? 'var(--accent-emerald)' : 'var(--accent-gold)' }}>
              {formatINR(fireTargetAmount)}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Required SIP: <span className="mono" style={{ color: 'white' }}>{formatINR(monthlySipRequired)}/mo</span></div>
          </div>
        </StitchCard>

        <StitchCard>
          <h3 style={{ fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp color="var(--accent-emerald)"/> Projected Corpus Growth
          </h3>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-emerald)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-emerald)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="age" stroke="var(--text-muted)" />
                <YAxis tickFormatter={(val) => `₹${(val/10000000).toFixed(1)}Cr`} stroke="var(--text-muted)" />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <Tooltip 
                  formatter={(value) => formatINR(value)}
                  labelFormatter={(lbl) => `Age: ${lbl}`}
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                />
                <ReferenceLine y={fireTargetAmount} label={{ position: 'top', value: 'FIRE Target', fill: 'var(--accent-gold)', fontSize: 12 }} stroke="var(--accent-gold)" strokeDasharray="3 3" />
                <ReferenceLine x={formData.retirementAge} label={{ position: 'insideTopLeft', value: 'Retirement', fill: 'var(--text-secondary)', fontSize: 12 }} stroke="var(--text-secondary)" />
                <Area type="monotone" dataKey="Portfolio" stroke="var(--accent-emerald)" strokeWidth={3} fillOpacity={1} fill="url(#colorCorpus)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </StitchCard>

        {aiNarrative && (
          <StitchCard style={{ background: 'var(--bg-surface)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
               <Brain color="var(--accent-emerald)" size={24} />
               <h3 style={{ fontSize: '18px', color: 'var(--accent-emerald)' }}>AI Action Plan</h3>
             </div>
             
             <div className="markdown" style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div dangerouslySetInnerHTML={{ __html: String(aiNarrative || '').replace(/\n/g, '<br/>') }} />
             </div>
          </StitchCard>
        )}

      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-enter-active">
      {step === 0 && renderIntro()}
      {step > 0 && step < 4 && (
        <StitchCard style={{ maxWidth: '600px', margin: '0 auto', padding: '48px' }}>
          <div style={{ color: 'var(--accent-emerald)', fontWeight: 600, marginBottom: '24px', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>
            Step {step} of 3
          </div>
          
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '48px' }}>
            <StitchButton variant="ghost" onClick={() => setStep(step - 1)}>Back</StitchButton>
            <StitchButton 
              onClick={step === 3 ? submitFirePlan : handleNext} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {step === 3 ? 'Generate Plan' : 'Continue'} <ChevronRight size={16} />
            </StitchButton>
          </div>

          <div style={{ height: '4px', background: 'var(--bg-surface)', borderRadius: '4px', marginTop: '48px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--accent-emerald)', width: `${(step / 3) * 100}%`, transition: 'width 0.3s' }} />
          </div>
        </StitchCard>
      )}
      {step === 4 && renderResults()}
    </motion.div>
  );
}
