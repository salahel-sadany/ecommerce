import { Product } from '../models/product';
import { AppVM } from '../view-models/app.vm';

export function createAppVm(wishlist: Product[]): AppVM {
  return {
    cartItemsCount: 0,
    wishlistCount: wishlist.length,
  };
}
