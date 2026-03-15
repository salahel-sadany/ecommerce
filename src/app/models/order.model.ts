import { CartItem } from './cartItem.model';

export interface Order {
  readonly id: string;
  readonly userId: string;
  readonly total: number;
  readonly items: CartItem[];
  readonly paymentStatus: 'success' | 'failure';
}
