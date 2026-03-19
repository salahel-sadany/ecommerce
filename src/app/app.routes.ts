import { Routes } from '@angular/router';
import { ProductsGrid } from './pages/products-grid/products-grid';
import { ProductsGridStore } from './pages/products-grid/store/products-grid.store';
import { WishlistStore } from './pages/wishlist/store/wishlist.store';
import { CartStore } from './pages/cart/store/cart.store';
import { ProductDetailsStore } from './pages/product-details/store/product-details.store';
import { authGuard } from './guard/auth-guard';

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
    path: 'product/:productId',
    loadComponent: () => import('./pages/product-details/product-details'),
    providers: [ProductDetailsStore],
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist'),
    providers: [WishlistStore],
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart'),
    providers: [CartStore],
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout'),
    providers: [CartStore],
    canActivate: [authGuard],
  },
  {
    path: 'order-success',
    loadComponent: () => import('./pages/order-success/order-success'),
    canActivate: [authGuard],
  },
];
