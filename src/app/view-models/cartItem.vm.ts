import { CartItem } from '../models/cartItem.model';

export interface CartItemVM extends CartItem {
  readonly totalPrice: number;
}
