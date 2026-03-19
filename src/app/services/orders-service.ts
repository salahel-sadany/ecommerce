import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, EMPTY, from, concatMap } from 'rxjs';
import { CartItem } from '../models/cartItem.model';
import { Order } from '../models/order.model';
import { CartService } from './cart-service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly db = inject(Firestore);
  private readonly cartService = inject(CartService);

  placeOrder(uid: string, cartItems: CartItem[], shippingAddress?: string): Observable<void> {
    if (!cartItems.length) return EMPTY;

    const total = cartItems.reduce((tot, item) => tot + item.price * item.quantity, 0);

    const collectionRef = collection(this.db, `users/${uid}/orders`);
    const docRef = doc(collectionRef);

    const orderData: Order = {
      id: docRef.id,
      items: cartItems,
      total,
      userId: uid,
      createdAt: serverTimestamp() as Timestamp,
      paymentStatus: 'success',
      shippingAddress: shippingAddress ?? null,
    };

    return from(setDoc(docRef, orderData)).pipe(concatMap((_) => this.cartService.clearCart(uid)));
  }

  getOrders(uid: string): Observable<Order[]> {
    const collectionRef = collection(this.db, `users/${uid}/orders`);

    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }
}
