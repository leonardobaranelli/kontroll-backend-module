import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

function initializeFirestore() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

async function verifyFirestoreConnection(): Promise<void> {
  try {
    await admin
      .firestore()
      .collection('test')
      .doc('testDoc')
      .set({ test: 'testValue' });
    console.log('Connection to Firestore has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to Firestore:', error);
    throw error;
  }
}

export { initializeFirestore, verifyFirestoreConnection };
