import { Sequelize } from 'sequelize-typescript';
import { User } from '../../../models/user.model';

const { DB_USER, DB_PASS, DB_HOST, DB_NAME, DB_PORT } = process.env;

const sequelize: Sequelize = new Sequelize({
  dialect: 'postgres',
  database: DB_NAME || 'database',
  username: DB_USER || 'username',
  password: DB_PASS || 'password',
  host: DB_HOST || 'localhost',
  port: parseInt(DB_PORT || '5432', 10),
  logging: false,
  models: [User],
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

async function authenticateDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

async function synchronizeDatabase(): Promise<void> {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Database synchronization failed:', error);
  }
}

export { authenticateDatabase, synchronizeDatabase };
