
import { Bill } from '@/types/billing';
import { supabase } from '@/integrations/supabase/client';
import { CompanyInfo } from './types';
import { generateBillHtml } from './printBillContent';

/**
 * Prints a bill by creating a new window with the bill content
 */
export const printBill = async (bill: Bill) => {
  try {
    // Obtain company information from the current user's profile
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();
    
    if (error) {
      console.error('Error al obtener los datos del perfil:', error);
      return;
    }
    
    const companyInfo: CompanyInfo = {
      name: profileData?.company_name || 'Mi Empresa',
      address: profileData?.company_address || 'Dirección no especificada',
      taxId: profileData?.company_tax_id || 'NIF/CIF no especificado',
      email: profileData?.company_email || '',
      phone: profileData?.company_phone || '',
      logo: profileData?.company_logo || ''
    };
    
    // Create a print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permite las ventanas emergentes para imprimir la factura');
      return;
    }

    // Generate the bill HTML content
    const content = generateBillHtml(bill, companyInfo);

    // Write the content to the print window
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
    
    // Wait for the window to fully load before printing
    printWindow.onload = () => {
      printWindow.focus();
      // Print automatically
      setTimeout(() => printWindow.print(), 500);
    };
  } catch (error) {
    console.error('Error al imprimir la factura:', error);
    alert('Ocurrió un error al preparar la factura para imprimir.');
  }
};
