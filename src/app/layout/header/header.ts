import {
  afterEveryRender,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatToolbar } from '@angular/material/toolbar';
import { MatBadge } from '@angular/material/badge';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { AppStore } from '../../store/app.store';
import { AuthStore } from '../../auth/store/auth.store';
import { MatDivider } from '@angular/material/divider';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignUpDialog } from '../../auth/components/sign-up-dialog/sign-up-dialog';
import { SignInDialog } from '../../auth/components/sign-in-dialog/sign-in-dialog';

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

  protected readonly dialog = inject(MatDialog);

  protected readonly store = inject(AppStore);
  protected readonly auth = inject(AuthStore);

  constructor() {
    afterEveryRender({
      read: () => this.headerHeight.set(this.headerEl().nativeElement.offsetHeight),
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
