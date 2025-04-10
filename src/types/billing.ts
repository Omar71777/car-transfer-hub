
import { Client } from './client';
import { Transfer } from './index';

export type TaxApplicationType = 'included' | 'excluded';

export interface BillItem {
  id: string;
  billId: string;
  transferId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Bill {
  id: string;
  clientId: string;
  client?: Client;
  number: string;
  date: string;
  dueDate: string;
  items: BillItem[];
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  taxApplication: TaxApplicationType;
  total: number;
  notes?: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  createdAt: string;
  updatedAt: string;
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
