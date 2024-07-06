type MaybeString = string | undefined;

export interface IUser {
  id: MaybeString;
  name: string;
  lastName: string;
  username: string;
  password: string;
  avatarUrl?: MaybeString;
  role?: 'user' | 'admin';
}
