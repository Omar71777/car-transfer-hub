
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Providers } from './contexts/providers';
import Index from './pages/Index';
import TransfersPage from './pages/transfers/TransfersPage';
import NewTransferPage from './pages/transfers/NewTransferPage';
import ExpensesPage from './pages/expenses/ExpensesPage';
import ShiftsPage from './pages/shifts/ShiftsPage';
import UsersPage from './pages/admin/UsersPage';
import ProfilePage from './pages/profile/ProfilePage';
import ProfitsPage from './pages/profits/ProfitsPage';
import CollaboratorsPage from './pages/collaborators/CollaboratorsPage';
import UnpaidTransfersPage from './pages/reports/UnpaidTransfersPage';
import AnalyticsReportPage from './pages/admin/reports/AnalyticsReportPage';
import TransfersReportPage from './pages/admin/reports/TransfersReportPage';
import ClientsPage from './pages/clients/ClientsPage';
import BillingPage from './pages/billing/BillingPage';
import AuthPage from './pages/auth/AuthPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <React.StrictMode>
      <Providers>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/transfers" element={<TransfersPage />} />
            <Route path="/transfers/new" element={<NewTransferPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/shifts" element={<ShiftsPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profits" element={<ProfitsPage />} />
            <Route path="/collaborators" element={<CollaboratorsPage />} />
            <Route path="/reports/unpaid" element={<UnpaidTransfersPage />} />
            <Route path="/admin/reports/analytics" element={<AnalyticsReportPage />} />
            <Route path="/admin/reports/transfers" element={<TransfersReportPage />} />
            
            {/* New billing routes */}
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/billing" element={<BillingPage />} />
            
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Providers>
    </React.StrictMode>
  );
}

export default App;
