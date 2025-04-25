
import React from 'react';
import { TransfersTable } from '@/components/transfers/TransfersTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transfer } from '@/types';
import { ExpensesTable } from '@/components/expenses/ExpensesTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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
  onMarkAsPaid
}: TransfersPageContentProps) {
  if (loading) {
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
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
