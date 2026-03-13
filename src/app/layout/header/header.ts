import { afterEveryRender, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatToolbar } from '@angular/material/toolbar';
import { MatBadge } from '@angular/material/badge';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { AppStore } from '../../store/app.store';
import { AuthStore } from '../../auth/store/auth.store';
import { MatDivider } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { SignUpDialog } from '../../auth/components/sign-up-dialog/sign-up-dialog';
import { SignInDialog } from '../../auth/components/sign-in-dialog/sign-in-dialog';
import { UIStore } from '../../store/ui.store';

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
    MatMenu,
    MatMenuTrigger,
    MatDivider,
    MatMenuItem,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private headerEl = viewChild.required('header', { read: ElementRef });
  protected readonly headerHeight = signal(0);

  private readonly router = inject(Router);

  protected readonly dialog = inject(MatDialog);

  protected readonly store = inject(AppStore);
  protected readonly ui = inject(UIStore);
  protected readonly auth = inject(AuthStore);

  constructor() {
    afterEveryRender({
      read: () => this.headerHeight.set(this.headerEl().nativeElement.offsetHeight),
    });
  }

  onSearch(event: Event) {
    const searchEl = event.target as HTMLInputElement;
    const word = searchEl.value;

    this.router.navigate([], {
      queryParams: {
        search: word || null,
      },
    });
  }

  protected openSignUpDialog() {
    this.dialog.open(SignUpDialog, {
      disableClose: true,
    });
  }

  protected openSignInDialog() {
    this.dialog.open(SignInDialog, {
      disableClose: true,
    });
  }
}
