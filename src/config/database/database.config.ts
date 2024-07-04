import {
  authenticateDatabase as authenticateSequelize,
  synchronizeDatabase as synchronizeSequelize,
} from './sequelize/sequelize.config';
import {
  initializeFirestore,
  verifyFirestoreConnection,
} from './firestore/firestore.config';

const DATABASE_TYPE = process.env.DATABASE_TYPE;

async function initDatabase(): Promise<void> {
  if (DATABASE_TYPE === 'sequelize') {
    await authenticateSequelize();
    await synchronizeSequelize();
  } else if (DATABASE_TYPE === 'firestore') {
    await initializeFirestore();
    await verifyFirestoreConnection();
  } else {
    throw new Error(`Unknown DATABASE_TYPE: ${DATABASE_TYPE}`);
  }
}

export { initDatabase };
