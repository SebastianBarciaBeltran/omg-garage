import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InvoiceForm } from '@core/models/invoice-form.interfaces';
import { DEFAULT_COMPANY_INFO } from '@core/utils';
import { Company, InvoiceSummary } from '@core/models';
import { OmdLogoComponent } from '@shared/icons';
import { InvoiceCalculationService } from '../../services';

@Component({
  selector: 'app-preview-invoice',
  standalone: true,
  imports: [CommonModule, ButtonModule, OmdLogoComponent],
  templateUrl: './preview-invoice.component.html',
  styleUrl: './preview-invoice.component.css',
})
export class PreviewInvoiceComponent {
  companyInfo: Company = DEFAULT_COMPANY_INFO;
  data: InvoiceForm;

  constructor(
    config: DynamicDialogConfig,
    readonly _invoiceCalculationService: InvoiceCalculationService,
  ) {
    this.data = config.data;
  }

  get invoiceSummary(): InvoiceSummary {
    return this._invoiceCalculationService.getSummary(this.data.products);
  }
}
