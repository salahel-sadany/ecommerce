import { User } from '../../models/user.model';

export interface AuthSlice {
  readonly user: User | null;
}

export const initalAuthSlice: AuthSlice = {
  user: null,
};
