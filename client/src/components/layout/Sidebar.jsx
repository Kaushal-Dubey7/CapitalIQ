import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Flame, HeartPulse, Receipt, Calendar, Users, PieChart, MessageSquare, LogOut } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/fire', label: 'FIRE Planner', icon: <Flame size={20} /> },
  { path: '/health', label: 'Health Score', icon: <HeartPulse size={20} /> },
  { path: '/tax', label: 'Tax Wizard', icon: <Receipt size={20} /> },
  { path: '/life-events', label: 'Life Events', icon: <Calendar size={20} /> },
  { path: '/couples', label: 'Couples', icon: <Users size={20} /> },
  { path: '/portfolio', label: 'Portfolio X-Ray', icon: <PieChart size={20} /> },
  { path: '/chat', label: 'AI Mentor', icon: <MessageSquare size={20} /> },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      color: 'var(--text-primary)'
    }} className="sidebar">
      
      {/* Mesh gradient at top */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '150px',
        background: 'radial-gradient(circle at top left, var(--accent-emerald-dim), transparent)',
        pointerEvents: 'none',
        zIndex: -1
      }} />

      {/* Logo */}
      <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px', height: '32px', background: 'var(--accent-emerald)',
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--bg-base)', fontWeight: 'bold'
        }}>
          {"♦"}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>
          CapitalIQ
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '8px',
              textDecoration: 'none',
              color: isActive ? 'var(--accent-emerald)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-emerald-dim)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent-emerald)' : '3px solid transparent',
              transition: 'var(--transition)',
              fontWeight: 500
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      {user && (
        <div style={{
          padding: '24px', borderTop: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 600
          }}>
            {user.name?.charAt(0) || 'U'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Set up complete
            </div>
          </div>
          <button onClick={logout} style={{
            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
          }}>
            <LogOut size={18} />
          </button>
        </div>
      )}

      {/* Global CSS for hiding sidebar on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar { display: none !important; }
        }
      `}</style>
    </aside>
  );
}
