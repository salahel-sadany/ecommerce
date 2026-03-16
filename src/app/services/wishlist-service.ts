import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { from, mergeMap, Observable, forkJoin } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly db = inject(Firestore);

  getWishlist(uid: string): Observable<Product[]> {
    const collectionRef = collection(this.db, `users/${uid}/wishlist`);
    return collectionData(collectionRef, { idField: 'id' }) as Observable<Product[]>;
  }

  addToWishlist(uid: string, product: Product): Observable<void> {
    const { id, ...productRest } = product;
    const docRef = doc(this.db, `users/${uid}/wishlist/${id}`);
    return from(setDoc(docRef, productRest));
  }

  removeFromWishlist(uid: string, productId: string): Observable<void> {
    const docRef = doc(this.db, `users/${uid}/wishlist/${productId}`);
    return from(deleteDoc(docRef));
  }

  clearWishlist(uid: string) {
    const collectionRef = collection(this.db, `users/${uid}/wishlist`);
    return from(getDocs(collectionRef)).pipe(
      mergeMap((snapshot) => {
        const deletions = snapshot.docs.map((docSnap) =>
          from(deleteDoc(doc(this.db, `users/${uid}/wishlist/${docSnap.id}`))),
        );
        return deletions.length ? forkJoin(deletions) : from([]);
      }),
    );
  }
}
