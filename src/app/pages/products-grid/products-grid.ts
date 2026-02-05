import { Component, input, signal, input as routerInput, computed, inject } from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ProductCard } from '../../components/product-card/product-card';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductsService } from '../../services/products-service';

@Component({
  selector: 'app-products-grid',
  imports: [ProductCard, TitleCasePipe],
  templateUrl: './products-grid.html',
  styleUrl: './products-grid.css',
})
export default class ProductsGrid {
  protected readonly productsService = inject(ProductsService);
  protected readonly products = this.productsService.products;
  protected readonly categories = this.productsService.categories;

  protected readonly category = routerInput.required<string>();

  protected readonly filteredProducts = computed(() =>
    this.category() === 'all'
      ? this.products()
      : this.products().filter((p) => p.category.toLowerCase() === this.category().toLowerCase()),
  );
}
