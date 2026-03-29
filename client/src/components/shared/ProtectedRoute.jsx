import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-base)' }}>
      <div style={{ color:'var(--accent-emerald)', fontFamily:'var(--font-display)', fontSize:'18px' }}>
        Loading CapitalIQ...
      </div>
    </div>
  );
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
