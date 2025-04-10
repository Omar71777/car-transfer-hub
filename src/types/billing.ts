
import { Client } from './client';
import { Transfer } from './index';

export type TaxApplicationType = 'included' | 'excluded';

export interface BillItem {
  id: string;
  bill_id: string; // Changed from billId
  transfer_id: string; // Changed from transferId
  description: string;
  quantity: number;
  unit_price: number; // Changed from unitPrice
  total_price: number; // Changed from totalPrice
}

export interface Bill {
  id: string;
  client_id: string; // Changed from clientId
  client?: Client;
  number: string;
  date: string;
  due_date: string; // Changed from dueDate
  items: BillItem[];
  sub_total: number; // Changed from subTotal
  tax_rate: number; // Changed from taxRate
  tax_amount: number; // Changed from taxAmount
  tax_application: TaxApplicationType; // Changed from taxApplication
  total: number;
  notes?: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  created_at: string; // Changed from createdAt
  updated_at: string; // Changed from updatedAt
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
  }[];
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  taxApplication: TaxApplicationType;
  total: number;
}
