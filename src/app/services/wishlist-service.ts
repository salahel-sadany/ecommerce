import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  setDoc,
  writeBatch,
} from '@angular/fire/firestore';
import { from, mergeMap, Observable, forkJoin, switchMap } from 'rxjs';
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
      switchMap((snapshot) => {
        const batch = writeBatch(this.db);

        snapshot.docs.map((docSnap) => batch.delete(docSnap.ref));

        return from(batch.commit());
      }),
    );
  }
}
