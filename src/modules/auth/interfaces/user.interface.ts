export enum Role {
  Admin = 'admin',
  Customer = 'customer',
  Public = 'public',
}

type User = {
  id: string;
  contact: string;
  password: string;
  role: Role;
};

export interface IAuthenticate {
  readonly user: User;
  readonly token: string;
}
