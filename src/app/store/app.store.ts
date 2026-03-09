import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { initialAppSlice } from './app.slice';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
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
import { PRODUCTS } from '../data/products.const';
import { HotToastService } from '@ngxpert/hot-toast';
import { createAppVm } from './app.vm-builders';
import { cartConfig, productsConfig, wishlistConfig } from './entity.config';

export const AppStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialAppSlice),
  withProps((store) => ({
    _toast: inject(HotToastService),
    _clearWishlist: () => updateState(store, 'Wishlist Cleard', removeAllEntities(wishlistConfig)),
  })),
  withEntities(productsConfig),
  withEntities(wishlistConfig),
  withEntities(cartConfig),
  withComputed((store) => ({
    vm: computed(() => createAppVm(store.wishlistEntities(), store.cartItemsEntities())),
  })),
  withMethods((store) => ({
    addToWishlist: (product: Product) => {
      updateState(store, 'Product Added to Wishlist', addEntity(product, wishlistConfig));
      store._toast.success('Product is added to wishlist');
    },
    removeFromWishlist: (productId: string) => {
      updateState(store, 'Product Removed From Wishlist', removeEntity(productId, wishlistConfig));
      store._toast.success('Product is removed from wishlist');
    },
    isInWishlist: (product: Product) => store.wishlistIds().includes(product.id),
    clearWishlist: store._clearWishlist,
    addTocart: (product: Product) => {
      const isInCart = store.cartItemsIds().includes(product.id);
      if (isInCart) {
        updateState(
          store,
          'Cart Item is Incremented',
          updateEntity(
            { id: product.id, changes: (item) => ({ quantity: item.quantity + 1 }) },
            cartConfig,
          ),
        );
        store._toast.success('Product is added to Cart again');
      } else {
        updateState(
          store,
          'Product is Added To Cart',
          addEntity({ ...product, quantity: 1 }, cartConfig),
        );
        store._toast.success('Product is added to Cart');
      }
    },
    addAllWishlistToCart: () => {
      const newCartItems = store.wishlistEntities().map((item) => ({ ...item, quantity: 1 }));

      updateState(store, 'All wishlist items added to cart', addEntities(newCartItems, cartConfig));

      store._clearWishlist();
    },
    setCartItemQuantity: (itemId: string, quantity: number) =>
      updateState(
        store,
        'Cart item quantity set',
        updateEntity({ id: itemId, changes: { quantity } }, cartConfig),
      ),
  })),
  withHooks((store) => ({
    onInit: () => updateState(store, 'Products Set', setAllEntities(PRODUCTS, productsConfig)),
  })),
  withDevtools('app-store'),
);
