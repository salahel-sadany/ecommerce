import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-success',
  imports: [MatIcon, MatAnchor, RouterLink],
  templateUrl: './order-success.html',
  styleUrl: './order-success.scss',
})
export default class OrderSuccess {}
