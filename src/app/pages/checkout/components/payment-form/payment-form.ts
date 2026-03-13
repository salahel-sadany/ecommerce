import { afterEveryRender, Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { ViewPanel } from '../../../../directives/view-panel';

@Component({
  selector: 'app-payment-form',
  imports: [MatIcon, MatRadioButton, MatRadioGroup, ViewPanel],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.scss',
})
export class PaymentForm {
  protected readonly isDarkMode = signal(false);

  constructor() {
    afterEveryRender(() => {
      const query = window.matchMedia('(prefers-color-scheme:dark)');
      this.isDarkMode.set(query.matches);

      query.addEventListener('change', (event) => this.isDarkMode.set(event.matches));
    });
  }
}
