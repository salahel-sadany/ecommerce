import { Component, input, output, signal } from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  readonly product = input.required<Product>();
  addedToWishlist = output<string>();
  removedFromWishlist = output<string>();
  isWishlisted = signal(false);

  onToggleWishlist() {
    if (this.isWishlisted()) {
      this.removedFromWishlist.emit(this.product().id);
    } else {
      this.addedToWishlist.emit(this.product().id);
    }
    this.isWishlisted.update(() => !this.isWishlisted());
  }
}
