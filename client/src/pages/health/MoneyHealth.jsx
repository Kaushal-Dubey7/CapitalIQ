import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import StitchCard from '../../components/ui/StitchCard';
import StitchButton from '../../components/ui/StitchButton';
import StitchInput from '../../components/ui/StitchInput';
import StitchProgressRing from '../../components/ui/StitchProgressRing';
import { HeartPulse, CheckCircle2, ChevronRight, Activity, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  { id: 'emergencyMonths', label: 'How many months of expenses do you have saved in highly liquid assets (savings account, liquid funds)?', type: 'number', placeholder: 'e.g. 6' },
  { id: 'debtRatio', label: 'What percentage of your monthly income goes towards EMIs/Debt? (%)', type: 'number', placeholder: 'e.g. 30' },
  { id: 'savingsRate', label: 'What percentage of your monthly income do you save/invest? (%)', type: 'number', placeholder: 'e.g. 20' },
  { id: 'insuranceCoverage', label: 'How many times your annual income is your term life insurance coverage?', type: 'number', placeholder: 'e.g. 10' },
  { id: 'healthInsurance', label: 'Do you have comprehensive health insurance separate from your employer? (50 for No, 100 for Yes)', type: 'number', placeholder: 'e.g. 100' },
  { id: 'diversification', label: 'How diversified is your portfolio? (Score 0-100)', type: 'number', placeholder: 'e.g. 75' }
];

