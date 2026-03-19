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
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthAdapter } from '../adapters/auth.adpter';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly db = inject(Firestore);

  signUp(email: string, password: string, name: string, imageUrl?: string): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => {
        const newUser = {
          email,
          id: user.uid,
          imageUrl: imageUrl || 'user.png',
          name,
        };

        return forkJoin([
          this.updateNameAndImage(user, name, imageUrl),
          this.persistNewUser(newUser),
        ]).pipe(map(() => newUser));
      }),
    );
  }

  updateNameAndImage(user: FirebaseUser, name: string, imageUrl?: string): Observable<void> {
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

  signIn(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => this.getUserFromFirestore(user.uid)),
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  getCurrentUser(): Observable<FirebaseUser | null> {
    return authState(this.auth);
  }

  getUserFromFirestore(uid: string): Observable<User> {
    const docRef = doc(this.db, `users/${uid}`);

    return from(getDoc(docRef)).pipe(
      map((docSnap) => {
        if (!docSnap.exists()) {
          throw new Error('User profile not found in database!');
        }

        return { id: docSnap.id, ...docSnap.data() } as User;
      }),
    );
  }
}
