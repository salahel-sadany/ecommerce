import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
} from '@angular/fire/firestore';
import { from, mergeMap, Observable, forkJoin, switchMap, EMPTY, combineLatest, of } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductsService } from './products-service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly db = inject(Firestore);
  private readonly prouctsService = inject(ProductsService);

  getWishlist(uid: string): Observable<Product[]> {
    const collectionRef = collection(this.db, `users/${uid}/wishlist`);
    return collectionData(collectionRef, { idField: 'productId' }).pipe(
      switchMap((wishlistItems) => {
        if (wishlistItems.length === 0) return of([]);

        const products$ = wishlistItems.map((i) => this.prouctsService.getProductById(i.productId));

        return combineLatest(products$);
      }),
    );
  }

  addToWishlist(uid: string, productId: string): Observable<void> {
    const docRef = doc(this.db, `users/${uid}/wishlist/${productId}`);
    return from(setDoc(docRef, { productId, createdAt: serverTimestamp() }));
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
