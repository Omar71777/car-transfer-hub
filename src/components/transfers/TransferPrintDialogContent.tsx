
import React, { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, FileText, Users, User } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transfer } from '@/types';
import { useDialog } from '@/components/ui/dialog-service';
import { PrintOptions } from './TransferPrintDialog';

interface TransferPrintContentProps {
  onPrint: (options: PrintOptions) => void;
  onClose: () => void;
  transfers: Transfer[];
}

export function TransferPrintContent({
  onPrint,
  onClose,
  transfers
}: TransferPrintContentProps) {
  const [printOptions, setPrintOptions] = useState<PrintOptions>({
    type: 'all',
    showCommissions: true,
    showCollaborators: true,
    filterValue: undefined
  });
  
  // Extract unique collaborators and clients for filtering
  const uniqueCollaborators = [...new Set(transfers
    .filter(t => t.collaborator && t.collaborator.trim() !== '')
    .map(t => t.collaborator))];
    
  const uniqueClients = [...new Set(transfers
    .filter(t => t.client?.name && t.client.name.trim() !== '')
    .map(t => t.client?.name))];
  
  const handlePrint = () => {
    onPrint(printOptions);
    onClose();
  };
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center text-lg">
          <Printer className="mr-2 h-5 w-5 text-primary" />
          Opciones de Impresión
        </DialogTitle>
        <DialogDescription>
          Selecciona qué información quieres imprimir y cómo mostrarla.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 py-4">
        <RadioGroup
          value={printOptions.type}
          onValueChange={(value) => setPrintOptions({
            ...printOptions,
            type: value as PrintOptions['type'],
            filterValue: undefined // Reset filter value when type changes
          })}
          className="space-y-2"
        >
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Todos los transfers
              </Label>
            </div>
            <div className="text-xs text-muted-foreground ml-6">
              Imprime una lista completa de todos los transfers
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unpaid" id="unpaid" />
              <Label htmlFor="unpaid" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Transfers pendientes de pago
              </Label>
            </div>
            <div className="text-xs text-muted-foreground ml-6">
              Solo transfers con estado "Pendiente de pago"
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="collaborator" id="collaborator" />
              <Label htmlFor="collaborator" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Transfers por colaborador
              </Label>
            </div>
            {printOptions.type === 'collaborator' && (
              <div className="ml-6 mt-2">
                <Select 
                  value={printOptions.filterValue || 'none'} 
                  onValueChange={(value) => setPrintOptions({
                    ...printOptions,
                    filterValue: value === 'none' ? undefined : value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Todos los colaboradores</SelectItem>
                    {uniqueCollaborators.map(collaborator => (
                      <SelectItem key={collaborator || 'no-collaborator'} value={collaborator || 'no-collaborator'}>
                        {collaborator}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="client" id="client" />
              <Label htmlFor="client" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Transfers por cliente
              </Label>
            </div>
            {printOptions.type === 'client' && (
              <div className="ml-6 mt-2">
                <Select 
                  value={printOptions.filterValue || 'none'} 
                  onValueChange={(value) => setPrintOptions({
                    ...printOptions,
                    filterValue: value === 'none' ? undefined : value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Todos los clientes</SelectItem>
                    {uniqueClients.map(client => (
                      <SelectItem key={client || 'no-client'} value={client || 'no-client'}>
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </RadioGroup>
        
        <div className="space-y-4 pt-2 border-t">
          <div className="text-sm font-medium">Opciones de visualización:</div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="show-commissions" 
              checked={printOptions.showCommissions}
              onCheckedChange={(checked) => setPrintOptions({
                ...printOptions,
                showCommissions: checked as boolean
              })}
            />
            <Label htmlFor="show-commissions">Mostrar comisiones</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="show-collaborators" 
              checked={printOptions.showCollaborators}
              onCheckedChange={(checked) => setPrintOptions({
                ...printOptions,
                showCollaborators: checked as boolean
              })}
            />
            <Label htmlFor="show-collaborators">Mostrar colaboradores</Label>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir
        </Button>
      </DialogFooter>
    </>
  );
}

// Function to open the dialog using the dialog service
export function openTransferPrintDialog(
  dialogService: ReturnType<typeof useDialog>,
  onPrint: (options: PrintOptions) => void,
  transfers: Transfer[]
) {
  const { openDialog, closeDialog } = dialogService;
  
  openDialog(
    <TransferPrintContent
      onPrint={onPrint}
      onClose={closeDialog}
      transfers={transfers}
    />,
    {
      width: 'md',
      preventOutsideClose: false,
      onClose: () => {
        console.log('Print dialog closed');
        document.body.style.pointerEvents = 'auto';
      }
    }
  );
}
