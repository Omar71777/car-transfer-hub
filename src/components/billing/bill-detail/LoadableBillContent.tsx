
import React, { useRef } from 'react';
import { Bill } from '@/types/billing';
import { Button } from '@/components/ui/button';
import { Loader, Printer, Download, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadableBillContentProps {
  bill: Bill | null;
  isLoading: boolean;
  onPrint: (bill: Bill) => Promise<void>;
  onDownload: (bill: Bill) => Promise<void>;
  onEdit?: (bill: Bill) => void;
  children: React.ReactNode;
}

export function LoadableBillContent({
  bill,
  isLoading,
  onPrint,
  onDownload,
  onEdit,
  children
}: LoadableBillContentProps) {
  // Reference to the content for printing/export
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Handle missing bill data
  if (!bill) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6 text-center">
          No se encontró información para esta factura.
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Content for printing and display */}
      <div ref={contentRef} className="space-y-4">
        {children}
      </div>
      
      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        {onEdit && (
          <Button
            variant="outline"
            onClick={() => onEdit(bill)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => onPrint(bill)}
        >
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
        <Button 
          variant="outline"
          onClick={() => onDownload(bill)}
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar
        </Button>
      </div>
    </div>
  );
}
