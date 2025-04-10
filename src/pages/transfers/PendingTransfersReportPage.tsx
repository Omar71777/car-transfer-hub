
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell,
  TableCaption 
} from '@/components/ui/table';
import { useTransfers } from '@/hooks/useTransfers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { FileDown, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { downloadCSV } from '@/lib/exports';

const PendingTransfersReportPage = () => {
  const { transfers, getPendingTransfersByCollaborator } = useTransfers();
  const pendingTransfersByCollaborator = getPendingTransfersByCollaborator();
  const collaborators = Object.keys(pendingTransfersByCollaborator);
  
  const [selectedCollaborator, setSelectedCollaborator] = useState<string | 'all'>('all');
  
  const filteredTransfers = selectedCollaborator === 'all' 
    ? transfers.filter(t => t.paymentStatus === 'a_cobrar')
    : pendingTransfersByCollaborator[selectedCollaborator] || [];
  
  const totalAmount = filteredTransfers.reduce((sum, t) => sum + t.price, 0);

  const handleExportCSV = () => {
    const data = filteredTransfers.map(transfer => ({
      Fecha: transfer.date,
      Hora: transfer.time || 'N/A',
      Origen: transfer.origin,
      Destino: transfer.destination,
      Precio: transfer.price,
      Colaborador: transfer.collaborator || 'N/A',
      'A pagar por': transfer.paymentCollaborator || 'N/A'
    }));

    const fileName = selectedCollaborator === 'all' 
      ? 'transfers-pendientes.csv' 
      : `transfers-pendientes-${selectedCollaborator}.csv`;
    
    downloadCSV(data, fileName);
  };

  return (
    <MainLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-primary">Transfers A Cobrar</h1>
            <p className="text-muted-foreground">Listado de transfers pendientes de cobro por colaborador</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <FileDown className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtrar por colaborador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Select
                  value={selectedCollaborator}
                  onValueChange={(value) => setSelectedCollaborator(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los colaboradores</SelectItem>
                    {collaborators.map((collaborator) => (
                      <SelectItem key={collaborator} value={collaborator}>
                        {collaborator}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total a cobrar</h3>
                <p className="mt-2 text-3xl font-semibold">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCollaborator === 'all' 
                ? 'Todos los Transfers A Cobrar' 
                : `Transfers A Cobrar - ${selectedCollaborator}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                Lista de transfers pendientes de cobro
                {selectedCollaborator !== 'all' && ` de ${selectedCollaborator}`}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Origen</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead className="text-right">Precio (€)</TableHead>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>A pagar por</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No hay transfers pendientes de cobro{selectedCollaborator !== 'all' && ` para ${selectedCollaborator}`}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell>{transfer.date}</TableCell>
                      <TableCell>{transfer.origin}</TableCell>
                      <TableCell>{transfer.destination}</TableCell>
                      <TableCell className="text-right">{formatCurrency(transfer.price)}</TableCell>
                      <TableCell>{transfer.collaborator || 'N/A'}</TableCell>
                      <TableCell>{transfer.paymentCollaborator || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PendingTransfersReportPage;
