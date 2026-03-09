import { Product } from '../models/product';

export interface WishlistVM {
  wishlistItems: Product[];
  wishlistItemsCount: number;
}
