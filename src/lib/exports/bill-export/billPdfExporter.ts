
import { Bill } from '@/types/billing';
import { toast } from 'sonner';
import { exportToA4Pdf } from '../pdf-export/a4PdfExporter';

/**
 * Exports HTML content to PDF using improved A4 PDF exporter
 */
export const exportHtmlToPdf = async (
  contentElement: HTMLElement,
  fileName: string,
  loadingCallback?: (isLoading: boolean) => void
): Promise<boolean> => {
  try {
    return await exportToA4Pdf(contentElement, {
      fileName,
      loadingCallback,
      showToasts: true,
      quality: 2.5,
      orientation: 'portrait',
    });
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    toast.error('Error al generar PDF. Inténtalo de nuevo.');
    if (loadingCallback) loadingCallback(false);
    return false;
  }
};
