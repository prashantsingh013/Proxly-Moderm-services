import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProxlyLayout } from './components/layout/ProxlyLayout';
import { ProxlyOverview } from './pages/ProxlyOverview';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Providers } from './pages/Providers';
import { ProviderProfile } from './pages/ProviderProfile';
import { ProviderTrustPage } from './pages/ProviderTrustPage';
import { NewBooking } from './pages/NewBooking';
import { Bookings } from './pages/Bookings';
import { BookingDetail } from './pages/BookingDetail';
import { WalletPage } from './pages/WalletPage';
import { ChatPage } from './pages/ChatPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { CommunityPage } from './pages/CommunityPage';
import { PredictiveCarePage } from './pages/PredictiveCarePage';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export const App = () => {
  return (
    <ProxlyLayout>
      <Routes>
        <Route path="/" element={<ProxlyOverview />} />
        <Route path="/overview" element={<ProxlyOverview />} />
        <Route path="/classic-home" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/providers/:id" element={<ProviderProfile />} />
        <Route path="/providers/:id/trust" element={<ProviderTrustPage />} />
        <Route path="/book" element={<NewBooking />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/predictive-care" element={<PredictiveCarePage />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProxlyLayout>
  );
};

export default App;
