import { Component, computed, inject, input, signal } from '@angular/core';
import { ViewPanel } from '../../../../directives/view-panel';
import { Product } from '../../../../models/product.model';
import { StarRating } from '../../../../components/star-rating/star-rating';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatAnchor } from '@angular/material/button';
import { ReviewForm } from '../review-form/review-form';
import { AuthStore } from '../../../../auth/store/auth.store';
import { ReviewsStore } from '../../store/reviews.store';

@Component({
  selector: 'app-product-reviews',
  imports: [ViewPanel, StarRating, MatIcon, DatePipe, MatAnchor, ReviewForm, DecimalPipe],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.scss',
})
export class ProductReviews {
  protected readonly isReviewFormOpen = signal(false);

  protected readonly auth = inject(AuthStore);

  protected readonly store = inject(ReviewsStore);

  readonly product = input.required<Product>();

  protected readonly avgRating = computed(() => {
    if (this.product().reviewCount) return this.product().ratingPoints / this.product().reviewCount;
    else return 0;
  });

  protected readonly reviews = this.store.reviewsEntities;

  protected readonly ratingBreakdown = computed(() => {
    const reviews = this.reviews;
    const total = reviews().length;

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
