import { Component, inject, input as inputRoute } from '@angular/core';
import { ProductDetailsStore } from './store/product-details.store';
import { BackButton } from '../../components/back-button/back-button';
import { ProductInfo } from './components/product-info/product-info';
import { StockStatus } from './components/stock-status/stock-status';
import { ProductReviews } from './components/product-reviews/product-reviews';

@Component({
  selector: 'app-product-details',
  imports: [BackButton, ProductInfo, ProductReviews],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export default class ProductDetails {
  protected readonly store = inject(ProductDetailsStore);
  protected readonly productId = inputRoute.required<string>();

  constructor() {
    this.store.setProductId(this.productId);
  }
}
