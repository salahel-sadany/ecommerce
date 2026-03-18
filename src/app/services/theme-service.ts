import { afterEveryRender, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly isDarkMode = signal(false);
  readonly isDark = this.isDarkMode.asReadonly();

  constructor() {
    afterEveryRender(() => {
      const query = window.matchMedia('(prefers-color-scheme:dark)');
      this.isDarkMode.set(query.matches);

      query.addEventListener('change', (event) => {
        this.isDarkMode.set(event.matches);
      });
    });
  }
}
