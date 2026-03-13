import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-qty-selector',
  imports: [MatIconButton, MatIcon],
  templateUrl: './qty-selector.html',
  styleUrl: './qty-selector.scss',
})
export class QtySelector {
  readonly quantity = input.required<number>();
  readonly quantityUpdated = output<number>();
}
