export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly imageUrl?: string;
}

export interface UserSignUp {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  imageUrl?: string;
  readonly checkout?: boolean;
  readonly dialogId: string;
}

export type UserSignIn = Omit<UserSignUp, 'name'>;
