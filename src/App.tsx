
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/auth';
import { SupabaseAuthProvider } from '@/integrations/supabase/SupabaseAuthProvider';

// Import pages
import Index from '@/pages/Index';
import AuthPage from '@/pages/auth/AuthPage';
import TransfersPage from '@/pages/transfers/TransfersPage';
import NewTransferPage from '@/pages/transfers/NewTransferPage';
import ExpensesPage from '@/pages/expenses/ExpensesPage';
import ProfitsPage from '@/pages/profits/ProfitsPage';
import CollaboratorsPage from '@/pages/collaborators/CollaboratorsPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import UsersPage from '@/pages/admin/UsersPage';
import TransfersReportPage from '@/pages/admin/reports/TransfersReportPage';
import AnalyticsReportPage from '@/pages/admin/reports/AnalyticsReportPage';
import NotFound from '@/pages/NotFound';
import PendingTransfersReportPage from '@/pages/transfers/PendingTransfersReportPage';

// Import components
import { MainLayout } from '@/components/layout/MainLayout';

// Protected route component
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>; // Show a loading indicator
  }

  if (!profile) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
  const { profile, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>; // Show a loading indicator
  }

  if (!profile || !isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />

            <Route path="/" element={<MainLayout><ProtectedRoute /></MainLayout>}>
              <Route index element={<Index />} />
              <Route path="transfers" element={<TransfersPage />} />
              <Route path="transfers/new" element={<NewTransferPage />} />
              <Route path="transfers/pending" element={<PendingTransfersReportPage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="profits" element={<ProfitsPage />} />
              <Route path="collaborators" element={<CollaboratorsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              
              {/* Admin Routes */}
              <Route path="admin" element={<AdminRoute />}>
                <Route path="users" element={<UsersPage />} />
                <Route path="reports/transfers" element={<TransfersReportPage />} />
                <Route path="reports/analytics" element={<AnalyticsReportPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </TooltipProvider>
      </SupabaseAuthProvider>
    </BrowserRouter>
  );
}

export default App;