export default function MoneyHealth() {
  const [step, setStep] = useState(0); // 0 = intro, 1-6 = questions, 7 = results
  const [answers, setAnswers] = useState({});
  const [computing, setComputing] = useState(false);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if score already exists
    api.get('/health/score').then(res => {
      if (res.data.data.healthScore) {
        setResults(res.data.data.healthScore);
        setStep(7);
      }
    }).catch(err => {
      if (err.response?.status !== 404) console.error(err);
    });
  }, []);

  const handleNext = () => {
    if (step < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      submitHealthScore();
    }
  };

  const submitHealthScore = async () => {
    try {
      setComputing(true);
      setStep(7);
      const payload = {
         emergencyMonths: Number(answers.emergencyMonths) || 0,
         debtRatio: Number(answers.debtRatio) || 0,
         savingsRate: Number(answers.savingsRate) || 0,
         insuranceCoverage: Number(answers.insuranceCoverage) || 0,
         healthInsurance: Number(answers.healthInsurance) || 0,
         diversification: Number(answers.diversification) || 0
      };
      
      const { data } = await api.post('/health/compute', payload);
      setResults(data.data.healthScore);
    } catch (err) {
      alert(err.response?.data?.message || 'Error computing score');
      setStep(1);
    } finally {
      setComputing(false);
    }
  };

  const renderIntro = () => (
    <StitchCard style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '64px 24px' }}>
      <HeartPulse size={48} color="var(--accent-emerald)" style={{ margin: '0 auto 24px' }} />
      <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Money Health Check</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '18px', lineHeight: 1.6 }}>
        Your financial health is more than just net worth. We measure 6 critical dimensions to give you a holistic score out of 100.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'left', marginBottom: '40px', maxWidth: '400px', margin: '0 auto 40px' }}>
        {['Emergency Fund', 'Debt Load', 'Savings Rate', 'Life Insurance', 'Health Cover', 'Asset Mix'].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={16} color="var(--accent-emerald)" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <StitchButton onClick={() => setStep(1)} style={{ padding: '16px 40px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
        Start Assessment <ChevronRight size={20} />
      </StitchButton>
    </StitchCard>
  );

  const renderQuestion = () => {
    const qIndex = step - 1;
    const currentQ = QUESTIONS[qIndex];
    if (!currentQ) return null;

    return (
      <StitchCard style={{ maxWidth: '600px', margin: '0 auto', padding: '48px' }}>
        <div style={{ color: 'var(--accent-emerald)', fontWeight: 600, marginBottom: '24px', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' }}>
          Dimension {step} of 6
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 style={{ fontSize: '24px', marginBottom: '32px', lineHeight: 1.4 }}>
              {currentQ.label}
            </h2>
            <StitchInput 
              type={currentQ.type}
              placeholder={currentQ.placeholder}
              value={answers[currentQ.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
              onKeyDown={(e) => { if(e.key === 'Enter' && answers[currentQ.id]) handleNext(); }}
              autoFocus
              style={{ fontSize: '20px', padding: '16px 24px', height: '60px' }}
            />
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '48px' }}>
          <StitchButton variant="ghost" onClick={() => setStep(step - 1)}>Back</StitchButton>
          <StitchButton 
            onClick={handleNext} 
            disabled={!answers[currentQ.id] && answers[currentQ.id] !== 0}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {step === 6 ? 'Analyze Score' : 'Continue'} <ChevronRight size={16} />
          </StitchButton>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '4px', background: 'var(--bg-surface)', borderRadius: '4px', marginTop: '48px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--accent-emerald)', width: `${(step / 6) * 100}%`, transition: 'width 0.3s' }} />
        </div>
      </StitchCard>
    );
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
           <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Computing Your Score...</h2>
           <p style={{ color: 'var(--text-secondary)' }}>Comparing against 10M+ Indian financial profiles.</p>
           <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </StitchCard>
      );
    }

    const { totalScore, scoreBreakdown, aiInsights } = results;

    let grade = 'D';
    if (totalScore >= 80) grade = 'A';
    else if (totalScore >= 60) grade = 'B';
    else if (totalScore >= 40) grade = 'C';

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Main Score Area */}
        <StitchCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Your Money Health Score</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Grade: {grade} - Needs Improvement</p>
          
          <StitchProgressRing 
            score={totalScore} 
            maxScore={100} 
            size={240} 
            strokeWidth={16} 
            label="OUT OF 100"
            color={totalScore >= 60 ? 'var(--accent-emerald)' : totalScore >= 40 ? 'var(--accent-gold)' : 'var(--accent-red)'}
          />

          <StitchButton variant="ghost" onClick={() => { setStep(1); setAnswers({}); setResults(null); }} style={{ marginTop: '48px' }}>
            Retake Assessment
          </StitchButton>
        </StitchCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Diagnostic Breakdown */}
          <StitchCard>
            <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Diagnostic Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Emergency Readiness', s: scoreBreakdown.emergencyFund },
                { label: 'Debt Control', s: scoreBreakdown.debtManagement },
                { label: 'Savings & Cash Flow', s: scoreBreakdown.savingsRate },
                { label: 'Life Cover Risk', s: scoreBreakdown.lifeInsurance },
                { label: 'Medical Risk', s: scoreBreakdown.healthInsurance },
                { label: 'Asset Diversification', s: scoreBreakdown.diversification }
              ].map((dim, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{dim.label}</span>
                    <span style={{ fontWeight: 600, color: dim.s >= 16 ? 'var(--accent-emerald)' : dim.s >= 10 ? 'var(--accent-gold)' : 'var(--accent-red)' }}>
                      {Math.round(dim.s * (100/16.6))}% // converting 16.6 to 100 scale for UI
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-surface)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '3px', width: `${dim.s * (100/16.6)}%`, background: dim.s >= 16 ? 'var(--accent-emerald)' : dim.s >= 10 ? 'var(--accent-gold)' : 'var(--accent-red)' }} />
                  </div>
                </div>
              ))}
            </div>
          </StitchCard>

          {/* AI Doctor Notes */}
          <StitchCard style={{ background: 'rgba(0, 229, 160, 0.03)', border: '1px solid rgba(0, 229, 160, 0.15)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
               <Brain color="var(--accent-emerald)" size={24} />
               <h3 style={{ fontSize: '18px', color: 'var(--accent-emerald)' }}>AI Rx (Prescription)</h3>
             </div>
             
             <ul style={{ paddingLeft: '20px', fontSize: '15px', lineHeight: 1.6, color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
               {aiInsights?.map((insight, i) => (
                 <li key={i}>{insight}</li>
               )) || <li>Complete your profile to get personalized AI prescriptions.</li>}
             </ul>
          </StitchCard>

        </div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-enter-active">
      {step === 0 && renderIntro()}
      {step > 0 && step <= 6 && renderQuestion()}
      {step === 7 && renderResults()}
    </motion.div>
  );
}
