import { Component, signal } from '@angular/core';
import { Header } from './layout/header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('ecommerce');
  // private readonly db = inject(Firestore);

  // constructor() {
  //   this.generate();
  // }

  // async generate() {
  //   for (let p of PRODUCTS_NEW) {
  //     const collectionRef = collection(this.db, 'products');
  //     await addDoc(collectionRef, p);
  //   }
  // }
}
