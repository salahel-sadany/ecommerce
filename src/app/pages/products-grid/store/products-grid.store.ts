import { computed, inject } from '@angular/core';
import {
  signalMethod,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { createProductsGridVm } from './products-grid.vm-builders';
import { AppStore } from '../../../store/app.store';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { initialProductsGridSlice } from './product-grid.slice';

export const ProductsGridStore = signalStore(
  withState(initialProductsGridSlice),
  withProps((store) => {
    const _appStore = inject(AppStore);
    const _products = _appStore.productsEntities;

    return {
      _appStore,
      _products,
    };
  }),
  withComputed((store) => ({
    vm: computed(() => createProductsGridVm(store._products(), store.selectedCategory())),
  })),
  withMethods((store) => ({
    setCategory: signalMethod((category: string) =>
      updateState(store, 'Category Update', { selectedCategory: category.toLowerCase() }),
    ),
    isInWishlist: store._appStore.isInWishlist,
  })),
  withDevtools('products-grid-store'),
);
