import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-back-button',
  imports: [RouterLink],
  templateUrl: './back-button.html',
  styleUrl: './back-button.css',
})
export class BackButton {
  btnLabel = input.required<string>();
  path = input.required<string>();
}
