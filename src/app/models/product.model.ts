export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly imageUrl: string;
  readonly ratingPoints: number;
  readonly reviewCount: number;
  readonly inStock: boolean;
  readonly category: string;
}
