import { Component, inject } from '@angular/core';
import { ViewPanel } from '../../directives/view-panel';
import { CurrencyPipe } from '@angular/common';
import { AppStore } from '../../store/app.store';

@Component({
  selector: 'app-order-summary',
  imports: [ViewPanel, CurrencyPipe],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummary {
  protected readonly appStore = inject(AppStore);
}
