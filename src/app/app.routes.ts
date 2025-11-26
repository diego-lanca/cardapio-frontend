import { Routes } from '@angular/router';
import { Menu } from './features/menu/menu';
import { Admin } from './features/admin/admin';
import { Itens } from './features/admin/itens/itens';
import { AddItem } from './features/admin/itens/add-item/add-item';
import { AdminHome } from './features/admin/admin-home/admin-home';
import { Cart } from './features/cart/cart';

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
    path: 'menu',
    component: Menu,
  },
  {
    path: 'cart',
    component: Cart,
  },
  {
    path: '',
    redirectTo: 'menu',
    pathMatch: 'full',
  },
];
