import { Component, input } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-back-button',
  imports: [MatAnchor, MatIcon, RouterLink],
  templateUrl: './back-button.html',
  styleUrl: './back-button.scss',
})
export class BackButton {
  readonly label = input.required<string>();
  readonly navigateTo = input.required<string>();
}
