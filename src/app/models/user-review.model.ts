import { Timestamp } from '@angular/fire/firestore';

export interface UserReview {
  readonly id: string;
  readonly userId: string;
  readonly productId: string;
  readonly userName: string;
  readonly userImageUrl: string;
  readonly rating: number;
  readonly title: string;
  readonly comment: string;
  readonly reviewDate: Timestamp;
}

export interface WriteReviewInput {
  readonly productId: string;
  readonly rating: number;
  readonly title: string;
  readonly comment: string;
}
