import { Injectable } from '@angular/core';
import { InvoiceSummary } from '@core/models';
import { Product } from '@core/models/product.interfaces';

@Injectable({
  providedIn: 'root',
})
export class InvoiceCalculationService {
  getLineTotal(product: Product): number {
    const quantity = product.quantity || 0;
    const price = product.price || 0;
    return parseFloat((quantity * price).toFixed(2));
  }

  getBase(products: Product[]): number {
    const base = products.reduce((acc, p) => acc + this.getLineTotal(p), 0);
    return parseFloat(base.toFixed(2));
  }

  getIVA(base: number, rate = 0.21): number {
    return parseFloat((base * rate).toFixed(2));
  }

  getTotalFactura(base: number, iva: number): number {
    return parseFloat((base + iva).toFixed(2));
  }

  getSummary(products: Product[], ivaRate = 0.21): InvoiceSummary {
    const base = this.getBase(products);
    const iva = this.getIVA(base, ivaRate);
    const total = this.getTotalFactura(base, iva);
    return { base, iva, total };
  }
}
