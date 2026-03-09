import { Routes } from '@angular/router';
import { ProductsGrid } from './pages/products-grid/products-grid';
import { ProductsGridStore } from './pages/products-grid/store/products-grid.store';
import { WishlistStore } from './pages/wishlist/store/wishlist.store';

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
];
