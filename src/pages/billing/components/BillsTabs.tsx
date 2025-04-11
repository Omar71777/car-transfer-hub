
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BillsTable } from '@/components/billing/BillsTable';
import { BillForm } from '@/components/billing/BillForm';
import { Bill, CreateBillDto } from '@/types/billing';

interface BillsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bills: Bill[];
  loading?: boolean;
  handleAddBill: () => void;
  handleViewBill: (bill: Bill) => void;
  handleEditBill: (bill: Bill) => void;
  handlePrintBill: (bill: Bill) => void;
  handleDeleteBill: (bill: Bill) => void;
  handleFormSubmit: (values: CreateBillDto) => Promise<void>;
}

export function BillsTabs({
  activeTab,
  setActiveTab,
  bills,
  loading = false,
  handleAddBill,
  handleViewBill,
  handleEditBill,
  handlePrintBill,
  handleDeleteBill,
  handleFormSubmit,
}: BillsTabsProps) {
  return (
    <Tabs defaultValue="bills" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="bills">Facturas</TabsTrigger>
        <TabsTrigger value="create">Crear factura</TabsTrigger>
      </TabsList>

      <TabsContent value="bills">
        <BillsTable
          bills={bills}
          loading={loading}
          onAdd={handleAddBill}
          onView={handleViewBill}
          onEdit={handleEditBill}
          onPrint={handlePrintBill}
          onDelete={handleDeleteBill}
        />
      </TabsContent>

      <TabsContent value="create">
        <BillForm onSubmit={handleFormSubmit} />
      </TabsContent>
    </Tabs>
  );
}
