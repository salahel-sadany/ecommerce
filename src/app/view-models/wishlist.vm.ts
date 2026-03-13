import { Product } from '../models/product.model';

export interface WishlistVM {
  wishlistItems: Product[];
  wishlistItemsCount: number;
}
