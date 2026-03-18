import { Timestamp } from '@angular/fire/firestore';
import { CartItem } from './cartItem.model';

export interface Order {
  readonly id: string;
  readonly userId: string;
  readonly total: number;
  readonly items: CartItem[];
  readonly paymentStatus: 'success' | 'failure' | 'pending';
  readonly createdAt: Timestamp;
  readonly shippingAddress?: string | null;
}

export interface PlaceOrderInput {
  readonly cartItems: CartItem[];
  readonly shippingAddress?: string | null;
}
