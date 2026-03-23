import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { QtySelector } from '../../../../components/qty-selector/qty-selector';
import { CartStore } from '../../store/cart.store';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { CartItemVM } from '../../../../view-models/cartItem.vm';
import { CartItem } from '../../../../models/cartItem.model';
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-cart-list-item',
  imports: [CurrencyPipe, QtySelector, MatIcon, MatIconButton],
  templateUrl: './cart-list-item.html',
  styleUrl: './cart-list-item.scss',
})
export class CartListItem {
  protected readonly store = inject(CartStore);
  protected readonly appStore = inject(AppStore);
  readonly item = input.required<CartItemVM>();
  readonly cartItem = computed<CartItem>(() => {
    const { totalPrice, ...cartItem } = this.item();
    return cartItem;
  });
}
