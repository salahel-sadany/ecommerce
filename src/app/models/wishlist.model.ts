import { Timestamp } from '@angular/fire/firestore';
import { Product } from './product.model';

export interface WishlistItem extends Product {}

export interface FirebaseWishlistItem {
  productId: string;
  createdAt: Timestamp;
}
