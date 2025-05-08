
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Providers } from './contexts/providers';
import { ErrorBoundary } from './components/error-handling/ErrorBoundary';
import { SidebarProvider } from './components/ui/sidebar';

// Import pages
import IndexPage from './pages/Index';
import TransfersPage from './pages/transfers/TransfersPage';
import NewTransferPage from './pages/transfers/NewTransferPage';
import AuthPage from './pages/auth/AuthPage';
import ProfilePage from './pages/profile/ProfilePage';
import ClientsPage from './pages/clients/ClientsPage';
import CollaboratorsPage from './pages/collaborators/CollaboratorsPage';
import BillingPage from './pages/billing/BillingPage';
import ExpensesPage from './pages/expenses/ExpensesPage';
import UsersPage from './pages/admin/UsersPage';
import ProfitsPage from './pages/profits/ProfitsPage';
import NotFound from './pages/NotFound';
import SubscriptionPage from './pages/SubscriptionPage';
import SubscriptionSuccessPage from './pages/SubscriptionSuccessPage';
import LandingPage from './pages/LandingPage';
import CompaniesPage from './pages/companies/CompaniesPage';
import VehiclesPage from './pages/vehicles/VehiclesPage';

// import styles
import './styles/index.css';
import './styles/responsive/index.css';
import './styles/components/sidebar.css';
import './styles/components/scroll.css';
import './styles/dialog-fix.css';
import './styles/dialog-fixes.css';

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <Router>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/transfers" element={<TransfersPage />} />
              <Route path="/transfers/new" element={<NewTransferPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/collaborators" element={<CollaboratorsPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/profits" element={<ProfitsPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </Router>
      </Providers>
    </ErrorBoundary>
  );
}

export default App;
