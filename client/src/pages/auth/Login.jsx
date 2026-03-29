import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StitchCard from '../../components/ui/StitchCard';
import StitchInput from '../../components/ui/StitchInput';
import StitchButton from '../../components/ui/StitchButton';
import { Flame, Receipt, PieChart, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Left Panel */}
      <div style={{ flex: 1, padding: '48px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="hide-on-mobile">
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--accent-emerald)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-base)', fontWeight: 'bold', fontSize: '24px' }}>
              {"♦"}
            </div>
            <h1 style={{ fontSize: '32px', margin: 0 }}>CapitalIQ</h1>
          </div>
          <h2 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '16px', lineHeight: 1.1 }}>Your AI Financial Brain.</h2>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '48px', maxWidth: '400px' }}>
            Democratizing sophisticated financial planning for every Indian.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             {[
               { icon: <Flame color="var(--accent-emerald)" size={24}/>, text: 'AI FIRE Path Planner' },
               { icon: <Receipt color="var(--accent-emerald)" size={24}/>, text: 'Real-time Tax Optimization' },
               { icon: <PieChart color="var(--accent-emerald)" size={24}/>, text: '10-Second Portfolio X-Ray' }
             ].map((feature, i) => (
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (i*0.1) }} key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   {feature.icon}
                 </div>
                 <span style={{ fontSize: '18px', fontWeight: 500 }}>{feature.text}</span>
               </motion.div>
             ))}
          </div>
        </div>

        {/* Decorative background gradients */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--accent-emerald-dim), transparent 70%)', zIndex: 0, filter: 'blur(50px)' }} />
      </div>

      {/* Right Panel form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <StitchCard style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Welcome back.</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Enter your details to continue.</p>
          
          {error && <div style={{ background: 'rgba(255, 77, 109, 0.1)', color: 'var(--accent-red)', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', border: '1px solid rgba(255, 77, 109, 0.2)' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <StitchInput 
              label="Email Address" 
              type="email" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <StitchInput 
              label="Password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <StitchButton type="submit" disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? 'Authenticating...' : 'Sign In to CapitalIQ'}
            </StitchButton>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--accent-emerald)', textDecoration: 'none', fontWeight: 600 }}>Create one now</Link>
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
              <ShieldCheck size={14} /> 256-bit encrypted data
            </div>
          </div>
        </StitchCard>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .hide-on-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
