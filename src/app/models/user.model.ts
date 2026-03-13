export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly imageUrl: string;
}

export type UserSignIn = Pick<User, 'email'> & {
  readonly password: string;
  readonly checkout?: boolean;
  readonly dialogId: string;
};

export interface UserSignUp extends UserSignIn {
  readonly name: string;
}
