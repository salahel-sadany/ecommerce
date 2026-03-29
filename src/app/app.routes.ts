import { Routes } from '@angular/router';
import { ProductDetailsStore } from './pages/product-details/store/product-details.store';
import { authGuard } from './guard/auth-guard';
import { ReviewsStore } from './pages/product-details/store/reviews.store';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products/all',
  },
  {
    path: 'products/:category',
    loadComponent: () => import('./pages/products-grid/products-grid'),
  },
  {
    path: 'product/:productId',
    loadComponent: () => import('./pages/product-details/product-details'),
    providers: [ProductDetailsStore, ReviewsStore],
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist'),
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart'),
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout'),
    canActivate: [authGuard],
  },
  {
    path: 'order-success',
    loadComponent: () => import('./pages/order-success/order-success'),
    canActivate: [authGuard],
  },
];
