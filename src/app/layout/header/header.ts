import { Component, inject, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isSidenavOpen = signal(false);
  sidenavToggled = output<boolean>();

  private readonly productsService = inject(ProductsService);
  wishlist = this.productsService.wishlistProducts;

  onToggleSidenav() {
    this.isSidenavOpen.update(() => !this.isSidenavOpen());
    this.sidenavToggled.emit(this.isSidenavOpen());
  }
}
