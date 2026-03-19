import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore } from '@angular/fire/firestore';
import { Observable, take, filter } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly db = inject(Firestore);

  getProducts(): Observable<Product[]> {
    const collectionRef = collection(this.db, 'products');
    return collectionData(collectionRef, { idField: 'id' }) as Observable<Product[]>;
  }

  getProductById(id: string): Observable<Product> {
    const docRef = doc(this.db, `products/${id}`);
    return docData(docRef, { idField: 'id' }).pipe(
      filter((data): data is Product => !!data),
      take(1),
    );
  }
}
