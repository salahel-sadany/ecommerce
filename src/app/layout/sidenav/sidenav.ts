import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { ProductsService } from '../../services/products-service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink, RouterLinkActive, TitleCasePipe],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {
  private productsService = inject(ProductsService);
  protected readonly categories = this.productsService.categories;

  readonly isSidenavOpen = input.required<boolean>();
  sidenavClosed = output<void>();

  constructor() {
    effect(() => {
      console.log(this.isSidenavOpen());
    });
  }
}
