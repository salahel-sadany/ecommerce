import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { UserReview, WriteReviewInput } from '../models/user-review.model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private readonly db = inject(Firestore);

  getReviews(): Observable<UserReview[]> {
    const collectionRef = collection(this.db, 'reviews');
    const q = query(collectionRef, orderBy('reviewDate', 'desc'));

    return collectionData(q, { idField: 'id' }) as Observable<UserReview[]>;
  }

  addReview(user: User, reviewData: WriteReviewInput): Observable<void> {
    const reviewsRef = collection(this.db, 'reviews');
    const reviewRef = doc(reviewsRef);

    const productRef = doc(this.db, `products/${reviewData.productId}`);

    const batch = writeBatch(this.db);

    const review: UserReview = {
      id: reviewRef.id,
      userId: user.id,
      productId: reviewData.productId,
      userName: user.name,
      userImageUrl: user.imageUrl,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      reviewDate: serverTimestamp() as Timestamp,
    };

    batch.set(reviewRef, review);

    batch.update(productRef, {
      reviewCount: increment(1),
      ratingPoints: increment(reviewData.rating),
    });

    return from(batch.commit());
  }
}
