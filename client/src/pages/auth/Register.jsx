import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StitchCard from '../../components/ui/StitchCard';
import StitchInput from '../../components/ui/StitchInput';
import StitchButton from '../../components/ui/StitchButton';
import { Flame, Receipt, PieChart, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: ''});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({...formData, [e.target.id]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password, confirmPassword, phone } = formData;

    // Client-side validation
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, phone);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <h2 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '16px', lineHeight: 1.1 }}>Join the revolution.</h2>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '48px', maxWidth: '400px' }}>
            Set up your free account today and start taking control of your financial destiny.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             {[
               { icon: <Flame color="var(--accent-emerald)" size={24}/>, text: 'Customized Financial Plans' },
               { icon: <Receipt color="var(--accent-emerald)" size={24}/>, text: 'Maximize Tax Deductions' },
               { icon: <PieChart color="var(--accent-emerald)" size={24}/>, text: 'Uncover Hidden Mutual Fund Fees' }
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
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--accent-emerald-dim), transparent 70%)', zIndex: 0, filter: 'blur(50px)' }} />
      </div>

      {/* Right Panel form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <StitchCard style={{ width: '100%', maxWidth: '480px', padding: '40px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Start your journey with CapitalIQ.</p>
          
          {error && (
            <div style={{
              background: 'rgba(255,77,109,0.1)',
              border: '1px solid rgba(255,77,109,0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#FF4D6D',
              fontSize: '14px',
              marginBottom: '16px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <StitchInput label="Full Name" id="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
              <StitchInput label="Phone" id="phone" type="tel" placeholder="+91 9999999999" value={formData.phone} onChange={handleChange} />
            </div>
            <StitchInput label="Email Address" id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            <StitchInput label="Password" id="password" type="password" placeholder="Min. 8 characters" value={formData.password} onChange={handleChange} required />
            <StitchInput label="Confirm Password" id="confirmPassword" type="password" placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} required />
            
            <StitchButton type="submit" disabled={loading} style={{ marginTop: '16px' }}>
              {loading ? 'Creating Account...' : 'Sign Up Free'}
            </StitchButton>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--accent-emerald)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
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
