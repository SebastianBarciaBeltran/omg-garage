import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [ButtonModule, RouterLink],
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.css',
})
export class InvoicesListComponent {}
