import { Component, inject, input } from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe } from '@angular/common';
import { MatButton, MatIconButton, MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AppStore } from '../../store/app.store';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, MatButton, MatIcon, MatIconButton],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  readonly product = input.required<Product>();
  protected readonly store = inject(AppStore);

  toggleWishlist() {
    const isInWishlist = this.store.isInWishlist(this.product());

    if (isInWishlist) this.store.removeFromWishlist(this.product().id);
    else this.store.addToWishlist(this.product());
  }
}
