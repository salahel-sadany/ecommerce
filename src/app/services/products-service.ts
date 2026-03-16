import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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
}
