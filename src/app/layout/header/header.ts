import { Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [MatToolbar, MatIcon, MatIconButton, MatButton, MatFormField, MatInput, MatPrefix],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
