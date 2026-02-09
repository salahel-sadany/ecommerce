import { Routes } from '@angular/router';
import ProductsGrid from './pages/products-grid/products-grid';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products/all',
  },
  {
    path: 'products/:category',
    // loadComponent: () => import('./pages/products-grid/products-grid'),
    component: ProductsGrid,
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist'),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart'),
  },
];
