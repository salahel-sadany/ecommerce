import { Component, computed, inject, input, input as inputRoute, signal } from '@angular/core';
import { type Product } from '../../models/product.model';
import { TitleCasePipe } from '@angular/common';
import { ProductCard } from '../../components/product-card/product-card';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatListItem, MatNavList, MatListItemTitle } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { AppStore } from '../../store/app.store';
import { ProductsGridStore } from './store/products-grid.store';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-products-grid',
  imports: [
    TitleCasePipe,
    ProductCard,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatNavList,
    MatListItem,
    RouterLink,
    MatListItemTitle,
    MatIcon,
  ],
  templateUrl: './products-grid.html',
  styleUrl: './products-grid.scss',
})
export class ProductsGrid {
  protected readonly category = inputRoute.required<string>();
  protected readonly store = inject(ProductsGridStore);

  constructor() {
    this.store.setCategory(this.category);
  }
}
