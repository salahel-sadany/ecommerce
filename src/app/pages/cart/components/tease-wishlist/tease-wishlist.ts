import { Component, inject, input } from '@angular/core';
import { ViewPanel } from '../../../../directives/view-panel';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';
import { CartStore } from '../../store/cart.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tease-wishlist',
  imports: [ViewPanel, MatIcon, MatAnchor, RouterLink],
  templateUrl: './tease-wishlist.html',
  styleUrl: './tease-wishlist.scss',
})
export class TeaseWishlist {
  protected readonly store = inject(CartStore);
  readonly count = input.required<number>();
}
