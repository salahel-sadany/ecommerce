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
  addEntity,
  removeAllEntities,
  removeEntity,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { Product } from '../models/product';
import { PRODUCTS } from '../data/products.const';
import { HotToastService } from '@ngxpert/hot-toast';
import { createAppVm } from './app.vm-builders';
import { productsConfig, wishlistConfig } from './entity.config';

export const AppStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialAppSlice),
  withProps((store) => {
    return {
      _toast: inject(HotToastService),
    };
  }),
  withEntities(productsConfig),
  withEntities(wishlistConfig),
  withComputed((store) => ({
    vm: computed(() => createAppVm(store.wishlistEntities())),
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
    clearWishlist: () => updateState(store, 'Wishlist Cleard', removeAllEntities(wishlistConfig)),
  })),
  withHooks((store) => ({
    onInit: () => updateState(store, 'Products Set', setAllEntities(PRODUCTS, productsConfig)),
  })),
  withDevtools('app-store'),
);
