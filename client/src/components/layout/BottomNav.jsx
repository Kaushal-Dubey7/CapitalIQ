import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Flame, HeartPulse, Receipt, MoreHorizontal } from 'lucide-react';

export default function BottomNav() {
  const tabs = [
    { path: '/', label: 'Home', icon: <LayoutDashboard size={22} /> },
    { path: '/fire', label: 'FIRE', icon: <Flame size={22} /> },
    { path: '/health', label: 'Health', icon: <HeartPulse size={22} /> },
    { path: '/tax', label: 'Tax', icon: <Receipt size={22} /> },
    { path: '/chat', label: 'Chat', icon: <MoreHorizontal size={22} /> }, // Simplified "More" to "Chat" for now
  ];

  return (
    <>
      <div className="bottom-nav">
        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => `bottom-tab ${isActive ? 'active' : ''}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>

      <style>{`
        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: rgba(15, 22, 40, 0.9);
          backdrop-filter: blur(16px);
          border-top: 1px solid var(--border-subtle);
          z-index: 1000;
          height: 70px;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .bottom-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          text-decoration: none;
          gap: 4px;
          padding: 8px;
          transition: var(--transition);
        }
        .bottom-tab span {
          font-size: 10px;
          font-weight: 500;
        }
        .bottom-tab.active {
          color: var(--accent-emerald);
        }
        .bottom-tab.active svg {
          filter: drop-shadow(0 0 8px var(--accent-emerald-dim));
        }

        @media (max-width: 768px) {
          .bottom-nav {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
