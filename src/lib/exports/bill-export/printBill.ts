
import { Bill } from '@/types/billing';
import { supabase } from '@/integrations/supabase/client';
import { CompanyInfo } from './types';
import { toast } from 'sonner';
import { createPrintWindow, setupPrintWindowEvents } from './printWindowManager';

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
      console.error('Error fetching profile data:', error);
      toast.error('Error getting company information');
      return;
    }
    
    // Prepare company info for the bill
    const companyInfo: CompanyInfo = {
      name: profileData?.company_name || 'My Company',
      address: profileData?.company_address || 'Address not specified',
      taxId: profileData?.company_tax_id || 'Tax ID not specified',
      email: profileData?.company_email || '',
      phone: profileData?.company_phone || '',
      logo: profileData?.company_logo || ''
    };
    
    // Create and setup the print window
    const printWindow = createPrintWindow(bill, companyInfo);
    if (printWindow) {
      setupPrintWindowEvents(printWindow, bill);
    }
  } catch (error) {
    console.error('Error printing bill:', error);
    toast.error('An error occurred while preparing the bill for printing');
  }
};
