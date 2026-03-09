import { Component, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { QtySelector } from '../qty-selector/qty-selector';
import { CartStore } from '../../store/cart.store';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { CartItemVM } from '../../../../view-models/cartItem.vm';

@Component({
  selector: 'app-cart-list-item',
  imports: [CurrencyPipe, QtySelector, MatIcon, MatIconButton],
  templateUrl: './cart-list-item.html',
  styleUrl: './cart-list-item.scss',
})
export class CartListItem {
  protected readonly store = inject(CartStore);
  readonly item = input.required<CartItemVM>();
}
