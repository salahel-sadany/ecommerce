import { type } from '@ngrx/signals';
import { entityConfig } from '@ngrx/signals/entities';
import { Product } from '../models/product';

export const productsConfig = entityConfig({
  entity: type<Product>(),
  collection: 'products',
  selectId: (product) => product.id,
});

export const wishlistConfig = entityConfig({
  entity: type<Product>(),
  collection: 'wishlist',
  selectId: (product) => product.id,
});
