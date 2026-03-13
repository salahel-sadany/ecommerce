export interface ProductsGridSlice {
  readonly selectedCategory: string;
  readonly isSidenavOpen: boolean;
}

export const initialProductsGridSlice: ProductsGridSlice = {
  selectedCategory: 'all',
  isSidenavOpen: false,
};
