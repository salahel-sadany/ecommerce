import { Product } from '../../../models/product.model';
import { ProductsGridVM } from '../../../view-models/products-grid.vm';

export function createProductsGridVm(
  products: Product[],
  selectedCategory: string,
): ProductsGridVM {
  const filteredProducts = createFilteredProducts();
  const filteredProductsCount = filteredProducts.length;
  const categories = createCategories();

  return { categories, selectedCategory, filteredProducts, filteredProductsCount };

  function createFilteredProducts() {
    const filteredProducts = products.filter((p) =>
      selectedCategory === 'all' ? products : p.category.toLowerCase() === selectedCategory,
    );

    return filteredProducts;
  }

  function createCategories() {
    const categories = ['all', ...new Set(products.map((p) => p.category.toLowerCase()))];
    return categories;
  }
}
