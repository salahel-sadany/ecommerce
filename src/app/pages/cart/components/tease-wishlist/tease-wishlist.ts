import { Component, inject, input } from '@angular/core';
import { ViewPanel } from '../../../../directives/view-panel';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-tease-wishlist',
  imports: [ViewPanel, MatIcon, MatAnchor, RouterLink],
  templateUrl: './tease-wishlist.html',
  styleUrl: './tease-wishlist.scss',
})
export class TeaseWishlist {
  protected readonly appStore = inject(AppStore);
  readonly count = input.required<number>();
}
