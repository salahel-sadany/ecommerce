import { signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { initialWishlistSlice } from './wishlist.slice';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { AppStore } from '../../../store/app.store';
import { createWishlistVm } from './wishlist.vm-builders';

export const WishlistStore = signalStore(
  withState(initialWishlistSlice),
  withProps(() => ({
    _appStore: inject(AppStore),
  })),
  withComputed((store) => ({
    vm: computed(() => createWishlistVm(store._appStore.wishlistEntities())),
  })),
  withMethods((store) => ({
    clearWishlist: store._appStore.clearWishlist,
  })),
  withDevtools('wishlist-store'),
);
