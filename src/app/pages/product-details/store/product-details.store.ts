import {
  signalMethod,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { initialProductDetailsSlice } from './product-details.slice';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { createProductDetailsVm } from './product-details.vm-builders';
import { AppStore } from '../../../store/app.store';
import { ProductsGridStore } from '../../products-grid/store/products-grid.store';

import { AuthStore } from '../../../auth/store/auth.store';
import { ReviewsService } from '../../../services/reviews-service';

export const ProductDetailsStore = signalStore(
  withState(initialProductDetailsSlice),
  withProps(() => ({
    _appStore: inject(AppStore),
    _products: inject(ProductsGridStore),
    _auth: inject(AuthStore),
    _reviewsService: inject(ReviewsService),
  })),
  withComputed((store) => ({
    vm: computed(() =>
      createProductDetailsVm(store._products.productsEntities(), store.selectedProductId()),
    ),
  })),
  withMethods((store) => ({
    setProductId: signalMethod((productId: string) =>
      updateState(store, 'Product id is set', { selectedProductId: productId }),
    ),
    addToCart: store._appStore.addToCart,
    addToWishlist: store._appStore.addToWishlist,
    removeFromWishlist: store._appStore.removeFromWishlist,
    isInWishlist: store._appStore.isInWishlist,
  })),
  withDevtools('product-details-store'),
);
