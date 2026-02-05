import { Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products-service';
import { ProductCard } from '../../components/product-card/product-card';
import { BackButton } from '../../components/back-button/back-button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [ProductCard, BackButton, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export default class Wishlist {
  private readonly productsService = inject(ProductsService);
  protected readonly wishlist = this.productsService.wishlistProducts;

  onClearWishlist() {
    this.productsService.clearWishlist();
  }
}
