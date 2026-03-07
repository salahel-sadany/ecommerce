import { Product } from '../models/product';

export interface ProductsGridVM {
  readonly filteredProducts: Product[];
  readonly categories: string[];
  readonly selectedCategory: string;
  readonly filteredProductsCount: number;
}
