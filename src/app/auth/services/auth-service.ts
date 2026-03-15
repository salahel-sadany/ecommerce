import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);

  signUp(email: string, password: string, name: string, imageUrl: string): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((cred) =>
        updateProfile(cred.user, {
          displayName: name,
          photoURL: imageUrl,
        }),
      ),
    );
  }

  updateNameAndImage(user: User, name: string, imageUrl: string): Observable<void> {
    return from(
      updateProfile(user, {
        displayName: name,
        photoURL: imageUrl,
      }),
    );
  }

  signIn(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  getCurrentUser(): Observable<User | null> {
    return authState(this.auth);
  }
}
