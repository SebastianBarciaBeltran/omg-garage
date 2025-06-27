import { Customer } from './customer.interfaces';
import { Product } from './product.interfaces';

export interface InvoiceForm {
  customer: Customer;
  products: Product[];
  date: Date;
  invoiceNumber: string;
}
