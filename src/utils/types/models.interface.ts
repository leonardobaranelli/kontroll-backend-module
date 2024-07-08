type MaybeString = string | null;

export interface IUser {
  id: string | undefined;
  name: string;
  lastName: string;
  username: string;
  password: string;
  avatarUrl?: MaybeString;
  role?: 'user' | 'admin';
}

export interface IConnector {
  id: string | undefined;
  name: string;
  apiUrl?: MaybeString;
  apiKey?: MaybeString;
}

export interface IShipment {
  id: string | undefined;
  name: string;
  trackingNumber?: MaybeString;
  originCountry?: MaybeString;
  finalCountry?: MaybeString;
  departureDate?: MaybeString;
  arrivalDate?: MaybeString;
  status?: MaybeString;
  provider?: MaybeString;
  courier?: MaybeString;
}
