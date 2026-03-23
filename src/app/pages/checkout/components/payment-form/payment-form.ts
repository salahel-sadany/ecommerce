import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { ViewPanel } from '../../../../directives/view-panel';
import { ThemeService } from '../../../../services/theme-service';

@Component({
  selector: 'app-payment-form',
  imports: [MatIcon, MatRadioButton, MatRadioGroup, ViewPanel],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.scss',
})
export class PaymentForm {
  protected readonly theme = inject(ThemeService);
}
