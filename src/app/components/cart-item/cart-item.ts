import { Component, inject, input } from '@angular/core';
import { type CartItem } from '../../models/cart';
import { CurrencyPipe } from '@angular/common';
import { ProductsService } from '../../services/products-service';

@Component({
  selector: 'app-cart-item',
  imports: [CurrencyPipe],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css',
})
export class CartProduct {
  private readonly productsService = inject(ProductsService);
  readonly item = input.required<CartItem>();

  onIncreaseQuantity(item: CartItem) {
    this.productsService.increaseQuantity(item);
  }

  onDecreaseQuantity(item: CartItem) {
    this.productsService.decreaseQuantity(item);
  }

  onAddToWishlist() {
    this.productsService.addToWishlist(this.item().product.id, false);
    this.productsService.removeFromCart(this.item().product.id, false);
  }

  onRemoveFromCart() {
    this.productsService.removeFromCart(this.item().product.id);
  }
}
