import { Routes } from '@angular/router';
import { InvoicesPagesComponent, InvoicesListComponent } from '.';

export const INVOICES_ROUTES: Routes = [
  {
    path: '',
    component: InvoicesPagesComponent,
    children: [
      { path: '', component: InvoicesListComponent },
      {
        path: 'new-invoice',
        loadComponent: () =>
          import('./new-invoice/new-invoice.component').then(m => m.NewInvoiceComponent),
      },
    ],
  },
];
