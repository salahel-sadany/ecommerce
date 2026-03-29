import { Component, inject } from '@angular/core';
import { ViewPanel } from '../../../../directives/view-panel';
import { CartStore } from '../../store/cart.store';
import { CartListItem } from '../cart-list-item/cart-list-item';
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-cart-items-list',
  imports: [ViewPanel, CartListItem],
  templateUrl: './cart-items-list.html',
  styleUrl: './cart-items-list.scss',
})
export class CartItemsList {
  protected readonly appStore = inject(AppStore);
  protected readonly store = inject(CartStore);
}
