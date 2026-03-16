import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { initialAppSlice } from './app.slice';
import {
  setError,
  setLoaded,
  setLoading,
  updateState,
  withCallState,
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  addEntities,
  addEntity,
  removeAllEntities,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Product } from '../models/product.model';
import { HotToastService } from '@ngxpert/hot-toast';
import { createAppVm } from './app.vm-builders';
import { cartConfig, productsConfig, wishlistConfig } from './entity.config';
import { CartItem } from '../models/cartItem.model';
import { MatDialog } from '@angular/material/dialog';
import { SignInDialog } from '../auth/components/sign-in-dialog/sign-in-dialog';
import { AuthStore } from '../auth/store/auth.store';
import { Router } from '@angular/router';
import { Order } from '../models/order.model';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, exhaustMap, filter, pipe, switchMap, take, tap } from 'rxjs';
import { ProductsService } from '../services/products-service';
import { tapResponse } from '@ngrx/operators';
import { WishlistService } from '../services/wishlist-service';

export const AppStore = signalStore(
  {
    providedIn: 'root',
  },

  withState(initialAppSlice),
  withProps(() => ({
    _toast: inject(HotToastService),
    _dialog: inject(MatDialog),
    _auth: inject(AuthStore),
    _router: inject(Router),
    _productsService: inject(ProductsService),
    _wishlistService: inject(WishlistService),
  })),
  withProps((store) => ({
    _clearWishlist: rxMethod<void>(
      pipe(
        tap((_) => updateState(store, 'Loading clear set', setLoading('wishlist'))),
        exhaustMap(() => {
          const userId = store._auth.userId();
          if (!userId) return EMPTY;

          return store._wishlistService.clearWishlist(userId).pipe(
            tapResponse({
              next: () => {
                updateState(
                  store,
                  'Wishlist cleared',
                  // removeEntity(productId, wishlistConfig),
                );
              },
              error: (err) => {
                updateState(store, 'Error clearing wishlist', setError(err, 'wishlist'));
                store._toast.error('Clearing wishlist failed');
              },
              finalize: () =>
                updateState(store, 'Loading clear wishlist reset', setLoaded('wishlist')),
            }),
          );
        }),
      ),
    ),
    _addToWishlist: rxMethod<Product>(
      pipe(
        tap((_) => updateState(store, 'Loading add to wishlist set', setLoading('wishlist'))),
        exhaustMap((product) => {
          const userId = store._auth.userId();
          if (!userId) {
            // store._toast.error('You must be logged in to add to wishlist');
            store._dialog.open(SignInDialog, {
              disableClose: true,
            });
            return EMPTY;
          }
          return store._wishlistService.addToWishlist(userId, product).pipe(
            tapResponse({
              next: () => store._toast.success('Product is added to wishlist'),
              error: (err) =>
                updateState(store, 'Error adding wishlist item', setError(err, 'wishlist')),
              finalize: () =>
                updateState(store, 'loading add to wishlist reset', setLoaded('wishlist')),
            }),
          );
        }),
      ),
    ),
    _removeCartItem: (itemId: string) =>
      updateState(store, 'Cart Item is removed', removeEntity(itemId, cartConfig)),
  })),
  withEntities(productsConfig),
  withEntities(wishlistConfig),
  withEntities(cartConfig),
  withCallState({ collections: ['products', 'cart', 'wishlist'] }),
  withComputed((store) => ({
    vm: computed(() => createAppVm(store.wishlistEntities(), store.cartItemsEntities())),
  })),
  withMethods((store) => ({
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => updateState(store, 'Products loading set', setLoading('products'))),
        exhaustMap(() =>
          store._productsService.getProducts().pipe(
            tapResponse({
              next: (products) =>
                updateState(store, 'Products Loaded', setAllEntities(products, productsConfig)),
              error: (err) =>
                updateState(store, 'Error loading products', setError(err, 'products')),
              finalize: () => updateState(store, 'Products loading reset', setLoaded('products')),
            }),
          ),
        ),
      ),
    ),

    loadWishlist: rxMethod<void>(
      pipe(
        tap(() => updateState(store, 'wishlist loading set', setLoading('wishlist'))),
        exhaustMap(() => {
          const userId = store._auth.userId();

          if (!userId) return EMPTY;

          return store._wishlistService.getWishlist(userId).pipe(
            tapResponse({
              next: (products) =>
                updateState(store, 'Wishlist Loaded', setAllEntities(products, wishlistConfig)),
              error: (err) =>
                updateState(store, 'Error loading wishlist', setError(err, 'wishlist')),
              finalize: () => updateState(store, 'wishlist loading reset', setLoaded('wishlist')),
            }),
          );
        }),
      ),
    ),

    addToWishlist: (product: Product) => {
      store._addToWishlist(product);
    },
    removeFromWishlist: rxMethod<string>(
      pipe(
        tap((_) => updateState(store, 'Loading remove from wishlist set', setLoading('wishlist'))),
        exhaustMap((productId) => {
          const userId = store._auth.userId();
          if (!userId) return EMPTY;

          return store._wishlistService.removeFromWishlist(userId, productId).pipe(
            tapResponse({
              next: () => {
                updateState(
                  store,
                  'Product Removed From Wishlist',
                  removeEntity(productId, wishlistConfig),
                );
                store._toast.success('Product is removed from wishlist');
              },
              error: (err) => {
                updateState(store, 'Product Removed From Wishlist', setError(err, 'wishlist'));
                store._toast.error('Product is removed from wishlist');
              },
              finalize: () =>
                updateState(store, 'Loading remove from wishlist reset', setLoaded('wishlist')),
            }),
          );
        }),
      ),
    ),
    isInWishlist: (product: Product) => store.wishlistIds().includes(product.id),
    clearWishlist: store._clearWishlist,
    addToCart: (product: Product, quantity = 1) => {
      const isInCart = store.cartItemsIds().includes(product.id);
      if (isInCart) {
        updateState(
          store,
          'Cart Item is Incremented',
          updateEntity(
            { id: product.id, changes: (item) => ({ quantity: item.quantity + quantity }) },
            cartConfig,
          ),
        );
        store._toast.success('Product is added to Cart again');
      } else {
        updateState(
          store,
          'Product is Added To Cart',
          addEntity({ ...product, quantity }, cartConfig),
        );
        store._toast.success('Product is added to Cart');
      }
    },
    addAllWishlistToCart: () => {
      const newCartItems = store.wishlistEntities().map((item) => ({ ...item, quantity: 1 }));

      updateState(store, 'All wishlist items added to cart', addEntities(newCartItems, cartConfig));

      store._clearWishlist();
    },
    setCartItemQuantity: (itemId: string, quantity: number) => {
      updateState(
        store,
        'Cart item quantity set',
        updateEntity({ id: itemId, changes: { quantity } }, cartConfig),
      );
    },
    removeCartItem: store._removeCartItem,
    addCartItemToWishlist: (item: CartItem) => {
      const { quantity, ...product } = item;

      store._addToWishlist(product);
      store._removeCartItem(item.id);
    },
    proceedToCheckout: () => {
      if (store._auth.user()) {
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
    placeOrder: () => {
      const user = store._auth.user();

      if (!user) {
        store._toast.error('Please login to place an order');
        return;
      }

      const order: Order = {
        id: crypto.randomUUID(),
        userId: user?.id || '',
        total: store.cartItemsEntities().reduce((tot, item) => tot + item.quantity * item.price, 0),
        items: store.cartItemsEntities(),
        paymentStatus: 'success',
      };

      updateState(store, 'Order is placed successfully', removeAllEntities(cartConfig));
      store._router.navigate(['order-success']);
    },
  })),

  withHooks((store) => ({
    onInit: () => {
      store.loadProducts();
      toObservable(store._auth.user)
        .pipe(
          filter((user) => !!user),
          take(1),
        )
        .subscribe((user) => store.loadWishlist());
    },
  })),
  withDevtools('app-store'),
);
