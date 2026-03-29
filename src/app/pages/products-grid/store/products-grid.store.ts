import { computed, inject } from '@angular/core';
import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { createProductsGridVm } from './products-grid.vm-builders';
import {
  setError,
  setLoaded,
  setLoading,
  updateState,
  withCallState,
  withDevtools,
} from '@angular-architects/ngrx-toolkit';
import { initialProductsGridSlice } from './product-grid.slice';
import { UIStore } from '../../../store/ui.store';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { productsConfig } from '../../../store/entity.config';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap } from 'rxjs';
import { ProductsService } from '../../../services/products-service';

export const ProductsGridStore = signalStore(
  { providedIn: 'root' },
  withState(initialProductsGridSlice),
  withEntities(productsConfig),
  withCallState(),
  withProps(() => ({
    _productsService: inject(ProductsService),
    _ui: inject(UIStore),
  })),
  withComputed((store) => ({
    vm: computed(() =>
      createProductsGridVm(
        store.productsEntities(),
        store._ui.selectedCategory(),
        store._ui.searchWord(),
      ),
    ),
  })),
  withMethods((store) => ({
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => updateState(store, 'Products loading set', setLoading())),
        switchMap(() =>
          store._productsService.getProducts().pipe(
            tapResponse({
              next: (products) =>
                updateState(
                  store,
                  'Products Loaded',
                  setAllEntities(products, productsConfig),
                  setLoaded(),
                ),
              error: (err) =>
                updateState(store, 'Error loading products', setError(err), setLoaded()),
              finalize: () => updateState(store, 'cleanup products', setLoaded()),
            }),
          ),
        ),
      ),
    ),
  })),
  withHooks((store) => ({
    onInit: () => store.loadProducts(),
  })),
  withDevtools('products-grid-store'),
);
