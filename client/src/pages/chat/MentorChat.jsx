import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import StitchCard from '../../components/ui/StitchCard';
import { ShieldCheck, Send, Bot, User, AlignLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const SUGGESTIONS = [
  "Should I switch to new tax regime?",
  "How much do I need to retire at 45?",
  "What insurance do I need?",
  "Where should I invest my bonus?"
];

export default function MentorChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => scrollToBottom(), [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/chat/message', {
        message: text,
        conversationHistory: messages
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="chat-container">
      <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 100px)' }}>
        
        {/* Left Sidebar for Suggestions */}
        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="hide-on-mobile">
          <StitchCard style={{ height: '100%' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--accent-emerald)' }}>
              <Bot size={20}/> Suggested Questions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SUGGESTIONS.map((sug, i) => (
                <button 
                  key={i} 
                  onClick={() => sendMessage(sug)}
                  style={{ 
                    textAlign: 'left', background: 'var(--bg-surface)', padding: '12px 16px', 
                    borderRadius: '8px', border: '1px solid var(--border-subtle)', 
                    color: 'var(--text-primary)', cursor: 'pointer', transition: 'var(--transition)'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--border-glow)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
                >
                  {sug}
                </button>
              ))}
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-muted)' }}>
              Context-Aware AI: CapitalIQ remembers your financial data to give personalized advice using Claude 3.5 Sonnet.
            </div>
          </StitchCard>
        </div>

        {/* Main Chat Area */}
        <StitchCard style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
             {messages.length === 0 && (
               <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                 <Bot size={64} style={{ marginBottom: '16px', opacity: 0.2 }} />
                 <h2 style={{ fontSize: '24px', marginBottom: '8px', color: 'var(--text-primary)'}}>Hi, {user?.name?.split(' ')[0]}.</h2>
                 <p>I'm your AI financial brain. Ask me anything.</p>
               </div>
             )}
            
             {messages.map((m, i) => (
               <div key={i} style={{ display: 'flex', gap: '16px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                    background: m.role === 'user' ? 'var(--bg-card)' : 'var(--accent-emerald-dim)', 
                    color: m.role === 'user' ? 'white' : 'var(--accent-emerald)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${m.role === 'user' ? 'var(--border-subtle)' : 'var(--border-glow)'}`
                  }}>
                    {m.role === 'user' ? <User size={20}/> : <Bot size={20}/>}
                  </div>
                  
                  <div style={{ 
                    maxWidth: '75%', 
                    background: m.role === 'user' ? 'var(--accent-emerald)' : 'var(--bg-surface)', 
                    color: m.role === 'user' ? 'var(--bg-base)' : 'var(--text-primary)',
                    padding: '16px', borderRadius: '16px',
                    borderTopRightRadius: m.role === 'user' ? 0 : '16px',
                    borderTopLeftRadius: m.role === 'user' ? '16px' : 0,
                    borderLeft: m.role === 'assistant' ? '3px solid var(--accent-emerald)' : 'none',
                    lineHeight: 1.6, fontSize: '15px'
                  }}>
                    {m.role === 'user' ? m.content : (
                      <div className="markdown" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                          <ShieldCheck size={12}/> This is educational guidance, not SEBI-registered investment advice.
                        </div>
                      </div>
                    )}
                  </div>
               </div>
             ))}

             {loading && (
               <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-emerald-dim)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-glow)'
                  }}>
                    <Bot size={20}/>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '16px 24px', borderRadius: '16px', borderTopLeftRadius: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div className="dot-typing"></div>
                  </div>
               </div>
             )}
             <div ref={endRef} />
          </div>

          <div style={{ padding: '24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-base)' }}>
             <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} style={{ display: 'flex', gap: '12px' }}>
               <input 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder="Ask about taxes, FIRE, term insurance..." 
                 className="input-dark"
                 autoFocus
                 style={{ flex: 1, margin: 0, borderRadius: '100px', padding: '16px 24px', fontSize: '15px' }}
               />
               <button 
                 type="submit" 
                 disabled={!input.trim() || loading}
                 style={{ 
                   background: input.trim() ? 'var(--accent-emerald)' : 'var(--bg-surface)', 
                   color: input.trim() ? 'var(--bg-base)' : 'var(--text-muted)',
                   border: 'none', borderRadius: '50%', width: '54px', height: '54px',
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   cursor: input.trim() ? 'pointer' : 'default', transition: 'var(--transition)'
                 }}
               >
                 <Send size={20} style={{ transform: 'translateX(-2px) translateY(2px)' }}/>
               </button>
             </form>
             <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
               Powered by Claude AI
             </div>
          </div>
        </StitchCard>
      </div>
      
      <style>{`
        @media (max-width: 900px) {
          .hide-on-mobile { display: none !important; }
        }
        .markdown p { margin-bottom: 0.5em; }
        .markdown ul { padding-left: 20px; }
        .markdown li { margin-bottom: 4px; }
        .markdown strong { color: var(--accent-emerald); }
        .dot-typing {
          position: relative; left: -9999px; width: 6px; height: 6px; border-radius: 5px; 
          background-color: var(--accent-emerald); color: var(--accent-emerald);
          box-shadow: 9984px 0 0 0 var(--accent-emerald), 9999px 0 0 0 var(--accent-emerald), 10014px 0 0 0 var(--accent-emerald);
          animation: dot-typing 1s infinite linear;
        }
        @keyframes dot-typing {
          0% { box-shadow: 9984px 0 0 0 var(--accent-emerald), 9999px 0 0 0 rgba(0,229,160,0.2), 10014px 0 0 0 rgba(0,229,160,0.2); }
          33% { box-shadow: 9984px 0 0 0 rgba(0,229,160,0.2), 9999px 0 0 0 var(--accent-emerald), 10014px 0 0 0 rgba(0,229,160,0.2); }
          66% { box-shadow: 9984px 0 0 0 rgba(0,229,160,0.2), 9999px 0 0 0 rgba(0,229,160,0.2), 10014px 0 0 0 var(--accent-emerald); }
        }
      `}</style>
    </motion.div>
  );
}
