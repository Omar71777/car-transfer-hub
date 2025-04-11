
import { Client } from './client';
import { Transfer } from './index';

export type TaxApplicationType = 'included' | 'excluded';

export interface ExtraChargeBillItem {
  id: string;
  name: string;
  price: number;
}

export interface BillItem {
  id: string;
  bill_id: string;
  transfer_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  is_extra_charge?: boolean;
  extra_charge_id?: string;
  parent_item_id?: string | null;
  extra_charges?: ExtraChargeBillItem[]; // For displaying related extra charges
}

export interface Bill {
  id: string;
  client_id: string;
  client?: Client;
  number: string;
  date: string;
  due_date: string;
  items: BillItem[];
  sub_total: number;
  tax_rate: number;
  tax_amount: number;
  tax_application: TaxApplicationType;
  total: number;
  notes?: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateBillDto {
  clientId: string;
  date: string;
  dueDate: string;
  transferIds: string[];
  taxRate: number;
  taxApplication: TaxApplicationType;
  notes?: string;
}

export interface BillPreview {
  client: Client;
  items: {
    transfer: Transfer;
    description: string;
    unitPrice: number;
    extraCharges?: {
      id: string;
      name: string;
      price: number;
    }[];
  }[];
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  taxApplication: TaxApplicationType;
  total: number;
}
