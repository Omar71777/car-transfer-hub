
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransferManagementTab } from './TransferManagementTab';

interface TransfersPageContentProps {
  transfers: any[];
  expenses: any[];
  loading: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  onEdit: (transfer: any) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
  onViewSummary: (transferId: string) => void;
  onDeleteMultiple: (ids: string[]) => void;
  onMarkAsPaid?: (transferId: string) => void;
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
  return (
    <div className="py-4 md:py-6 w-full">
      <TransferManagementTab 
        transfers={transfers}
        loading={loading}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddExpense={onAddExpense}
        onViewSummary={onViewSummary}
        onDeleteMultiple={onDeleteMultiple}
        onMarkAsPaid={onMarkAsPaid}
      />
    </div>
  );
}
