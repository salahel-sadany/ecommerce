import { CartItem } from '../../../models/cartItem.model';
import { Product } from '../../../models/product.model';
import { CartVM } from '../../../view-models/cart.vm';
import { CartItemVM } from '../../../view-models/cartItem.vm';

export function createCartVm(cartItems: CartItem[], wishlistItems: Product[]): CartVM {
  const subtotal = calcSubtotal();
  const tax = 0.05 * subtotal;
  const total = subtotal + tax;

  return {
    cartItems: createCartItems(),
    cartItemsCount: cartItems.length,
    wishlistItemsCount: wishlistItems.length,
    subtotal,
    tax,
    total,
  };

  function calcSubtotal() {
    return cartItems.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
  }

  function createCartItems(): CartItemVM[] {
    return cartItems.map((item) => {
      const totalPrice = item.quantity * item.price;

      return { ...item, totalPrice };
    });
  }
}
