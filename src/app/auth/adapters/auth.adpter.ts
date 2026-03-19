import { User as FirebaseUser } from '@angular/fire/auth';
import { User as AppUser } from '../../models/user.model';

export class AuthAdapter {
  static toUser(firebaseUser: FirebaseUser | null): AppUser | null {
    if (!firebaseUser) return null;

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      name: firebaseUser.displayName ?? '',
      imageUrl: firebaseUser.photoURL ?? '',
    };
  }
}
