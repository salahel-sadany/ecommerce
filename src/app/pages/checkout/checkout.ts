import { Component, inject } from '@angular/core';
import { BackButton } from '../../components/back-button/back-button';
import { OrderSummary } from '../../components/order-summary/order-summary';
import { MatButton } from '@angular/material/button';
import { ShippingForm } from './components/shipping-form/shipping-form';
import { PaymentForm } from './components/payment-form/payment-form';
import { CartStore } from '../cart/store/cart.store';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [BackButton, OrderSummary, MatButton, ShippingForm, PaymentForm, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export default class Checkout {
  protected readonly store = inject(CartStore);
}
