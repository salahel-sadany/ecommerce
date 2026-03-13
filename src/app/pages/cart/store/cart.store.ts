import { signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { initialCartSlice } from './cart.slice';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { AppStore } from '../../../store/app.store';
import { createCartVm } from './cart.vm-builders';

export const CartStore = signalStore(
  withState(initialCartSlice),
  withProps(() => ({ _appStore: inject(AppStore) })),
  withComputed(({ _appStore }) => ({
    vm: computed(() => createCartVm(_appStore.cartItemsEntities(), _appStore.wishlistEntities())),
  })),
  withMethods(({ _appStore }) => ({
    setCartItemQuantity: _appStore.setCartItemQuantity,
    addAllWishlistToCart: _appStore.addAllWishlistToCart,
    removeCartItem: _appStore.removeCartItem,
    addToWishlist: _appStore.addCartItemToWishlist,
    proceedToCheckout: _appStore.proceedToCheckout,
    placeOrder: _appStore.placeOrder,
  })),
  withDevtools('cart-store'),
);
