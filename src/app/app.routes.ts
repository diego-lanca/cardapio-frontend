import { Routes } from '@angular/router';
import { Menu } from './features/menu/menu';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: 'menu',
    component: Menu,
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
