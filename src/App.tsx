
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TransfersPage from "./pages/transfers/TransfersPage";
import NewTransferPage from "./pages/transfers/NewTransferPage";
import ExpensesPage from "./pages/expenses/ExpensesPage";
import ProfitsPage from "./pages/profits/ProfitsPage";
import ShiftsPage from "./pages/shifts/ShiftsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/transfers" element={<TransfersPage />} />
          <Route path="/transfers/new" element={<NewTransferPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/profits" element={<ProfitsPage />} />
          <Route path="/shifts" element={<ShiftsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
