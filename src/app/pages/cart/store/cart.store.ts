import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { initialCartSlice } from './cart.slice';
import {
  setError,
  setLoaded,
  setLoading,
  updateState,
  withCallState,
  withDevtools,
} from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { cartConfig } from '../../../store/entity.config';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, exhaustMap, EMPTY, switchMap, of } from 'rxjs';
import { SignInDialog } from '../../../auth/components/sign-in-dialog/sign-in-dialog';
import { AddToCartInput, setCartItemQuantityInput, CartItem } from '../../../models/cartItem.model';
import { AuthStore } from '../../../auth/store/auth.store';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from '../../../services/cart-service';
import { HotToastService } from '@ngxpert/hot-toast';
import { Router } from '@angular/router';
import { OrdersService } from '../../../services/orders-service';
import { toObservable } from '@angular/core/rxjs-interop';

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialCartSlice),
  withEntities(cartConfig),
  withCallState(),
  withProps(() => ({
    _auth: inject(AuthStore),
    _dialog: inject(MatDialog),
    _cartService: inject(CartService),
    _toast: inject(HotToastService),
    _router: inject(Router),
    _ordersService: inject(OrdersService),
  })),
  withComputed((store) => ({})),
  withMethods((store) => ({
    loadCartItems: rxMethod<void>(
      pipe(
        tap(() => updateState(store, 'Cart loading set', setLoading())),
        switchMap(() => {
          const userId = store._auth.userId();

          if (!userId) {
            return of([]).pipe(
              tap(() =>
                updateState(
                  store,
                  'Cart Loaded',
                  setAllEntities([] as CartItem[], cartConfig),
                  setLoaded(),
                ),
              ),
            );
          }

          return store._cartService.getCartItems(userId).pipe(
            tapResponse({
              next: (cartItems) =>
                updateState(
                  store,
                  'Cart Loaded',
                  setAllEntities(cartItems, cartConfig),
                  setLoaded(),
                ),
              error: (err) => updateState(store, 'Error loading Cart', setError(err), setLoaded()),
              finalize: () => updateState(store, 'Cart loading reset', setLoaded()),
            }),
          );
        }),
      ),
    ),

    addToCart: rxMethod<AddToCartInput>(
      pipe(
        tap((_) => updateState(store, 'Loading add to cart set', setLoading())),
        exhaustMap(({ product, quantity = 1 }) => {
          const userId = store._auth.userId();
          if (!userId) {
            // store._toast.error('You must be logged in to add to cart');
            store._dialog.open(SignInDialog, {
              disableClose: true,
            });
            return EMPTY;
          }
          return store._cartService.addToCart(userId, product, quantity).pipe(
            tapResponse({
              next: () => store._toast.success('Product is added to cart'),
              error: (err) => updateState(store, 'Error adding cart item', setError(err)),
              finalize: () => updateState(store, 'loading add to cart reset', setLoaded()),
            }),
          );
        }),
      ),
    ),

    setCartItemQuantity: rxMethod<setCartItemQuantityInput>(
      pipe(
        switchMap(({ productId, quantity }) => {
          const userId = store._auth.userId();
          if (!userId) return EMPTY;

          return store._cartService.setCartItemQuantity(userId, productId, quantity);
        }),
      ),
    ),
    removeCartItem: rxMethod<string>(
      pipe(
        tap((_) => updateState(store, 'loading remove cart item set', setLoading())),
        exhaustMap((itemId) => {
          const userId = store._auth.userId();
          if (!userId) return EMPTY;

          return store._cartService.removeCartItem(userId, itemId).pipe(
            tapResponse({
              next: () => {
                updateState(store, 'Product Removed From cart');
                store._toast.success('Product is removed from cart');
              },
              error: (err) => {
                updateState(store, 'Product Removed From cart', setError(err));
                store._toast.error('Product is removed from cart');
              },
              finalize: () => updateState(store, 'Loading remove from cart reset', setLoaded()),
            }),
          );
        }),
      ),
    ),
    addCartItemToWishlist: rxMethod<CartItem>(
      pipe(
        tap((_) => updateState(store, 'Loading add cartItem to wishlist set', setLoading())),
        exhaustMap((item) => {
          const userId = store._auth.userId();

          if (!userId || !item) return EMPTY;

          return store._cartService.addCartItemToWishlist(userId, item).pipe(
            tapResponse({
              next: () => updateState(store, 'cartItem is added to wishlist'),
              error: (err) =>
                updateState(store, 'Error adding cartItem to wishlist', setError(err)),
              finalize: () =>
                updateState(store, 'Loading adding cartItem to wishlist reset', setLoaded()),
            }),
          );
        }),
      ),
    ),
    proceedToCheckout: () => {
      if (store._auth.isLoggedIn()) {
        store._router.navigate(['checkout']);
        return;
      }

      store._dialog.open(SignInDialog, {
        disableClose: true,
        data: {
          checkout: true,
        },
      });
    },
    placeOrder: rxMethod<string | undefined>(
      pipe(
        tap((_) => updateState(store, 'Loading place orders set')),
        exhaustMap((shippingAddress) => {
          const userId = store._auth.userId();
          if (!userId) {
            store._toast.error('Please login to place an order');
            return EMPTY;
          }

          const cartItems = store.cartItemsEntities();

          return store._ordersService.placeOrder(userId, cartItems, shippingAddress).pipe(
            tapResponse({
              next: () => {
                updateState(store, 'Order is placed');
                store._router.navigate(['order-success']);
              },
              error: (err) => updateState(store, 'Error placing an order'),
              finalize: () => updateState(store, 'Loading place order reset'),
            }),
          );
        }),
      ),
    ),
  })),
  withHooks((store) => ({
    onInit: () => {
      toObservable(store._auth.user).subscribe(() => {
        store.loadCartItems();
        // store.loadOrders();
      });
    },
  })),
  withDevtools('cart-store'),
);
