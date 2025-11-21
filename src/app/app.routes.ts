import { Routes } from '@angular/router';
import { Menu } from './features/menu/menu';
import { Login } from './features/login/login';
import { Admin } from './features/admin/admin';
import { Itens } from './features/admin/itens/itens';
import { AddItem } from './features/admin/itens/add-item/add-item';
import { AdminHome } from './features/admin/admin-home/admin-home';

export const routes: Routes = [
  {
    path: 'admin',
    component: Admin,
    children: [
      {
        path: '',
        component: AdminHome,
      },
      {
        path: 'itens',
        component: Itens,
      },
      {
        path: 'itens/add',
        component: AddItem,
      },
    ],
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'menu',
    component: Menu,
  },
  {
    path: '',
    redirectTo: 'menu',
    pathMatch: 'full',
  },
];
