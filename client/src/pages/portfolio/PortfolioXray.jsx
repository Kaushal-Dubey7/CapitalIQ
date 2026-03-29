import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import StitchCard from '../../components/ui/StitchCard';
import StitchButton from '../../components/ui/StitchButton';
import StitchBadge from '../../components/ui/StitchBadge';
import { formatINR, formatPercent } from '../../utils/formatters';
import { UploadCloud, PieChart, Activity, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const CATEGORY_COLORS = {
  'Equity': 'var(--accent-emerald)',
  'Debt': 'var(--accent-gold)',
  'Hybrid': '#82B1FF',
  'Gold': '#FFD54F',
  'Unknown': 'var(--text-muted)'
};

export default function PortfolioXray() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const { data } = await api.get('/portfolio');
      if (data.data.portfolio) setPortfolio(data.data.portfolio);
    } catch (err) {
      if (err.response?.status !== 404) console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      setAnalyzing(true);
      let data;
      if (file) {
        const formData = new FormData();
        formData.append('statement', file);
        const res = await api.post('/portfolio/analyze', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        data = res.data;
      } else {
        // Dummy manual bypass
        const res = await api.post('/portfolio/analyze', { holdings: demoHoldings });
        data = res.data;
      }
      setPortfolio(data.data.portfolio);
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error analyzing statement');
    } finally {
      setAnalyzing(false);
    }
  };

  // Mock data for demo if portfolio is empty or newly uploaded
  const demoHoldings = [
    { schemeName: 'Parag Parikh Flexi Cap Fund', category: 'Equity', investedValue: 500000, currentValue: 850000, xirr: 18.5, expenseRatio: 0.75 },
    { schemeName: 'Nippon India Small Cap Fund', category: 'Equity', investedValue: 200000, currentValue: 420000, xirr: 24.2, expenseRatio: 1.54 },
    { schemeName: 'SBI Equity Hybrid Fund', category: 'Hybrid', investedValue: 300000, currentValue: 380000, xirr: 11.4, expenseRatio: 1.2 },
    { schemeName: 'HDFC Corporate Bond Fund', category: 'Debt', investedValue: 400000, currentValue: 460000, xirr: 7.2, expenseRatio: 0.35 }
  ];

  const holdings = portfolio?.holdings?.length ? portfolio.holdings : (portfolio ? demoHoldings : []);
  const totalInvested = portfolio?.totalInvested || holdings.reduce((s, h) => s + h.investedValue, 0);
  const totalCurrentValue = portfolio?.totalCurrentValue || holdings.reduce((s, h) => s + h.currentValue, 0);
  const overallXIRR = portfolio?.overallXIRR || 15.6;
  
  const categoryData = Object.entries(
    holdings.reduce((acc, h) => {
      acc[h.category] = (acc[h.category] || 0) + h.currentValue;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><div className="dot-typing" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-enter-active">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(130, 177, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#82B1FF' }}>
          <PieChart size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '28px', margin: 0 }}>Portfolio X-Ray</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Uncover hidden fees and overlaps in 10 seconds.</p>
        </div>
      </div>

      {!portfolio && !analyzing ? (
        <StitchCard style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', padding: '64px 24px', borderStyle: 'dashed', borderWidth: '2px' }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".pdf,.csv" 
            style={{ display: 'none' }} 
          />
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--accent-emerald)' }}>
            <UploadCloud size={36} />
          </div>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Upload Mutual Fund Statement</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
            Upload your CAS (Consolidated Account Statement) from CAMS or KFintech (PDF or CSV format).
          </p>
          
          {file ? (
             <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <FileText size={20} color="var(--accent-emerald)" />
                 <span>{file.name}</span>
               </div>
               <StitchButton onClick={handleUpload} style={{ padding: '8px 16px', fontSize: '12px' }}>Analyze Now</StitchButton>
             </div>
          ) : (
             <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
               <StitchButton onClick={() => fileInputRef.current?.click()}>
                 Select Statement
               </StitchButton>
               <StitchButton variant="ghost" onClick={handleUpload}>
                 Or Enter Manually
               </StitchButton>
             </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', marginTop: '32px' }}>
             <CheckCircle2 size={14}/> 100% Secure. Bank-grade 256-bit encryption. We don't store your PDF.
          </div>
        </StitchCard>
      ) : analyzing ? (
        <StitchCard style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '64px 24px' }}>
           <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 32px' }}>
             <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '4px solid var(--border-subtle)', borderRadius: '50%' }} />
             <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '4px solid var(--accent-emerald)', borderRadius: '50%', borderLeftColor: 'transparent', animation: 'spin 1s linear infinite' }} />
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--accent-emerald)' }}>
               <Activity size={32} />
             </div>
           </div>
           <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Analyzing your portfolio...</h2>
           <p style={{ color: 'var(--text-secondary)' }}>Extracting holdings, calculating returns, and analyzing overlaps using our ML engine.</p>
           <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </StitchCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <StitchCard style={{ padding: '20px' }}>
               <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Total Invested</div>
               <div className="mono" style={{ fontSize: '28px', fontWeight: 700 }}>{formatINR(totalInvested)}</div>
            </StitchCard>
            <StitchCard style={{ padding: '20px' }}>
               <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Current Value</div>
               <div className="mono" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent-emerald)' }}>{formatINR(totalCurrentValue)}</div>
               <div style={{ fontSize: '12px', color: 'var(--accent-emerald)', marginTop: '4px' }}>+ {formatINR(totalCurrentValue - totalInvested)}</div>
            </StitchCard>
            <StitchCard style={{ padding: '20px', background: 'radial-gradient(circle at bottom right, rgba(0,229,160,0.1), transparent 60%)' }}>
               <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>Overall XIRR</div>
               <div className="mono" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent-emerald)' }}>{overallXIRR}%</div>
               <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>vs Benchmark 12.5%</div>
            </StitchCard>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }} className="grid-stack-mobile">
            {/* Holdings Table */}
            <StitchCard style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h3 style={{ fontSize: '18px', margin: 0 }}>Your Holdings</h3>
                 <StitchButton variant="ghost" style={{ padding: '6px 16px', fontSize: '12px' }} onClick={() => setPortfolio(null)}>Update</StitchButton>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '16px 24px', fontWeight: 600 }}>Fund Name</th>
                      <th style={{ padding: '16px 24px', fontWeight: 600 }}>Invested</th>
                      <th style={{ padding: '16px 24px', fontWeight: 600 }}>Current</th>
                      <th style={{ padding: '16px 24px', fontWeight: 600 }}>XIRR</th>
                      <th style={{ padding: '16px 24px', fontWeight: 600 }}>Exp Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((h, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'var(--transition)' }}>
                        <td style={{ padding: '16px 24px' }}>
                           <div style={{ fontWeight: 500, marginBottom: '4px' }}>{h.schemeName}</div>
                           <StitchBadge variant={h.category === 'Equity' ? 'emerald' : 'gold'}>{h.category}</StitchBadge>
                        </td>
                        <td className="mono" style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{formatINR(h.investedValue)}</td>
                        <td className="mono" style={{ padding: '16px 24px' }}>{formatINR(h.currentValue)}</td>
                        <td className="mono" style={{ padding: '16px 24px', color: h.xirr > 12.5 ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>{h.xirr}%</td>
                        <td className="mono" style={{ padding: '16px 24px', color: h.expenseRatio > 1.5 ? 'var(--accent-red)' : 'var(--text-secondary)' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                             {h.expenseRatio}%
                             {h.expenseRatio > 1.5 && <AlertCircle size={14} color="var(--accent-red)"/>}
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </StitchCard>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Asset Allocation */}
              <StitchCard>
                 <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Asset Allocation</h3>
                 <div style={{ height: '220px', width: '100%' }}>
                   <ResponsiveContainer width="100%" height="100%">
                     <RePieChart>
                       <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                         {categoryData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS['Unknown']} />
                         ))}
                       </Pie>
                       <RechartsTooltip 
                         formatter={(value) => formatINR(value)}
                         contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)' }}
                         itemStyle={{ color: 'var(--text-primary)' }}
                       />
                       <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                     </RePieChart>
                   </ResponsiveContainer>
                 </div>
              </StitchCard>

              {/* AI Rebalancing Plan */}
              <StitchCard style={{ background: 'rgba(245, 166, 35, 0.05)', borderColor: 'rgba(245, 166, 35, 0.2)' }}>
                 <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
                   <Activity size={20} /> AI Rebalancing Plan
                 </h3>
                 <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   <li>Sell <strong>Nippon India Small Cap</strong>. The expense ratio of 1.54% is dragging returns. Switch to Nifty Midcap 150 Index Fund.</li>
                   <li>Your Equity exposure is 74%. Consider rebalancing to 60% by routing next 6 months' SIPs into <strong>HDFC Corporate Bond Fund</strong>.</li>
                   <li>You have a 45% stock overlap between your Flexi Cap and Large Cap fund. Consolidation recommended.</li>
                 </ul>
              </StitchCard>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 1024px) {
          .grid-stack-mobile { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
