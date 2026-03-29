import { signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { initialAppSlice } from './app.slice';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';

import { Product } from '../models/product.model';
import { createHeaderVm } from './app.vm-builders';

import { AuthStore } from '../auth/store/auth.store';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, exhaustMap, pipe, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { CartService } from '../services/cart-service';

import { WishlistStore } from '../pages/wishlist/store/wishlist.store';
import { CartStore } from '../pages/cart/store/cart.store';
import { createCartVm } from '../pages/cart/store/cart.vm-builders';

export const AppStore = signalStore(
  {
    providedIn: 'root',
  },

  withState(initialAppSlice),
  withProps(() => ({
    _auth: inject(AuthStore),
    _cartService: inject(CartService),
    wishlist: inject(WishlistStore),
    cart: inject(CartStore),
  })),
  withProps((store) => ({})),
  withComputed((store) => ({
    headerVm: computed(() =>
      createHeaderVm(store.wishlist.wishlistIds(), store.cart.cartItemsIds()),
    ),
    cartVm: computed(() =>
      createCartVm(store.cart.cartItemsEntities(), store.wishlist.wishlistEntities()),
    ),
  })),
  withMethods((store) => ({
    // loadOrders: rxMethod<void>(
    //   pipe(
    //     tap(() => updateState(store, 'Orders loading set', setLoading('orders'))),
    //     switchMap(() => {
    //       const userId = store._auth.userId();

    //       if (!userId) {
    //         return of([]).pipe(
    //           tap(() =>
    //             updateState(
    //               store,
    //               'Orders Loaded',
    //               setAllEntities([] as Order[], ordersConfig),
    //               setLoaded('orders'),
    //             ),
    //           ),
    //         );
    //       }

    //       return store._ordersService.getOrders(userId).pipe(
    //         tapResponse({
    //           next: (orders) =>
    //             updateState(
    //               store,
    //               'Orders Loaded',
    //               setAllEntities(orders, ordersConfig),
    //               setLoaded('orders'),
    //             ),
    //           error: (err) =>
    //             updateState(
    //               store,
    //               'Error loading orders',
    //               setError(err, 'orders'),
    //               setLoaded('orders'),
    //             ),
    //           finalize: () => updateState(store, 'Orders loading reset', setLoaded('orders')),
    //         }),
    //       );
    //     }),
    //   ),
    // ),

    isInWishlist: (product: Product) => store.wishlist.wishlistIds().includes(product.id),
    addAllWishlistToCart: rxMethod<void>(
      pipe(
        tap((_) => updateState(store, 'Loading add all to cart set')),
        exhaustMap((_) => {
          const wishlist = store.wishlist.wishlistEntities();
          const userId = store._auth.userId();
          if (!userId) return EMPTY;

          return store._cartService.addAllWishlistToCart(userId, wishlist).pipe(
            tapResponse({
              next: () => updateState(store, 'All wishlistItems added to cart'),
              error: (err) => updateState(store, 'Error adding all wishlistItems to cart'),
              finalize: () => updateState(store, 'Loading adding all wishlistItems to cart reset'),
            }),
          );
        }),
      ),
    ),
    addToCart: store.cart.addToCart,
    addToWishlist: store.wishlist.addToWishlist,
    removeFromWishlist: store.wishlist.removeFromWishlist,
    placeOrder: store.cart.placeOrder,
  })),

  withDevtools('app-store'),
);
