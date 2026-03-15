import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { initalAuthSlice } from './auth.slice';
import {
  setError,
  setLoaded,
  setLoading,
  updateState,
  withCallState,
  withDevtools,
} from '@angular-architects/ngrx-toolkit';
import { UserSignIn, UserSignUp } from '../../models/user.model';
import { computed, inject } from '@angular/core';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth-service';
import { AuthAdapter } from '../adapters/auth.adpter';
import { exhaustMap, pipe, tap } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
import { AuthError } from '@angular/fire/auth';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initalAuthSlice),
  withProps((store) => ({
    _dialog: inject(MatDialog),
    _router: inject(Router),
    _authService: inject(AuthService),
    _toast: inject(HotToastService),
  })),
  withCallState(),
  withComputed((store) => ({
    isLoggedIn: computed(() => !!store.user()),
  })),
  withMethods((store) => ({
    signIn: rxMethod<UserSignIn>(
      pipe(
        tap(() => updateState(store, 'Loading set', setLoading())),
        exhaustMap((data) =>
          store._authService.signIn(data.email, data.password).pipe(
            tapResponse({
              next: () => {
                store._toast.success('Logged in succefully');

                store._dialog.getDialogById(data.dialogId)?.close();
                if (data.checkout) store._router.navigate(['/checkout']);
              },
              error: (err: AuthError) => {
                updateState(store, 'Error set', setError(err));
                store._toast.error('Sign in failed ' + err.message);
              },
              finalize: () => updateState(store, 'Loading reset', setLoaded()),
            }),
          ),
        ),
      ),
    ),

    signUp: rxMethod<UserSignUp>(
      pipe(
        tap(() => updateState(store, 'loading set', setLoading())),
        exhaustMap((data) =>
          store._authService.signUp(data.email, data.password, data.name, '').pipe(
            tapResponse({
              next: () => {
                store._toast.success('Signed Up succefully');

                store._dialog.getDialogById(data.dialogId)?.close();
                if (data.checkout) store._router.navigate(['/checkout']);
              },
              error: (err: AuthError) => {
                updateState(store, 'Error set', setError(err));
                store._toast.error('Sign up failed ' + err.message);
              },
              finalize: () => updateState(store, 'Loading reset', setLoaded()),
            }),
          ),
        ),
      ),
    ),

    logout: rxMethod<void>(
      pipe(
        tap(() => updateState(store, 'loading set', setLoading())),
        exhaustMap(() =>
          store._authService.logout().pipe(
            tapResponse({
              next: () => console.log('logged out'),
              error: (err: AuthError) => {
                updateState(store, 'Error set', setError(err));
                store._toast.error('Logout failed ' + err.message);
              },
              finalize: () => updateState(store, 'Loading reset', setLoaded()),
            }),
          ),
        ),
      ),
    ),
  })),
  withHooks((store) => ({
    onInit: () =>
      store._authService.getCurrentUser().subscribe((user) =>
        updateState(
          store,
          'Auth state changed',
          {
            user: AuthAdapter.toUser(user),
          },
          setLoaded(),
        ),
      ),
  })),
  withDevtools('auth-store'),
);
