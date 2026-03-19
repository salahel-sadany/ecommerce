import { EntityId } from '@ngrx/signals/entities';

import { AppVM } from '../view-models/app.vm';

export function createAppVm(wishlistIds: EntityId[], cartItemsIds: EntityId[]): AppVM {
  return {
    cartItemsCount: cartItemsIds.length,
    wishlistCount: wishlistIds.length,
  };
}
