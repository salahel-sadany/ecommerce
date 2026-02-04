import { Component, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isSidenavOpen = signal(false);
  sidenavToggled = output<boolean>();

  onToggleSidenav() {
    this.isSidenavOpen.update(() => !this.isSidenavOpen());
    this.sidenavToggled.emit(this.isSidenavOpen());
  }
}
