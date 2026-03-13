export interface UserReview {
  readonly id: string;
  readonly productId: string;
  readonly userName: string;
  readonly userImageUrl: string;
  readonly rating: number;
  readonly title: string;
  readonly comment: string;
  readonly reviewDate: Date;
}
