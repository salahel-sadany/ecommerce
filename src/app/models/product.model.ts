import { UserReview } from './user-review.model';

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly imageUrl: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly inStock: boolean;
  readonly category: string;
}
