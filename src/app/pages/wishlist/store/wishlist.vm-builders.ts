import { Product } from '../../../models/product.model';
import { WishlistVM } from '../../../view-models/wishlist.vm';

export function createWishlistVm(wishlistItems: Product[]): WishlistVM {
  return { wishlistItems, wishlistItemsCount: wishlistItems.length };
}
