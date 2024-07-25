import {
  authenticateDatabase as authenticateSequelize,
  synchronizeDatabase as synchronizeSequelize,
} from './sequelize/sequelize.config';
import {
  initializeFirestore,
  verifyFirestoreConnection,
} from './firestore/firestore.config';

async function initDatabase(): Promise<void> {
  await authenticateSequelize();
  await synchronizeSequelize();
  await initializeFirestore();
  await verifyFirestoreConnection();
}

export { initDatabase };
