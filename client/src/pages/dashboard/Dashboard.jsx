import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../contexts/UserDataContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import StitchCard from '../../components/ui/StitchCard';
import StitchProgressRing from '../../components/ui/StitchProgressRing';
import { formatINR } from '../../utils/formatters';
import { Flame, HeartPulse, Receipt, Calendar, Users, PieChart, ArrowRight, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

const modules = [
  { id: 'fire', title: 'FIRE Path Planner', desc: 'Map your journey to financial independence early retirement.', icon: <Flame size={24} />, color: 'var(--accent-emerald)', path: '/fire' },
  { id: 'health', title: 'Money Health Score', desc: 'Find out your baseline health across 6 critical dimensions.', icon: <HeartPulse size={24} />, color: '#00E5A0', path: '/health' },
  { id: 'tax', title: 'Tax Wizard', desc: 'Upload Form-16 to instantly find hidden ₹ deductions.', icon: <Receipt size={24} />, color: 'var(--accent-gold)', path: '/tax' },
  { id: 'life', title: 'Life Events', desc: 'Just got married? Having a baby? Here\'s your 5-step plan.', icon: <Calendar size={24} />, color: '#B388FF', path: '/life-events' },
  { id: 'couples', title: 'Couples Planner', desc: 'Optimize SIPs, HRA, and insurance together.', icon: <Users size={24} />, color: '#FF80AB', path: '/couples' },
  { id: 'portfolio', title: 'Portfolio X-Ray', desc: 'Scan statement to uncover 50%+ fund overlaps.', icon: <PieChart size={24} />, color: '#82B1FF', path: '/portfolio' }
];

export default function Dashboard() {
  const { user } = useAuth();
  const { setHealthScoreData, setFirePlanData } = useUserData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState(null);
  const [fire, setFire] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [healthRes, fireRes] = await Promise.allSettled([
          api.get('/health/score'),
          api.get('/fire/plan')
        ]);
        
        let hs = null;
        if (healthRes.status === 'fulfilled' && healthRes.value.data.success) {
          hs = healthRes.value.data.data.healthScore;
          setHealth(hs);
          setHealthScoreData(hs);
        }
        
        let fp = null;
        if (fireRes.status === 'fulfilled' && fireRes.value.data.success) {
          fp = fireRes.value.data.data;
          setFire(fp);
          setFirePlanData(fp);
        }
      } catch (err) {
         console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [setHealthScoreData, setFirePlanData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentScore = health?.totalScore || 0;
  const netWorth = fire?.finance?.assets?.reduce((sum, a) => sum + (a.currentValue || 0), 0) || 0;
  let grade = 'D';
  if (currentScore >= 80) grade = 'A';
  else if (currentScore >= 60) grade = 'B';
  else if (currentScore >= 40) grade = 'C';

  return (
    <motion.div className="page-enter-active" variants={containerVariants} initial="hidden" animate="visible">
      
      {/* Header Row */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{getGreeting()}, {user?.name?.split(' ')[0]}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to your AI Financial Brain.</p>
        </div>

        <StitchCard style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'radial-gradient(circle at right, rgba(0, 229, 160, 0.08), transparent 70%)', border: '1px solid rgba(0,229,160,0.1)' }}>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Estimated Net Worth</div>
            {loading ? (
              <div style={{ width: '150px', height: '40px', background: 'var(--bg-card-hover)', borderRadius: '8px', animation: 'pulse 2s infinite' }} />
            ) : (
              <div className="mono" style={{ fontSize: '36px', fontWeight: 'bold' }}>
                {netWorth > 0 ? formatINR(netWorth) : '₹0'}
              </div>
            )}
          </div>
        </StitchCard>

        <StitchCard style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
             {loading ? (
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--bg-card-hover)', animation: 'pulse 2s infinite' }} />
             ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <StitchProgressRing 
                    score={currentScore} 
                    maxScore={100} 
                    size={120} 
                    strokeWidth={10} 
                    label="SCORE"
                    color={currentScore >= 60 ? 'var(--accent-emerald)' : currentScore >= 40 ? 'var(--accent-gold)' : 'var(--accent-red)'}
                  />
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Health Grade</div>
                    <div style={{ fontSize: '48px', fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1, color: currentScore >= 60 ? 'var(--accent-emerald)' : currentScore >= 40 ? 'var(--accent-gold)' : 'var(--accent-red)' }}>
                      {currentScore > 0 ? grade : '?'}
                    </div>
                  </div>
                </div>
             )}
        </StitchCard>
      </motion.div>

      {/* Modules Grid */}
      <h2 style={{ fontSize: '20px', marginBottom: '20px', color: 'var(--text-secondary)' }}>Modules</h2>
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {modules.map(mod => (
          <StitchCard 
            key={mod.id} 
            className="module-card"
            style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
            onClick={() => navigate(mod.path)}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: `radial-gradient(circle at top right, ${mod.color}33, transparent)`, pointerEvents: 'none' }} />
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mod.color, marginBottom: '24px' }}>
              {mod.icon}
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{mod.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5 }}>
              {mod.desc}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: mod.color, fontWeight: 600, fontSize: '14px' }} className="cta-link">
              Start <ArrowRight size={16} />
            </div>
          </StitchCard>
        ))}
      </motion.div>

      {/* AI Insights & Stats */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'revert', gridAutoFlow: 'row', gap: '24px', gridAutoRows: 'auto', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Quick Stats */}
        <StitchCard>
          <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Quick Stats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Monthly Surplus', value: fire?.finance?.monthlyIncome ? formatINR(fire.finance.monthlyIncome - (fire.finance.monthlyExpenses || 0)) : '₹0' },
              { label: 'Total Invested', value: fire?.finance?.assets ? formatINR(fire.finance.assets.reduce((sum,a) => sum + (a.investedAmount||0), 0)) : '₹0' },
              { label: 'Emergency Fund', value: fire?.finance?.emergencyFund ? formatINR(fire.finance.emergencyFund) : '₹0' },
              { label: 'Tax Deductions Used', value: 'Evaluate in Tax Wizard', noMono: true }
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
                <span className={stat.noMono ? '' : 'mono'} style={{ fontWeight: 600, color: stat.noMono ? 'var(--accent-gold)' : 'var(--text-primary)' }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </StitchCard>

        {/* AI Insights */}
        <StitchCard style={{ background: 'rgba(0, 229, 160, 0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <BrainCircuit color="var(--accent-emerald)" size={24} />
            <h3 style={{ fontSize: '18px' }}>Recent AI Insights</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {health?.aiInsights?.slice(0, 3).map((insight, i) => (
              <div key={i} style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', fontSize: '14px', lineHeight: 1.6, borderLeft: '3px solid var(--accent-emerald)' }}>
                {insight}
              </div>
            )) || (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>
                Complete your Money Health check to get personalized AI insights.
              </div>
            )}
          </div>
        </StitchCard>
      </motion.div>

      <style>{`
        .module-card:hover {
          transform: translateY(-4px);
        }
        .module-card .cta-link svg {
          transition: transform 0.2s;
        }
        .module-card:hover .cta-link svg {
          transform: translateX(4px);
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.2; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </motion.div>
  );
}
