import { Component, inject } from '@angular/core';
import { ProductCard } from '../../components/product-card/product-card';
import { MatIcon } from '@angular/material/icon';
import { BackButton } from '../../components/back-button/back-button';
import { WishlistStore } from './store/wishlist.store';
import { MatAnchor } from '@angular/material/button';
import { EmptyWishlist } from '../../components/empty-wishlist/empty-wishlist';

@Component({
  selector: 'app-wishlist',
  imports: [ProductCard, MatIcon, BackButton, MatAnchor, EmptyWishlist],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export default class Wishlist {
  protected readonly store = inject(WishlistStore);
}
