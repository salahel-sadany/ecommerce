import { Component, inject } from '@angular/core';
import { ViewPanel } from '../../directives/view-panel';
import { CartStore } from '../../pages/cart/store/cart.store';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  imports: [ViewPanel, CurrencyPipe],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummary {
  protected readonly store = inject(CartStore);
}
