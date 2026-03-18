import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs,
  increment,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from '@angular/fire/firestore';
import {
  concatMap,
  EMPTY,
  filter,
  forkJoin,
  from,
  mergeMap,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { CartItem } from '../models/cartItem.model';
import { Product } from '../models/product.model';
import { WishlistService } from './wishlist-service';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly db = inject(Firestore);
  private readonly wishlistService = inject(WishlistService);

  getCartItems(uid: string): Observable<CartItem[]> {
    const collectionRef = collection(this.db, `users/${uid}/cart`);
    return collectionData(collectionRef, { idField: 'productId' }) as Observable<CartItem[]>;
  }

  addToCart(uid: string, product: Product, quantity = 1): Observable<void> {
    const {
      id: productId,
      category,
      description,
      inStock,
      rating,
      reviewCount,
      ...cartItem
    } = product;

    const docRef = doc(this.db, `users/${uid}/cart/${productId}`);
    return from(
      setDoc(
        docRef,
        { ...cartItem, quantity: increment(quantity) },
        {
          merge: true,
        },
      ),
    );
  }

  addAllWishlistToCart(uid: string, products: Product[]) {
    if (!products.length) return EMPTY;

    const batch = writeBatch(this.db);

    const tasks = products.map((product) => {
      const docRef = doc(this.db, `users/${uid}/cart/${product.id}`);

      return from(getDoc(docRef)).pipe(
        tap((docSnap) => {
          if (!docSnap.exists())
            batch.set(docRef, {
              productId: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
              quantity: 1,
            });
        }),
      );
    });

    return forkJoin(tasks).pipe(
      concatMap((_) => from(batch.commit())),

      concatMap((_) => this.wishlistService.clearWishlist(uid)),
    );
  }

  addCartItemToWishlist(uid: string, product: Product): Observable<void> {
    return this.wishlistService
      .addToWishlist(uid, product)
      .pipe(concatMap((_) => this.removeCartItem(uid, product.id)));
  }

  setCartItemQuantity(uid: string, productId: string, quantity: number) {
    const docRef = doc(this.db, `users/${uid}/cart/${productId}`);
    return updateDoc(docRef, { quantity });
  }

  removeCartItem(uid: string, productId: string): Observable<void> {
    const docRef = doc(this.db, `users/${uid}/cart/${productId}`);
    return from(deleteDoc(docRef));
  }

  clearCart(uid: string) {
    const collectionRef = collection(this.db, `users/${uid}/cart`);

    return from(getDocs(collectionRef)).pipe(
      switchMap((snapshot) => {
        if (snapshot.empty) return EMPTY;

        const batch = writeBatch(this.db);

        snapshot.docs.forEach((doc) => batch.delete(doc.ref));

        return from(batch.commit());
      }),
    );
  }
}
