import { Routes } from '@angular/router';
import { SalesComponent } from './sales.component';

export const SALES_ROUTES: Routes = [
  {
    path: '',
    component: SalesComponent,
    children: [
      {
        path: 'invoices',
        loadChildren: () => import('./invoices/invoices.routes').then(m => m.INVOICES_ROUTES),
      },
      {
        path: '',
        redirectTo: 'invoices',
        pathMatch: 'full',
      },
    ],
  },
];
