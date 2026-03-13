import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-stock-status',
  imports: [MatIcon],
  templateUrl: './stock-status.html',
  styleUrl: './stock-status.scss',
})
export class StockStatus {
  readonly inStock = input.required<boolean>();
}
