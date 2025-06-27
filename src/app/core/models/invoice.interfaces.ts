import { Customer } from './customer.interfaces';
import { InvoiceStatus } from '../utils/invoice-status.enum';
import { Product } from './product.interfaces';

export interface Invoice {
  date: Date;
  client: Customer;
  items: InvoiceItem[];
  total: number;
  vatTotal: number;
  grandTotal: number;
  invoiceNumber: string;
  dueDate?: Date;
  status?: InvoiceStatus;
  notes?: string;
  dto?: number; // 5%, 10%, 15%, 20%
  id?: string;
}

export interface InvoiceItem {
  product: Product;
  quantity: number;
  price: number;
  vatRate: number; // 0, 10, 21 (tipos de IVA en España)
}
