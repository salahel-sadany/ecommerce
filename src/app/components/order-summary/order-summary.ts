import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ProductsService } from '../../services/products-service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  imports: [CurrencyPipe],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css',
})
export class OrderSummary {
  private readonly productsService = inject(ProductsService);
  protected readonly price = this.productsService.cartPrice;
}
