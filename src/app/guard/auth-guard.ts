import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, UrlTree } from '@angular/router';
import { AuthStore } from '../auth/store/auth.store';
import { MatDialog } from '@angular/material/dialog';
import { SignInDialog } from '../auth/components/sign-in-dialog/sign-in-dialog';

export const authGuard: CanActivateFn = (route, state) => {
  const dialog = inject(MatDialog);
  const auth = inject(AuthStore);

  if (auth.isLoggedIn()) return true;

  dialog.open(SignInDialog, {
    disableClose: true,
  });

  return false;
};
