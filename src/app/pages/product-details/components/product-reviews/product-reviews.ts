import { Component, computed, input } from '@angular/core';
import { ViewPanel } from '../../../../directives/view-panel';
import { Product } from '../../../../models/product.model';
import { StarRating } from '../../../../components/star-rating/star-rating';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-product-reviews',
  imports: [ViewPanel, StarRating, MatIcon, DatePipe, MatAnchor],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.scss',
})
export class ProductReviews {
  readonly product = input.required<Product>();

  protected readonly sortedReviews = computed(() =>
    [...this.product().reviews].sort((a, b) => b.reviewDate.getTime() - a.reviewDate.getTime()),
  );

  protected readonly ratingBreakdown = computed(() => {
    const reviews = this.product().reviews;
    const total = reviews.length;

    return [5, 4, 3, 2, 1].map((stars) => {
      const reviewsCountPerStar = reviews.filter((rev) => rev.rating === stars).length;

      return {
        stars,
        count: reviewsCountPerStar,
        percentage: (reviewsCountPerStar / total) * 100,
      };
    });
  });
}
