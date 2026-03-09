import { AfterViewInit, Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatToolbar } from '@angular/material/toolbar';
import { MatBadge } from '@angular/material/badge';
import { RouterLink } from '@angular/router';
import { AppStore } from '../../store/app.store';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatButton,
    MatFormField,
    MatInput,
    MatPrefix,
    RouterLink,
    MatBadge,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private headerEl = viewChild.required('header', { read: ElementRef });
  protected readonly headerHeight = computed(() => this.headerEl().nativeElement.offsetHeight);

  protected readonly store = inject(AppStore);
}
