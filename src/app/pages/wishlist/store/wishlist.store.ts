import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { initialWishlistSlice } from './wishlist.slice';
import {
  setError,
  setLoaded,
  setLoading,
  updateState,
  withCallState,
  withDevtools,
} from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { createWishlistVm } from './wishlist.vm-builders';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { wishlistConfig } from '../../../store/entity.config';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap, of, EMPTY, exhaustMap } from 'rxjs';
import { Product } from '../../../models/product.model';
import { WishlistService } from '../../../services/wishlist-service';
import { AuthStore } from '../../../auth/store/auth.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { HotToastService } from '@ngxpert/hot-toast';
import { SignInDialog } from '../../../auth/components/sign-in-dialog/sign-in-dialog';
import { MatDialog } from '@angular/material/dialog';

export const WishlistStore = signalStore(
  { providedIn: 'root' },
  withState(initialWishlistSlice),
  withEntities(wishlistConfig),
  withCallState(),
  withProps(() => ({
    _wishlistService: inject(WishlistService),
    _auth: inject(AuthStore),
    _toast: inject(HotToastService),
    _dialog: inject(MatDialog),
  })),
  withComputed((store) => ({
    vm: computed(() => createWishlistVm(store.wishlistEntities())),
  })),
  withMethods((store) => ({
    loadWishlist: rxMethod<void>(
      pipe(
        tap(() => updateState(store, 'wishlist loading set', setLoading())),
        switchMap(() => {
          const userId = store._auth.userId();

          if (!userId) {
            return of([]).pipe(
              tap(() =>
                updateState(
                  store,
                  'Logout: Force Clear Wishlist',
                  setAllEntities([] as Product[], wishlistConfig),
                  setLoaded(),
                ),
              ),
            );
          }

          return store._wishlistService.getWishlist(userId).pipe(
            tapResponse({
              next: (products) => {
                updateState(
                  store,
                  'Wishlist Loaded',
                  setAllEntities(products, wishlistConfig),
                  setLoaded(),
                );
              },
              error: (err) =>
                updateState(store, 'Error loading wishlist', setError(err), setLoaded()),
              finalize: () => updateState(store, 'wishlist loading reset', setLoaded()),
            }),
          );
        }),
      ),
    ),
    clearWishlist: rxMethod<void>(
      pipe(
        tap((_) => updateState(store, 'Loading clear set', setLoading())),
        exhaustMap(() => {
          const userId = store._auth.userId();
          if (!userId) return EMPTY;

          return store._wishlistService.clearWishlist(userId).pipe(
            tapResponse({
              next: () => {
                updateState(store, 'Wishlist cleared');
              },
              error: (err) => {
                updateState(store, 'Error clearing wishlist', setError(err));
                store._toast.error('Clearing wishlist failed');
              },
              finalize: () => updateState(store, 'Loading clear wishlist reset', setLoaded()),
            }),
          );
        }),
      ),
    ),
    addToWishlist: rxMethod<string>(
      pipe(
        tap((_) => updateState(store, 'Loading add to wishlist set', setLoading())),
        exhaustMap((productId) => {
          const userId = store._auth.userId();
          if (!userId) {
            // store._toast.error('You must be logged in to add to wishlist');
            store._dialog.open(SignInDialog, {
              disableClose: true,
            });
            return EMPTY;
          }

          return store._wishlistService.addToWishlist(userId, productId).pipe(
            tapResponse({
              next: () => store._toast.success('Product is added to wishlist'),
              error: (err) => updateState(store, 'Error adding wishlist item', setError(err)),
              finalize: () => updateState(store, 'loading add to wishlist reset', setLoaded()),
            }),
          );
        }),
      ),
    ),
    removeFromWishlist: rxMethod<string>(
      pipe(
        tap((_) => updateState(store, 'Loading remove from wishlist set', setLoading())),
        exhaustMap((productId) => {
          const userId = store._auth.userId();
          if (!userId) return EMPTY;

          return store._wishlistService.removeFromWishlist(userId, productId).pipe(
            tapResponse({
              next: () => {
                updateState(store, 'Product Removed From Wishlist');
                store._toast.success('Product is removed from wishlist');
              },
              error: (err) => {
                updateState(store, 'Product Removed From Wishlist', setError(err));
                store._toast.error('Product is removed from wishlist');
              },
              finalize: () => updateState(store, 'Loading remove from wishlist reset', setLoaded()),
            }),
          );
        }),
      ),
    ),
  })),
  withHooks((store) => ({
    onInit: () => {
      toObservable(store._auth.user).subscribe(() => {
        store.loadWishlist();
      });
    },
  })),
  withDevtools('wishlist-store'),
);
