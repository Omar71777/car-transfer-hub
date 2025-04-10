
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Transfer } from '@/types';
import { TransfersTable } from '@/components/transfers/TransfersTable';

interface TransferManagementTabProps {
  transfers: Transfer[];
  loading: boolean;
  onEdit: (transfer: Transfer) => void;
  onDelete: (id: string) => void;
  onAddExpense: (transferId: string) => void;
}

export function TransferManagementTab({
  transfers,
  loading,
  onEdit,
  onDelete,
  onAddExpense
}: TransferManagementTabProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 text-ibiza-900 text-left">Transfers</h1>
          <p className="text-muted-foreground text-left text-sm md:text-base">Gestiona y analiza todos tus servicios de transfer</p>
        </div>
        <Button asChild className="self-stretch md:self-auto">
          <Link to="/transfers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Transfer
          </Link>
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Cargando transfers...</p>
        </div>
      ) : (
        <TransfersTable 
          transfers={transfers} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onAddExpense={onAddExpense} 
        />
      )}
    </>
  );
}
