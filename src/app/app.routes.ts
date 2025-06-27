import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@core/guards';
import { LoginComponent } from '@auth/login/login.component';

export const routes: Routes = [
    {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
    title: 'Iniciar Sesión',
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(m => m.RegisterComponent),
    title: 'Registro',
    canActivate: [guestGuard],
  },
  {
    path: '',
    loadComponent: () => import('./shell/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        title: 'Inicio',
        canActivate: [authGuard],
      },
      {
        path: 'sales',
        loadChildren: () => import('./sales/sales.routes').then(m => m.SALES_ROUTES),
        title: 'Ventas',
        canActivate: [authGuard],
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
