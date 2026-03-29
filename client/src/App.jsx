import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserDataProvider } from './contexts/UserDataContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Layout from './components/layout/Layout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import FirePlanner from './pages/fire/FirePlanner';
import MoneyHealth from './pages/health/MoneyHealth';
import LifeEvents from './pages/lifeevents/LifeEvents';
import TaxWizard from './pages/tax/TaxWizard';
import CouplesPlanner from './pages/couples/CouplesPlanner';
import PortfolioXray from './pages/portfolio/PortfolioXray';
import MentorChat from './pages/chat/MentorChat';

export default function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/fire" element={<FirePlanner />} />
                <Route path="/health" element={<MoneyHealth />} />
                <Route path="/life-events" element={<LifeEvents />} />
                <Route path="/tax" element={<TaxWizard />} />
                <Route path="/couples" element={<CouplesPlanner />} />
                <Route path="/portfolio" element={<PortfolioXray />} />
                <Route path="/chat" element={<MentorChat />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </UserDataProvider>
    </AuthProvider>
  );
}
