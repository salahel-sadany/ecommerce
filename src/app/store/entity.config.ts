import { type } from '@ngrx/signals';
import { entityConfig } from '@ngrx/signals/entities';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cartItem.model';
import { Order } from '../models/order.model';
import { collection } from '@angular/fire/firestore';
import { UserReview } from '../models/user-review.model';

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

export const cartConfig = entityConfig({
  entity: type<CartItem>(),
  collection: 'cartItems',
  selectId: (item) => item.productId,
});

export const ordersConfig = entityConfig({
  entity: type<Order>(),
  collection: 'orders',
  selectId: (order) => order.id,
});

export const reviewsConfig = entityConfig({
  entity: type<UserReview>(),
  collection: 'reviews',
  selectId: (rev) => rev.id,
});
