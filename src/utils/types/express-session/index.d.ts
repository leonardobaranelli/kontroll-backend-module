import 'express-session';
import { Sequelize } from 'sequelize';
import { Store } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    sessionID: string;
  }
}

declare module 'connect-session-sequelize' {
  class SequelizeStore extends Store {
    constructor(options: { db: Sequelize });
  }

  function connectSessionSequelize(
    session: typeof import('express-session'),
  ): typeof SequelizeStore;

  export = connectSessionSequelize;
}
