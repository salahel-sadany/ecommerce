import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Component,
  computed,
  contentChild,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe } from '@angular/common';
import { ProductsService } from '../../services/products-service';
import { ToasterService } from '../../services/toaster-service';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  private readonly productsService = inject(ProductsService);
  private readonly toaster = inject(ToasterService);
  readonly product = input.required<Product>();
  readonly wishlistClicked = output<string>();

  isWishlisted = computed(() => this.productsService.isInWishlist(this.product().id));

  onToggleWishlist() {
    if (this.isWishlisted()) {
      this.productsService.removeFromWishlist(this.product().id);
      this.toaster.success('Product is removed from wishlist');
    } else {
      this.productsService.addToWishlist(this.product().id);
      this.toaster.success('Product is added to wishlist');
    }

    this.wishlistClicked.emit(this.product().id);
  }
}
