import {
  initializeFirestore,
  verifyFirestoreConnection,
} from './firestore/firestore.config';

async function initDatabase(): Promise<void> {
  await initializeFirestore();
  await verifyFirestoreConnection();
}

export { initDatabase };
