import { Routes } from '@angular/router';
import { ProductsGrid } from './pages/products-grid/products-grid';
import { ProductsGridStore } from './pages/products-grid/store/products-grid.store';
import { WishlistStore } from './pages/wishlist/store/wishlist.store';
import { CartStore } from './pages/cart/store/cart.store';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products/all',
  },
  {
    path: 'products/:category',
    component: ProductsGrid,
    providers: [ProductsGridStore],
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist'),
    providers: [WishlistStore],
  },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart'), providers: [CartStore] },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout'),
    providers: [CartStore],
  },
  { path: 'order-success', loadComponent: () => import('./pages/order-success/order-success') },
];
