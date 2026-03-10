import { signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { initalAuthSlice } from './auth.slice';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { UserSignIn, UserSignUp } from '../../models/user.model';
import { inject } from '@angular/core';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initalAuthSlice),
  withProps((store) => ({
    _dialog: inject(MatDialog),
    _router: inject(Router),
  })),
  withComputed((store) => ({})),
  withMethods((store) => ({
    signIn: (data: UserSignIn) => {
      updateState(store, 'User logged in', {
        user: {
          id: '1',
          name: 'John Doe',
          email: data.email,
          imageUrl:
            'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      });

      store._dialog.getDialogById(data.dialogId)?.close();

      if (data.checkout) store._router.navigate(['/checkout']);
    },

    signUp: (data: UserSignUp) => {
      updateState(store, 'User created an account', {
        user: {
          id: '1',
          name: data.name,
          email: data.email,
          imageUrl:
            'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      });

      store._dialog.getDialogById(data.dialogId)?.close();

      if (data.checkout) store._router.navigate(['/checkout']);
    },

    logout: () =>
      updateState(store, 'user logged out', {
        user: null,
      }),
  })),
  withDevtools('auth-store'),
);
