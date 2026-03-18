import { Component, computed, inject, input, signal } from '@angular/core';
import { ViewPanel } from '../../../../directives/view-panel';
import { Product } from '../../../../models/product.model';
import { StarRating } from '../../../../components/star-rating/star-rating';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatAnchor } from '@angular/material/button';
import { ReviewForm } from '../review-form/review-form';
import { AppStore } from '../../../../store/app.store';
import { AuthStore } from '../../../../auth/store/auth.store';

@Component({
  selector: 'app-product-reviews',
  imports: [ViewPanel, StarRating, MatIcon, DatePipe, MatAnchor, ReviewForm],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.scss',
})
export class ProductReviews {
  protected readonly isReviewFormOpen = signal(false);

  protected readonly auth = inject(AuthStore);

  protected readonly appStore = inject(AppStore);
  protected readonly reviews = this.appStore.reviewsEntities;
  readonly product = input.required<Product>();

  protected readonly ratingBreakdown = computed(() => {
    const reviews = this.reviews;
    const total = reviews.length;

    return [5, 4, 3, 2, 1].map((stars) => {
      const reviewsCountPerStar = reviews().filter((rev) => rev.rating === stars).length;

      return {
        stars,
        count: reviewsCountPerStar,
        percentage: (reviewsCountPerStar / total) * 100,
      };
    });
  });
}
