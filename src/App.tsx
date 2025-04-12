
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Providers } from './contexts/providers';
import Index from './pages/Index';
import TransfersPage from './pages/transfers/TransfersPage';
import NewTransferPage from './pages/transfers/NewTransferPage';
import ExpensesPage from './pages/expenses/ExpensesPage';
import UsersPage from './pages/admin/UsersPage';
import ProfilePage from './pages/profile/ProfilePage';
import ProfitsPage from './pages/profits/ProfitsPage';
import CollaboratorsPage from './pages/collaborators/CollaboratorsPage';
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
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profits" element={<ProfitsPage />} />
            <Route path="/collaborators" element={<CollaboratorsPage />} />
            
            {/* Client and billing routes */}
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
