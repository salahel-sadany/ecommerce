import { signalStore, withHooks, withMethods, withProps } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { reviewsConfig } from '../../../store/entity.config';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, exhaustMap, pipe, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { ReviewsService } from '../../../services/reviews-service';
import { WriteReviewInput } from '../../../models/user-review.model';
import { AuthStore } from '../../../auth/store/auth.store';
import { ProductDetailsStore } from './product-details.store';

export const ReviewsStore = signalStore(
  withEntities(reviewsConfig),
  withProps((store) => ({
    _reviewsService: inject(ReviewsService),
    _productDetails: inject(ProductDetailsStore),
    _auth: inject(AuthStore),
  })),
  withMethods((store) => ({
    loadReviews: rxMethod<string>(
      pipe(
        switchMap((productId) =>
          store._reviewsService.getReviews(productId).pipe(
            tapResponse({
              next: (reviews) =>
                updateState(store, 'Reviews loaded', setAllEntities(reviews, reviewsConfig)),
              error: () => updateState(store, 'error loading reviews'),
            }),
          ),
        ),
      ),
    ),

    addReview: rxMethod<WriteReviewInput>(
      pipe(
        exhaustMap((revForm) => {
          const user = store._auth.user();
          if (!user) return EMPTY;

          return store._reviewsService.addReview(user, revForm);
        }),
      ),
    ),
  })),
  withHooks((store) => ({
    onInit: () => {
      store.loadReviews(store._productDetails.selectedProductId);
    },
  })),
  withDevtools('reviews-store'),
);
