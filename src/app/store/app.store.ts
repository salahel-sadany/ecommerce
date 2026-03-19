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
  setEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Product } from '../models/product.model';
import { HotToastService } from '@ngxpert/hot-toast';
import { createAppVm } from './app.vm-builders';
import {
  cartConfig,
  ordersConfig,
  productsConfig,
  reviewsConfig,
  wishlistConfig,
} from './entity.config';
import { AddToCartInput, CartItem, setCartItemQuantityInput } from '../models/cartItem.model';
import { MatDialog } from '@angular/material/dialog';
import { SignInDialog } from '../auth/components/sign-in-dialog/sign-in-dialog';
import { AuthStore } from '../auth/store/auth.store';
import { Router } from '@angular/router';
import { Order, PlaceOrderInput } from '../models/order.model';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, exhaustMap, filter, of, pipe, switchMap, take, tap, throttleTime } from 'rxjs';
import { ProductsService } from '../services/products-service';
import { tapResponse } from '@ngrx/operators';
import { WishlistService } from '../services/wishlist-service';
import { CartService } from '../services/cart-service';
import { OrdersService } from '../services/orders-service';
import { WriteReviewInput } from '../models/user-review.model';
import { ReviewsService } from '../services/reviews-service';

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
    _cartService: inject(CartService),
    _ordersService: inject(OrdersService),
    _reviewsService: inject(ReviewsService),
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
          return store._wishlistService.addToWishlist(userId, product.id).pipe(
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
    _removeCartItem: rxMethod<string>(
      pipe(
        tap((_) => updateState(store, 'loading remove cart item set', setLoading('cart'))),
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
                updateState(store, 'Product Removed From cart', setError(err, 'cart'));
                store._toast.error('Product is removed from cart');
              },
              finalize: () =>
                updateState(store, 'Loading remove from cart reset', setLoaded('cart')),
            }),
          );
        }),
      ),
    ),
  })),
  withEntities(productsConfig),
  withEntities(wishlistConfig),
  withEntities(cartConfig),
  withEntities(ordersConfig),
  withEntities(reviewsConfig),
  withCallState({ collections: ['products', 'cart', 'wishlist', 'orders'] }),
  withComputed((store) => ({
    vm: computed(() => createAppVm(store.wishlistIds(), store.cartItemsIds())),
  })),
  withMethods((store) => ({
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => updateState(store, 'Products loading set', setLoading('products'))),
        switchMap(() =>
          store._productsService.getProducts().pipe(
            tapResponse({
              next: (products) =>
                updateState(
                  store,
                  'Products Loaded',
                  setAllEntities(products, productsConfig),
                  setLoaded('products'),
                ),
              error: (err) =>
                updateState(
                  store,
                  'Error loading products',
                  setError(err, 'products'),
                  setLoaded('products'),
                ),
              finalize: () => updateState(store, 'cleanup products', setLoaded('products')),
            }),
          ),
        ),
      ),
    ),
    loadWishlist: rxMethod<void>(
      pipe(
        tap(() => updateState(store, 'wishlist loading set', setLoading('wishlist'))),
        switchMap(() => {
          const userId = store._auth.userId();

          if (!userId) {
            return of([]).pipe(
              tap(() =>
                updateState(
                  store,
                  'Logout: Force Clear Wishlist',
                  setAllEntities([] as Product[], wishlistConfig),
                  setLoaded('wishlist'),
                ),
              ),
            );
          }

          return store._wishlistService.getWishlist(userId).pipe(
            tapResponse({
              next: (products) => {
                updateState(
                  store,
                  'Wishlist Loaded',
                  setAllEntities(products, wishlistConfig),
                  setLoaded('wishlist'),
                );
              },
              error: (err) =>
                updateState(
                  store,
                  'Error loading wishlist',
                  setError(err, 'wishlist'),
                  setLoaded('wishlist'),
                ),
              finalize: () => updateState(store, 'wishlist loading reset', setLoaded('wishlist')),
            }),
          );
        }),
      ),
    ),
    loadCartItems: rxMethod<void>(
      pipe(
        tap(() => updateState(store, 'Cart loading set', setLoading('cart'))),
        switchMap(() => {
          const userId = store._auth.userId();

          if (!userId) {
            return of([]).pipe(
              tap(() =>
                updateState(
                  store,
                  'Cart Loaded',
                  setAllEntities([] as CartItem[], cartConfig),
                  setLoaded('cart'),
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
                  setLoaded('cart'),
                ),
              error: (err) =>
                updateState(store, 'Error loading Cart', setError(err, 'cart'), setLoaded('cart')),
              finalize: () => updateState(store, 'Cart loading reset', setLoaded('cart')),
            }),
          );
        }),
      ),
    ),
    loadOrders: rxMethod<void>(
      pipe(
        tap(() => updateState(store, 'Orders loading set', setLoading('orders'))),
        switchMap(() => {
          const userId = store._auth.userId();

          if (!userId) {
            return of([]).pipe(
              tap(() =>
                updateState(
                  store,
                  'Orders Loaded',
                  setAllEntities([] as Order[], ordersConfig),
                  setLoaded('orders'),
                ),
              ),
            );
          }

          return store._ordersService.getOrders(userId).pipe(
            tapResponse({
              next: (orders) =>
                updateState(
                  store,
                  'Orders Loaded',
                  setAllEntities(orders, ordersConfig),
                  setLoaded('orders'),
                ),
              error: (err) =>
                updateState(
                  store,
                  'Error loading orders',
                  setError(err, 'orders'),
                  setLoaded('orders'),
                ),
              finalize: () => updateState(store, 'Orders loading reset', setLoaded('orders')),
            }),
          );
        }),
      ),
    ),
    loadReviews: rxMethod<void>(
      pipe(
        switchMap((_) =>
          store._reviewsService.getReviews().pipe(
            tapResponse({
              next: (reviews) =>
                updateState(store, 'Reviews loaded', setAllEntities(reviews, reviewsConfig)),
              error: () => updateState(store, 'error loading reviews'),
            }),
          ),
        ),
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
    addToCart: rxMethod<AddToCartInput>(
      pipe(
        tap((_) => updateState(store, 'Loading add to cart set', setLoading('cart'))),
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
              error: (err) => updateState(store, 'Error adding cart item', setError(err, 'cart')),
              finalize: () => updateState(store, 'loading add to cart reset', setLoaded('cart')),
            }),
          );
        }),
      ),
    ),
    addAllWishlistToCart: rxMethod<void>(
      pipe(
        tap((_) => updateState(store, 'Loading add all to cart set', setLoading('cart'))),
        exhaustMap((_) => {
          const wishlist = store.wishlistEntities();
          const userId = store._auth.userId();
          if (!userId) return EMPTY;

          return store._cartService.addAllWishlistToCart(userId, wishlist).pipe(
            tapResponse({
              next: () => updateState(store, 'All wishlistItems added to cart'),
              error: (err) =>
                updateState(store, 'Error adding all wishlistItems to cart', setError(err, 'cart')),
              finalize: () =>
                updateState(
                  store,
                  'Loading adding all wishlistItems to cart reset',
                  setLoaded('cart'),
                ),
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
    removeCartItem: store._removeCartItem,
    addCartItemToWishlist: rxMethod<CartItem>(
      pipe(
        tap((_) => updateState(store, 'Loading add cartItem to wishlist set', setLoading('cart'))),
        exhaustMap((item) => {
          const userId = store._auth.userId();
          const product = store.productsEntities().find((p) => p.id === item.productId);

          if (!userId || !product) return EMPTY;

          return store._cartService.addCartItemToWishlist(userId, product).pipe(
            tapResponse({
              next: () => updateState(store, 'cartItem is added to wishlist'),
              error: (err) =>
                updateState(store, 'Error adding cartItem to wishlist', setError(err, 'cart')),
              finalize: () =>
                updateState(store, 'Loading adding cartItem to wishlist reset', setLoaded('cart')),
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
        tap((_) => updateState(store, 'Loading place orders set', setLoading('orders'))),
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
              error: (err) => updateState(store, 'Error placing an order', setError(err, 'orders')),
              finalize: () => updateState(store, 'Loading place order reset', setLoaded('orders')),
            }),
          );
        }),
      ),
    ),

    addReview: rxMethod<WriteReviewInput>(
      pipe(
        exhaustMap((revForm) => {
          const user = store._auth.user();
          if (!user) return EMPTY;

          return store._reviewsService.addReview(user, revForm);
        }),
      ),
    ),
  })),

  withHooks((store) => ({
    onInit: () => {
      store.loadProducts();
      store.loadReviews();

      toObservable(store._auth.user).subscribe(() => {
        store.loadWishlist();
        store.loadCartItems();
        store.loadOrders();
      });
    },
  })),
  withDevtools('app-store'),
);
