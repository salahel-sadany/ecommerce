import {
  signalMethod,
  signalStore,
  type,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { initialAppSlice } from './app.slice';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import { entityConfig, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { Product } from '../models/product';
import { PRODUCTS } from '../data/products.const';

const productsConfig = entityConfig({
  entity: type<Product>(),
  collection: 'products',
  selectId: (product) => product.id,
});

export const AppStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialAppSlice),
  withEntities(productsConfig),
  withComputed((store) => ({})),
  withMethods((store) => ({})),
  withHooks((store) => ({
    onInit: () => updateState(store, 'Products Set', setAllEntities(PRODUCTS, productsConfig)),
  })),
  withDevtools('app-store'),
);
