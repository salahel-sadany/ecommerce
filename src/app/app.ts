import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Sidenav } from './layout/sidenav/sidenav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidenav],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ecommerce');
  protected readonly isSidenavOpen = signal(false);

  onCloseSidenav() {
    this.isSidenavOpen.set(false);
  }
}
