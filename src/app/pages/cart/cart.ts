import { Component, inject } from '@angular/core';
import { BackButton } from '../../components/back-button/back-button';
import { ProductsService } from '../../services/products-service';
import { RouterLink } from '@angular/router';
import { CartProduct } from '../../components/cart-item/cart-item';
import { CurrencyPipe } from '@angular/common';
import { OrderSummary } from '../../components/order-summary/order-summary';

@Component({
  selector: 'app-cart',
  imports: [BackButton, RouterLink, CartProduct, OrderSummary],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export default class Cart {
  private readonly productsService = inject(ProductsService);
  protected readonly cartItems = this.productsService.cartItems;
  protected readonly wishlist = this.productsService.wishlistProducts;

  onAddAlltoCart() {
    this.productsService.addAllToCart();
  }
}
