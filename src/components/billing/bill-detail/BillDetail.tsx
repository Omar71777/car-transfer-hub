
import React from 'react';
import { Bill } from '@/types/billing';
import { BillHeaderSection } from './BillHeaderSection';
import { BillInfoCards } from './BillInfoCards';
import { BillItemsTable } from './BillItemsTable';

interface BillDetailProps {
  bill: Bill;
  onEdit: () => void;
  onPrint: (bill: Bill) => void;
  onDownload: () => void;
  onStatusChange: (status: Bill['status']) => void;
}

export function BillDetail({ 
  bill, 
  onEdit, 
  onPrint, 
  onDownload, 
  onStatusChange 
}: BillDetailProps) {
  return (
    <div className="space-y-6">
      <BillHeaderSection 
        bill={bill} 
        onEdit={onEdit} 
        onPrint={onPrint} 
        onDownload={onDownload} 
        onStatusChange={onStatusChange} 
      />
      
      <BillInfoCards bill={bill} />
      
      <BillItemsTable bill={bill} />
    </div>
  );
}
