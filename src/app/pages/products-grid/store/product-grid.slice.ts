export interface ProductsGridSlice {
  readonly selectedCategory: string;
}

export const initialProductsGridSlice: ProductsGridSlice = {
  selectedCategory: 'all',
};
