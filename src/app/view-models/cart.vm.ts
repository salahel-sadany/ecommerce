import { CartItemVM } from './cartItem.vm';

export interface CartVM {
  readonly cartItems: CartItemVM[];
  readonly cartItemsCount: number;
  readonly wishlistItemsCount: number;
  readonly subtotal: number;
  readonly tax: number;
  readonly total: number;
}
