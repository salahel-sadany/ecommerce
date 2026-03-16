import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
} from '@angular/fire/auth';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { from, map, Observable, switchMap } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly db = inject(Firestore);

  signUp(email: string, password: string, name: string, imageUrl: string): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) =>
        this.updateNameAndImage(user, name, imageUrl).pipe(
          map(() => ({
            email: user.email || '',
            id: user.uid,
            imageUrl: user.photoURL || '',
            name: user.displayName || '',
          })),
        ),
      ),
    );
  }

  updateNameAndImage(user: FirebaseUser, name: string, imageUrl: string): Observable<void> {
    return from(
      updateProfile(user, {
        displayName: name,
        photoURL: imageUrl,
      }),
    );
  }

  persistNewUser(user: User): Observable<void> {
    const { id, ...userData } = user;
    const docRef = doc(this.db, `users/${id}`);

    return from(setDoc(docRef, userData));
  }

  signIn(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  getCurrentUser(): Observable<FirebaseUser | null> {
    return authState(this.auth);
  }
}
