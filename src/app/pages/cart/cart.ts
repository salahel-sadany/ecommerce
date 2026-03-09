import { Component, inject } from '@angular/core';
import { BackButton } from '../../components/back-button/back-button';
import { CartItemsList } from './components/cart-items-list/cart-items-list';
import { TeaseWishlist } from './components/tease-wishlist/tease-wishlist';
import { CartStore } from './store/cart.store';
import { OrderSummary } from '../../components/order-summary/order-summary';

@Component({
  selector: 'app-cart',
  imports: [BackButton, CartItemsList, TeaseWishlist, OrderSummary],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export default class Cart {
  protected readonly store = inject(CartStore);
}
