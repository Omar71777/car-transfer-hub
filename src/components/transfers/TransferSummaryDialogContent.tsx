
import React, { useState, useEffect } from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTransfers } from '@/hooks/useTransfers';
import { Card, CardContent } from '@/components/ui/card';
import { Loader, Printer, FileText } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { exportToA4Pdf } from '@/lib/exports/pdf-export/a4PdfExporter';

/**
 * Standard function to open the TransferSummary dialog using the dialog service
 */
export const openTransferSummaryDialog = async (
  dialogService: any,
  transferId: string,
  onClose: () => void
) => {
  if (!transferId) {
    console.error('No transfer ID provided');
    return;
  }
  
  dialogService.openDialog(
    <TransferSummaryDialogContent transferId={transferId} onClose={onClose} />,
    {
      width: 'lg',
      preventOutsideClose: false,
      onClose,
      ariaLabel: 'Detalle del Transfer',
      role: 'dialog',
    }
  );
};

interface TransferSummaryDialogContentProps {
  transferId: string;
  onClose: () => void;
}

function TransferSummaryDialogContent({ transferId, onClose }: TransferSummaryDialogContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { getTransfer } = useTransfers();
  const [transfer, setTransfer] = useState<any>(null);
  const summaryRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchTransfer = async () => {
      setIsLoading(true);
      try {
        const data = await getTransfer(transferId);
        setTransfer(data);
      } catch (error) {
        console.error('Error fetching transfer:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransfer();
  }, [transferId, getTransfer]);
  
  const handlePrint = async () => {
    if (!summaryRef.current) return;
    
    window.print();
  };
  
  const handleExportPdf = async () => {
    if (!summaryRef.current || !transfer) return;
    
    setIsExporting(true);
    try {
      await exportToA4Pdf(summaryRef.current, {
        fileName: `Transfer_${transfer.id.substring(0, 8)}.pdf`,
        title: `Transfer Details - ${transfer.date}`,
        loadingCallback: setIsExporting,
        showToasts: true,
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>Detalle del Transfer</DialogTitle>
        <DialogDescription>
          {transfer ? `Transfer del ${transfer.date}` : 'Cargando detalles...'}
        </DialogDescription>
      </DialogHeader>
      
      <div className="mt-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : transfer ? (
          <div className="space-y-4">
            <div ref={summaryRef} className="space-y-4 p-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Información del Transfer</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Fecha:</div>
                    <div>{transfer.date}</div>
                    <div className="font-medium">Hora:</div>
                    <div>{transfer.time || 'N/A'}</div>
                    <div className="font-medium">Origen:</div>
                    <div>{transfer.origin}</div>
                    <div className="font-medium">Destino:</div>
                    <div>{transfer.destination}</div>
                    <div className="font-medium">Precio:</div>
                    <div>{formatCurrency(transfer.price)}</div>
                    {transfer.serviceType === 'dispo' && (
                      <>
                        <div className="font-medium">Horas:</div>
                        <div>{transfer.hours}</div>
                      </>
                    )}
                    {transfer.collaborator && (
                      <>
                        <div className="font-medium">Colaborador:</div>
                        <div>{transfer.collaborator}</div>
                        <div className="font-medium">Comisión:</div>
                        <div>{transfer.commission}%</div>
                      </>
                    )}
                    <div className="font-medium">Estado:</div>
                    <div>
                      <span className={transfer.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}>
                        {transfer.paymentStatus === 'paid' ? 'Cobrado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Additional details */}
              {transfer.client && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Cliente</h3>
                    <div>
                      <p className="font-medium">{transfer.client.name}</p>
                      {transfer.client.email && <p>{transfer.client.email}</p>}
                      {transfer.client.phone && <p>{transfer.client.phone}</p>}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePrint}
                disabled={isExporting}
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button 
                variant="outline"
                onClick={handleExportPdf}
                disabled={isExporting}
              >
                <FileText className="h-4 w-4 mr-2" />
                {isExporting ? 'Exportando...' : 'Exportar PDF'}
              </Button>
              <Button onClick={onClose}>Cerrar</Button>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            No se encontró información para este transfer.
          </div>
        )}
      </div>
    </>
  );
}
