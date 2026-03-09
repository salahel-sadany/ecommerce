import { CartItem } from '../models/cartItem.model';
import { Product } from '../models/product.model';
import { AppVM } from '../view-models/app.vm';

export function createAppVm(wishlist: Product[], cartItems: CartItem[]): AppVM {
  return {
    cartItemsCount: cartItems.length,
    wishlistCount: wishlist.length,
  };
}
