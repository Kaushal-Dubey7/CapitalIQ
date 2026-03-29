import { useState } from 'react';
import api from '../../services/api';
import StitchCard from '../../components/ui/StitchCard';
import StitchButton from '../../components/ui/StitchButton';
import StitchBadge from '../../components/ui/StitchBadge';
import { Calendar, Baby, Heart, Home, GraduationCap, Briefcase, Car, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const EVENT_TYPES = [
  { id: 'marriage', label: 'Getting Married', icon: <Heart size={24} />, color: '#FF4D6D' },
  { id: 'child', label: 'Having a Baby', icon: <Baby size={24} />, color: '#00E5A0' },
  { id: 'home', label: 'Buying a Home', icon: <Home size={24} />, color: '#82B1FF' },
  { id: 'education', label: 'Higher Education', icon: <GraduationCap size={24} />, color: '#F5A623' },
  { id: 'job_loss', label: 'Job Transition', icon: <Briefcase size={24} />, color: '#B388FF' },
  { id: 'vehicle', label: 'Buying a Vehicle', icon: <Car size={24} />, color: '#FF80AB' }
];

export default function LifeEvents() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [advice, setAdvice] = useState(null);

  const handleAnalyze = async (event) => {
    setSelectedEvent(event);
    setAnalyzing(true);
    setAdvice(null);
    try {
      const { data } = await api.post('/lifeevents/analyze', { 
        eventType: event.id,
        eventDetails: `Planning for ${event.label}`
      });
      setAdvice(data.data.advice);
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating advice');
      setSelectedEvent(null);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-enter-active">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(179, 136, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B388FF' }}>
          <Calendar size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '28px', margin: 0 }}>Life Events Planner</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Get a customized 5-step financial playbook for major milestones.</p>
        </div>
      </div>

      {!advice && !analyzing ? (
        <StitchCard style={{ padding: '40px 24px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '32px', textAlign: 'center' }}>What are you planning for?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {EVENT_TYPES.map(event => (
              <StitchCard 
                key={event.id}
                onClick={() => handleAnalyze(event)}
                style={{ 
                  cursor: 'pointer', textAlign: 'center', padding: '32px 24px', 
                  transition: 'var(--transition)', position: 'relative', overflow: 'hidden'
                 }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = event.color; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: `radial-gradient(circle at top right, ${event.color}33, transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: event.color, border: `1px solid ${event.color}33` }}>
                  {event.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{event.label}</h3>
              </StitchCard>
            ))}
          </div>
        </StitchCard>
      ) : analyzing ? (
        <StitchCard style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '64px 24px' }}>
           <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 32px' }}>
             <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '3px dashed var(--accent-emerald)', animation: 'spin 4s linear infinite' }} />
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: selectedEvent.color }}>
               {selectedEvent.icon}
             </div>
           </div>
           <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Generating Playbook...</h2>
           <p style={{ color: 'var(--text-secondary)' }}>Analyzing your net worth, cash flow, and {selectedEvent.label.toLowerCase()} requirements.</p>
           <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </StitchCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <StitchButton variant="ghost" onClick={() => { setAdvice(null); setSelectedEvent(null); }}>
              ← Choose Another Event
            </StitchButton>
          </div>

          <StitchCard style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ padding: '32px', borderBottom: '1px solid var(--border-subtle)', background: `radial-gradient(circle at top right, ${selectedEvent.color}15, transparent 50%)`, display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-card)', border: `2px solid ${selectedEvent.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedEvent.color }}>
                 {selectedEvent.icon}
              </div>
              <div>
                <StitchBadge style={{ background: `${selectedEvent.color}33`, color: selectedEvent.color, borderColor: `${selectedEvent.color}55`, marginBottom: '12px' }}>Playbook Ready</StitchBadge>
                <h2 style={{ fontSize: '28px', margin: 0 }}>Your {selectedEvent.label} Action Plan</h2>
              </div>
            </div>

            <div style={{ padding: '40px' }} className="markdown">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', color: 'var(--accent-emerald)' }}>
                <Sparkles size={24} />
                <h3 style={{ fontSize: '20px', margin: 0 }}>AI Financial Advice</h3>
              </div>
              <ReactMarkdown>{advice}</ReactMarkdown>
            </div>
          </StitchCard>
        </div>
      )}
      <style>{`
        .markdown h1, .markdown h2, .markdown h3 { color: var(--text-primary); margin-top: 1.5em; margin-bottom: 0.5em; }
        .markdown p { color: var(--text-secondary); line-height: 1.7; margin-bottom: 1em; }
        .markdown ul { color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5em; padding-left: 20px; }
        .markdown li { margin-bottom: 0.5em; }
        .markdown strong { color: var(--text-primary); }
      `}</style>
    </motion.div>
  );
}
