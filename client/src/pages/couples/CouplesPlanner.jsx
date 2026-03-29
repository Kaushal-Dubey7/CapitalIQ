import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import StitchCard from '../../components/ui/StitchCard';
import StitchButton from '../../components/ui/StitchButton';
import StitchInput from '../../components/ui/StitchInput';
import StitchBadge from '../../components/ui/StitchBadge';
import { formatINR } from '../../utils/formatters';
import { Users, Mail, Link as LinkIcon, Lock, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CouplesPlanner() {
  const { user } = useAuth();
  const [link, setLink] = useState(null);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/couples/plan');
      setLink(data.data.link);
    } catch (err) {
      if (err.response?.status !== 404) console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async (e) => {
    e.preventDefault();
    if (!partnerEmail) return;
    try {
      setLinking(true);
      const { data } = await api.post('/couples/link', { partnerEmail });
      setLink(data.data.link);
      setPartnerEmail('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error linking partner');
    } finally {
      setLinking(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const { data } = await api.post('/couples/plan');
      setLink(data.data.link);
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating plan');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><div className="dot-typing" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-enter-active">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 128, 171, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF80AB' }}>
          <Users size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '28px', margin: 0 }}>Couples Planner</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Optimize finances together.</p>
        </div>
      </div>

      {!link || link.status === 'pending' ? (
        <StitchCard style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
             <div style={{ position: 'relative', width: '120px', height: '60px' }}>
               <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-surface)', border: '2px solid var(--border-subtle)', position: 'absolute', left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', zIndex: 2 }}>{user?.name?.charAt(0)}</div>
               <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-surface)', border: '2px dashed var(--accent-emerald)', position: 'absolute', right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', zIndex: 1 }}><Mail size={24} /></div>
             </div>
          </div>
          
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Invite Your Partner</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Link your accounts securely to see your combined net worth, optimize joint tax savings, and plan shared goals.
          </p>
          
          <form style={{ display: 'flex', gap: '12px' }} onSubmit={handleLink}>
             <StitchInput 
               type="email" 
               placeholder="partner@example.com" 
               value={partnerEmail} 
               onChange={(e) => setPartnerEmail(e.target.value)}
               style={{ flex: 1, margin: 0 }}
               required
             />
             <StitchButton type="submit" disabled={linking} style={{ padding: '0 24px' }}>
               {linking ? 'Linking...' : 'Send Invite'}
             </StitchButton>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', marginTop: '32px' }}>
             <Lock size={14}/> Your individual data remains private until both approve.
          </div>
        </StitchCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           {/* Connected Header */}
           <StitchCard style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'radial-gradient(circle at right, rgba(255,128,171,0.05), transparent 60%)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ display: 'flex', alignItems: 'center' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-surface)', border: '2px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', zIndex: 2 }}>{user?.name?.charAt(0)}</div>
                 <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-emerald-dim)', border: '2px solid var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', fontSize: '16px', zIndex: 1, marginLeft: '-12px' }}>P</div>
               </div>
               <div>
                 <div style={{ fontWeight: 600, fontSize: '18px' }}>Partner Link Active</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <StitchBadge variant="emerald">Connected</StitchBadge>
                   <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}><LinkIcon size={12}/> Secure TLS 1.3</span>
                 </div>
               </div>
             </div>
             
             <div style={{ textAlign: 'right' }}>
               <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Combined Net Worth</div>
               <div className="mono" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
                 {link?.combinedNetWorth ? formatINR(link.combinedNetWorth) : 'Generate Plan to view'}
               </div>
             </div>
           </StitchCard>

           {!link.optimizationPlan ? (
             <StitchCard style={{ textAlign: 'center', padding: '64px 24px' }}>
               <Sparkles size={48} color="var(--accent-gold)" style={{ marginBottom: '24px', opacity: 0.8 }} />
               <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Ready to optimize your finances?</h2>
               <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                 CapitalIQ will analyze both profiles to recommend the best way to split rent for maximum HRA, divide SIPs, and optimize joint insurance coverage.
               </p>
               <StitchButton onClick={handleGenerate} disabled={generating} style={{ height: '48px', padding: '0 32px' }}>
                 {generating ? <div className="dot-typing" /> : 'Run Joint Analysis'}
               </StitchButton>
             </StitchCard>
           ) : (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
               <StitchCard>
                 <h3 style={{ fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <TrendingUp color="var(--accent-emerald)"/> Optimization Strategy
                 </h3>
                 <div className="markdown" style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                   {link.optimizationPlan}
                 </div>
               </StitchCard>
               {/* Note: the optimizationPlan from backend is just a raw string generated by AI in dummy mode */}
             </div>
           )}
        </div>
      )}
    </motion.div>
  );
}
