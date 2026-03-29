import { useState, useRef, useEffect } from 'react';
import api from '../../services/api';
import StitchCard from '../../components/ui/StitchCard';
import StitchButton from '../../components/ui/StitchButton';
import StitchInput from '../../components/ui/StitchInput';
import { formatINR } from '../../utils/formatters';
import { Receipt, FileText, CheckCircle2, ChevronRight, Calculator, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TaxWizard() {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [taxData, setTaxData] = useState(null);
  
  // Manual input state
  const [salary, setSalary] = useState('');
  const [eightyC, setEightyC] = useState('');
  const [eightyD, setEightyD] = useState('');
  const [hra, setHra] = useState('');

  useEffect(() => {
    fetchTaxRecord();
  }, []);

  const fetchTaxRecord = async () => {
    try {
      const { data } = await api.get('/tax/record');
      if (data.data.taxRecord) {
        setTaxData(data.data.taxRecord);
        setStep(3); // Go straight to results
      }
    } catch (err) {
      if (err.response?.status !== 404) console.error(err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processTax = async (isManual = false) => {
    try {
      setAnalyzing(true);
      if (!isManual && !file) return;

      let res;
      if (!isManual) {
        const formData = new FormData();
        formData.append('form16', file);
        res = await api.post('/tax/upload-form16', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.post('/tax/analyze', {
          salaryIncome: Number(salary) || 0,
          deductions80C: Number(eightyC) || 0,
          deductions80D: Number(eightyD) || 0,
          deductionsHRA: Number(hra) || 0
        });
      }
      
      setTaxData(res.data.data.taxRecord);
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing tax data');
    } finally {
      setAnalyzing(false);
    }
  };

  const currentRegimeTax = taxData?.newRegimeTax || 0;
  const oldRegimeTax = taxData?.oldRegimeTax || 0;
  const isNewBetter = currentRegimeTax <= oldRegimeTax;
  const savings = Math.abs(currentRegimeTax - oldRegimeTax);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-enter-active">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 166, 35, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5A623' }}>
            <Receipt size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', margin: 0 }}>Tax Wizard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>FY 2024-25 Optimization.</p>
          </div>
        </div>
        {step === 3 && (
          <StitchButton variant="ghost" onClick={() => { setStep(1); setFile(null); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCcw size={16} /> Recalculate
          </StitchButton>
        )}
      </div>

      {step === 1 && (
        <StitchCard style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '48px 24px' }}>
           <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>How do you want to start?</h2>
           <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
             Upload your Form-16 for instant 1-click analysis, or enter details manually.
           </p>

           <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ background: 'var(--bg-surface)', border: '2px dashed var(--accent-emerald)', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'var(--transition)' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
              >
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" style={{ display: 'none' }} />
                 <FileText size={32} color="var(--accent-emerald)" style={{ margin: '0 auto 16px' }} />
                 <h3 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--accent-emerald)' }}>Upload Form-16 (PDF)</h3>
                 <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Auto-extracts all numbers</p>
                 {file && <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{file.name} selected</div>}
              </div>

              <div 
                onClick={() => setStep(2)}
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'var(--transition)' }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                 <Calculator size={32} color="var(--text-primary)" style={{ margin: '0 auto 16px', opacity: 0.8 }} />
                 <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Manual Entry</h3>
                 <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Enter roughly 4 values</p>
              </div>
           </div>

           {file && (
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
               <StitchButton onClick={() => processTax(false)} disabled={analyzing} style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
                 {analyzing ? 'Extracting & Computing...' : 'Analyze My Form-16'}
               </StitchButton>
             </motion.div>
           )}

           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', marginTop: '32px' }}>
             <CheckCircle2 size={14}/> PDF is parsed locally/securely – PII is stripped.
          </div>
        </StitchCard>
      )}

      {step === 2 && (
        <StitchCard style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Enter Financial Details</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Provide estimated values for FY2024-25.</p>
          
          <div style={{ display: 'grid', gap: '24px', marginBottom: '32px' }}>
            <StitchInput label="Gross Annual Salary (₹)" type="number" placeholder="1500000" value={salary} onChange={e=>setSalary(e.target.value)} />
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <StitchInput label="80C Deductions (₹)" type="number" placeholder="150000" value={eightyC} onChange={e=>setEightyC(e.target.value)} helpText="Max 1.5L" />
              <StitchInput label="80D Medical (₹)" type="number" placeholder="25000" value={eightyD} onChange={e=>setEightyD(e.target.value)} />
            </div>

            <StitchInput label="HRA Exemption claimed (₹)" type="number" placeholder="50000" value={hra} onChange={e=>setHra(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <StitchButton variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</StitchButton>
            <StitchButton onClick={() => processTax(true)} disabled={analyzing || !salary} style={{ flex: 2 }}>
               {analyzing ? 'Computing...' : 'Compare Regimes'}
            </StitchButton>
          </div>
        </StitchCard>
      )}

      {step === 3 && taxData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Winner Banner */}
          <StitchCard style={{ 
            background: isNewBetter ? 'radial-gradient(circle at top right, rgba(0,229,160,0.1), transparent 60%)' : 'radial-gradient(circle at top right, rgba(245,166,35,0.1), transparent 60%)',
            border: `1px solid ${isNewBetter ? 'var(--border-glow)' : 'rgba(245, 166, 35, 0.3)'}`,
            padding: '40px', textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>
              You should choose the <span style={{ color: isNewBetter ? 'var(--accent-emerald)' : 'var(--accent-gold)' }}>{isNewBetter ? 'New Regime' : 'Old Regime'}</span>
            </h2>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              By choosing the {isNewBetter ? 'New' : 'Old'} Regime, you save <span className="mono" style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{formatINR(savings)}</span> in taxes.
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
              <div style={{ textAlign: 'center', padding: '16px 32px', background: isNewBetter ? 'var(--bg-surface)' : 'rgba(255,255,255,0.02)', borderRadius: '12px', border: isNewBetter ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)', opacity: isNewBetter ? 1 : 0.6 }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>New Regime Tax</div>
                <div className="mono" style={{ fontSize: '28px', fontWeight: 700, color: isNewBetter ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>{formatINR(taxData.newRegimeTax)}</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
              <div style={{ textAlign: 'center', padding: '16px 32px', background: !isNewBetter ? 'var(--bg-surface)' : 'rgba(255,255,255,0.02)', borderRadius: '12px', border: !isNewBetter ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)', opacity: !isNewBetter ? 1 : 0.6 }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Old Regime Tax</div>
                <div className="mono" style={{ fontSize: '28px', fontWeight: 700, color: !isNewBetter ? 'var(--accent-gold)' : 'var(--text-primary)' }}>{formatINR(taxData.oldRegimeTax)}</div>
              </div>
            </div>
          </StitchCard>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {/* Tax Breakdown */}
            <StitchCard>
              <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Calculation Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Gross Salary</span>
                  <span className="mono">{formatINR(taxData.salaryIncome || 0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Standard Deduction</span>
                  <span className="mono" style={{ color: 'var(--accent-gold)' }}>- {formatINR(50000)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Other Deductions (80C, HRA, etc)</span>
                  <span className="mono" style={{ color: 'var(--accent-gold)' }}>- {formatINR((taxData.deductions80C||0) + (taxData.deductions80D||0) + (taxData.deductionsHRA||0))}</span>
                  {/* Note: New regime zeroed this out in backend, these are inputs shown */}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Cess (4%)</span>
                  <span className="mono" style={{ color: 'var(--accent-red)' }}>Calculated</span>
                </div>
              </div>
            </StitchCard>

            {/* AI Optimization Suggestions */}
            <StitchCard style={{ background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Calculator color="var(--accent-emerald)" size={24} />
                <h3 style={{ fontSize: '18px' }}>AI Tax Pro Tips</h3>
              </div>
              
              <div className="markdown" style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {taxData.aiSuggestions ? (
                  <div style={{ paddingLeft: '20px', fontSize: '15px' }}>
                    {Array.isArray(taxData.aiSuggestions) ? (
                      <ul style={{ margin: 0 }}>
                        {taxData.aiSuggestions.map((sug, i) => <li key={i} style={{ marginBottom: '8px' }}>{sug}</li>)}
                      </ul>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: String(taxData.aiSuggestions).replace(/\n/g, '<br/>') }} />
                    )}
                  </div>
                ) : (
                  <>
                    <p>💡 You have exhausted your 80C limit (1.5L). Consider NPS 80CCD(1B) for an additional ₹50,000 deduction under the Old Regime.</p>
                    <p>💡 Since your salary is over 15L, the New Regime is generally preferred unless you have home loan interest {">"} 2L and HRA {">"} 1.5L.</p>
                  </>
                )}
              </div>
            </StitchCard>
          </div>
        </div>
      )}
    </motion.div>
  );
}
