
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import AuthPage from "./pages/auth/AuthPage";
import UsersPage from "./pages/admin/UsersPage";
import TransfersPage from "./pages/transfers/TransfersPage";
import NewTransferPage from "./pages/transfers/NewTransferPage";
import ExpensesPage from "./pages/expenses/ExpensesPage";
import ProfitsPage from "./pages/profits/ProfitsPage";
import ShiftsPage from "./pages/shifts/ShiftsPage";
import CollaboratorsPage from "./pages/collaborators/CollaboratorsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import NotFound from "./pages/NotFound";
import TransfersReportPage from "./pages/admin/reports/TransfersReportPage";
import AnalyticsReportPage from "./pages/admin/reports/AnalyticsReportPage";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
    
    <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/transfers" element={<ProtectedRoute><TransfersPage /></ProtectedRoute>} />
    <Route path="/transfers/new" element={<ProtectedRoute><NewTransferPage /></ProtectedRoute>} />
    <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
    <Route path="/profits" element={<ProtectedRoute><ProfitsPage /></ProtectedRoute>} />
    <Route path="/shifts" element={<ProtectedRoute><ShiftsPage /></ProtectedRoute>} />
    <Route path="/collaborators" element={<ProtectedRoute><CollaboratorsPage /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    
    {/* Admin routes */}
    <Route path="/admin/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
    
    {/* New Report Routes */}
    <Route path="/admin/reports/transfers" element={<AdminRoute><TransfersReportPage /></AdminRoute>} />
    <Route path="/admin/reports/analytics" element={<AdminRoute><AnalyticsReportPage /></AdminRoute>} />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
