import { Component, inject, input } from '@angular/core';
import { Product } from '../../models/product.model';
import { CurrencyPipe } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AppStore } from '../../store/app.store';
import { RouterLink } from '@angular/router';
import { StarRating } from '../star-rating/star-rating';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, MatButton, MatIcon, RouterLink, MatIconButton, StarRating],
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
