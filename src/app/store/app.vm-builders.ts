import { EntityId } from '@ngrx/signals/entities';

import { HeaderVM } from '../view-models/app.vm';

export function createHeaderVm(wishlistIds: EntityId[], cartItemsIds: EntityId[]): HeaderVM {
  return {
    cartItemsCount: cartItemsIds.length,
    wishlistCount: wishlistIds.length,
  };
}
