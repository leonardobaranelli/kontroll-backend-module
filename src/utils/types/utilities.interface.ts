import { Property } from '../decorators/property.decorator';

export interface IError extends Error {
  statusCode?: number;
}

export interface IUserPublic {
  id: string;
  name: string;
  lastName: string;
  username: string;
}

// Abstract class representing a public user with metadata
export class AbstractUserPublic {
  @Property()
  id!: string;
  @Property()
  name!: string;
  @Property()
  lastName!: string;
  @Property()
  username!: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.lastName = '';
    this.username = '';
  }
}
