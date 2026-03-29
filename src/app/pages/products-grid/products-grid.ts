import { Component, inject, input, input as inputRoute } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ProductCard } from '../../components/product-card/product-card';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatListItem, MatNavList, MatListItemTitle } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { ProductsGridStore } from './store/products-grid.store';
import { MatIcon } from '@angular/material/icon';
import { UIStore } from '../../store/ui.store';
import { AppStore } from '../../store/app.store';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Product } from '../../models/product.model';

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
export default class ProductsGrid {
  protected readonly category = inputRoute.required<string>();
  protected readonly search = inputRoute.required<string>();

  protected readonly store = inject(ProductsGridStore);
  protected readonly appStore = inject(AppStore);
  protected readonly ui = inject(UIStore);

  protected readonly breakPointObserver = inject(BreakpointObserver);
  protected readonly isMobile = toSignal(
    this.breakPointObserver.observe('(max-width: 768px)').pipe(map((res) => res.matches)),
  );

  constructor() {
    this.ui.setCategory(this.category);

    this.ui.setSearchWord(this.search);
  }

  protected isInWishlist(product: Product) {
    return this.appStore.isInWishlist(product);
  }
}
