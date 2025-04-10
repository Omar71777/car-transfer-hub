import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/auth';
import { SupabaseAuthProvider } from '@/integrations/supabase/SupabaseAuthProvider';

// Import pages
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import TransfersPage from '@/pages/transfers/TransfersPage';
import NewTransferPage from '@/pages/transfers/NewTransferPage';
import ShiftsPage from '@/pages/ShiftsPage';
import ExpensesPage from '@/pages/ExpensesPage';
import ProfitsPage from '@/pages/ProfitsPage';
import CollaboratorsPage from '@/pages/CollaboratorsPage';
import ProfilePage from '@/pages/ProfilePage';
import UsersPage from '@/pages/admin/UsersPage';
import TransfersReportPage from '@/pages/admin/reports/TransfersReportPage';
import AnalyticsReportPage from '@/pages/admin/reports/AnalyticsReportPage';
import NotFound from '@/pages/NotFound';
import PendingTransfersReportPage from '@/pages/transfers/PendingTransfersReportPage';

// Import components
import { MainLayout } from '@/components/layout/MainLayout';

// Protected route component
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // Show a loading indicator
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <MainLayout>{children}</MainLayout>;
};

// Admin route component
const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAdmin, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // Show a loading indicator
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />;
  }

  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="ibiza-transfer-theme">
        <SupabaseAuthProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Index />} />
                <Route path="/transfers" element={<TransfersPage />} />
                <Route path="/transfers/new" element={<NewTransferPage />} />
                <Route path="/transfers/pending" element={<PendingTransfersReportPage />} />
                <Route path="/shifts" element={<ShiftsPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/profits" element={<ProfitsPage />} />
                <Route path="/collaborators" element={<CollaboratorsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin/users" element={<UsersPage />} />
                  <Route path="/admin/reports/transfers" element={<TransfersReportPage />} />
                  <Route path="/admin/reports/analytics" element={<AnalyticsReportPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </TooltipProvider>
        </SupabaseAuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
