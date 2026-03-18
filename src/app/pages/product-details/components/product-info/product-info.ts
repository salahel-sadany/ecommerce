import { Component, computed, inject, input, signal } from '@angular/core';
import { Product } from '../../../../models/product.model';
import { CurrencyPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { StockStatus } from '../stock-status/stock-status';
import { MatDivider } from '@angular/material/divider';
import { QtySelector } from '../../../../components/qty-selector/qty-selector';
import { MatIcon } from '@angular/material/icon';
import { ProductDetailsStore } from '../../store/product-details.store';
import { MatButton, MatIconButton } from '@angular/material/button';
import { StarRating } from '../../../../components/star-rating/star-rating';

@Component({
  selector: 'app-product-info',
  imports: [
    TitleCasePipe,
    CurrencyPipe,
    StockStatus,
    MatDivider,
    QtySelector,
    MatIcon,
    MatButton,
    MatIconButton,
    StarRating,
    DecimalPipe,
  ],
  templateUrl: './product-info.html',
  styleUrl: './product-info.scss',
})
export class ProductInfo {
  protected readonly store = inject(ProductDetailsStore);
  readonly product = input.required<Product>();
  protected readonly quantity = signal(1);

  protected readonly avgRating = computed(() => {
    if (this.product().reviewCount) return this.product().ratingPoints / this.product().reviewCount;
    else return 0;
  });

  toggleWishlist() {
    const isInWishlist = this.store.isInWishlist(this.product());

    if (isInWishlist) this.store.removeFromWishlist(this.product().id);
    else this.store.addToWishlist(this.product());
  }
}
