import { Product } from './product.model';

export interface CartItem extends Product {
  readonly quantity: number;
}

// export interface CartItem {
//   readonly productId: string;
//   readonly name: string;
//   readonly price: number;
//   readonly imageUrl: string;
//   readonly quantity: number;
// }
