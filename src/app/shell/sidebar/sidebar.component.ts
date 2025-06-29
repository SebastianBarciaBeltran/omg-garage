import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@auth/auth.service';
import { OmdLogoComponent, primeNGModules } from '@shared/index';
import { Drawer } from 'primeng/drawer';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, primeNGModules, OmdLogoComponent, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
    @ViewChild('drawerRef') drawerRef!: Drawer;

    closeCallback(e: any): void {
        this.drawerRef.close(e);
    }

  visible: boolean = false;

  items: MenuItem[] = [];

  constructor(
    private router: Router,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        route: '/home'
      },
      {
        label: 'Contactos',
        icon: 'pi pi-address-book',
        route: '/'
      },
      {
        label: 'Ventas',
        icon: 'pi pi-chart-line',
        items: [
          {
            label: 'Facturas',
            route: '/sales/invoices',
          },
          {
            label: 'Presupuestos',
            route: '/'

          },
          {
            label: 'Servicios',
            route: '/'
          },
        ],
      },
      {
        label: 'Compras',
        icon: 'pi pi-shopping-bag',
        items: [
        {
            label: 'Facturas',
            route: '/'
          },
        ],
      },
      {
        label: 'CRM',
        icon: 'pi pi-share-alt',
        items: [
          {
            label: 'Embudo de ventas',
          },
          {
            label: 'Calendario',
          },
          {
            label: 'Reservas',
          },
          {
            label: 'Reuniones',
          },
        ],
      },
      {
        label: 'Inventario',
        icon: 'pi pi-database',
        items: [
          {
            label: 'Productos',
          },
        ],
      },
      {
        label: 'Tesorería',
        icon: 'pi pi-building-columns',
        items: [
          {
            label: 'Cuentas',
          },
          {
            label: 'Cashflow',
          },
          {
            label: 'Pagos y cobros',
          },
          {
            label: 'Remseas',
          },
        ],
      },
      {
        label: 'Contabilidad',
        icon: 'pi pi-chart-bar',
        items: [
          {
            label: 'Cuadro de cuentas',
          },
          {
            label: 'Libro diario',
          },
          {
            label: 'Activos',
          },
          {
            label: 'Pérdidas y ganancias',
          },
          {
            label: 'Balance de situación',
          },
        ],
      },
      {
        label: 'Analítica',
        icon: 'pi pi-wave-pulse',
        items: [
          {
            label: 'Informes',
          },
          {
            label: 'Objetivos',
          },
        ],
      },
    ];
  }

  onLogout(): void {
    this._authService.logout();
    this.router.navigate(['/login']);
  }
}
