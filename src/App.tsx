
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './contexts/providers';
import { ErrorBoundary } from './components/error-handling/ErrorBoundary';
import { SidebarProvider } from './components/ui/sidebar';
import { useAuth } from './contexts/auth';

// Import pages
import LandingPage from './pages/LandingPage';
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
import CompaniesPage from './pages/companies/CompaniesPage';
import VehiclesPage from './pages/vehicles/VehiclesPage';
import DashboardContent from './components/dashboard/DashboardContent';

// import styles
import './styles/index.css';
import './styles/responsive/index.css';
import './styles/components/sidebar.css';
import './styles/components/scroll.css';
import './styles/dialog-fix.css';
import './styles/dialog-fixes.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { session, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }
  
  if (!session) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Auth route component - redirects to dashboard if already authenticated
const AuthRoute = ({ children }) => {
  const { session, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }
  
  if (session) {
    return <Navigate to="/transfers" replace />;
  }
  
  return children;
};

function AppRoutes() {
  const { session } = useAuth();
  
  return (
    <Router>
      <SidebarProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            session ? <Navigate to="/transfers" replace /> : <LandingPage />
          } />
          <Route path="/auth" element={
            <AuthRoute><AuthPage /></AuthRoute>
          } />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardContent />
            </ProtectedRoute>
          } />
          <Route path="/transfers" element={
            <ProtectedRoute>
              <TransfersPage />
            </ProtectedRoute>
          } />
          <Route path="/transfers/new" element={
            <ProtectedRoute>
              <NewTransferPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute>
              <ClientsPage />
            </ProtectedRoute>
          } />
          <Route path="/collaborators" element={
            <ProtectedRoute>
              <CollaboratorsPage />
            </ProtectedRoute>
          } />
          <Route path="/billing" element={
            <ProtectedRoute>
              <BillingPage />
            </ProtectedRoute>
          } />
          <Route path="/expenses" element={
            <ProtectedRoute>
              <ExpensesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          } />
          <Route path="/profits" element={
            <ProtectedRoute>
              <ProfitsPage />
            </ProtectedRoute>
          } />
          <Route path="/subscription" element={
            <ProtectedRoute>
              <SubscriptionPage />
            </ProtectedRoute>
          } />
          <Route path="/subscription/success" element={
            <ProtectedRoute>
              <SubscriptionSuccessPage />
            </ProtectedRoute>
          } />
          <Route path="/companies" element={
            <ProtectedRoute>
              <CompaniesPage />
            </ProtectedRoute>
          } />
          <Route path="/vehicles" element={
            <ProtectedRoute>
              <VehiclesPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SidebarProvider>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <AppRoutes />
      </Providers>
    </ErrorBoundary>
  );
}

export default App;
