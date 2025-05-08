
import React from 'react';
import { TransfersTable } from '@/components/transfers/TransfersTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transfer } from '@/types';
import { ExpensesTable } from '@/components/expenses/ExpensesTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransfersPageContentProps {
  transfers: Transfer[];
  expenses: Expense[];
  loading: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  onViewSummary: (transferId: string) => void;
  onDeleteMultiple: (ids: string[]) => void;
  onMarkAsPaid: (id: string, newStatus?: 'paid' | 'pending') => void;
  onAddTransfer?: () => void;
  error?: string | null;
}

export function TransfersPageContent({
  transfers,
  expenses,
  loading,
  activeTab,
  onTabChange,
  onEdit,
  onDelete,
  onAddExpense,
  onViewSummary,
  onDeleteMultiple,
  onMarkAsPaid,
  onAddTransfer,
  error = null
}: TransfersPageContentProps) {
  const isMobile = useIsMobile();
  
  if (loading && !activeTab) {
    return <LoadingSpinner />;
  }

  const handleEditExpense = (expense: Expense) => {
    console.log("Edit expense:", expense);
  };

  const handleDeleteExpense = (id: string) => {
    console.log("Delete expense:", id);
  };

  const handleAddExpense = (expense: Partial<Expense>) => {
    console.log("Add expense:", expense);
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="transfers">
            Traslados
          </TabsTrigger>
          <TabsTrigger value="expenses">
            Gastos
          </TabsTrigger>
        </TabsList>
        
        {activeTab === 'transfers' && onAddTransfer && (
          <Button onClick={onAddTransfer} className={isMobile ? "mobile-btn" : ""}>
            <Plus className="mr-2 h-4 w-4" />
            {isMobile ? "Nuevo" : "Nuevo Transfer"}
          </Button>
        )}
      </div>
      
      <TabsContent value="transfers" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Traslados</CardTitle>
          </CardHeader>
          <CardContent>
            <TransfersTable
              transfers={transfers}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddExpense={onAddExpense}
              onViewSummary={onViewSummary}
              onDeleteMultiple={onDeleteMultiple}
              onMarkAsPaid={onMarkAsPaid}
              isLoading={loading}
              error={error}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="expenses" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensesTable 
              expenses={expenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              onAdd={handleAddExpense}
              isLoading={loading && activeTab === 'expenses'}
              error={activeTab === 'expenses' ? error : null}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
