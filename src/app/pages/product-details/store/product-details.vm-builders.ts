import { Product } from '../../../models/product.model';
import { ProductDetailsVM } from '../../../view-models/product-details.vm';

export function createProductDetailsVm(products: Product[], productId: string): ProductDetailsVM {
  const product = products.find((p) => p.id === productId);

  return { product };
}
