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

function getParsingDictionariesCollection() {
  return admin.firestore().collection('parsingDictionaries');
}

function getCarriersCollection() {
  return admin.firestore().collection('carriers');
}

function cleanData(data: any) {
  const cleanedData = JSON.parse(
    JSON.stringify(data, (_key, value) => (value === undefined ? null : value)),
  );
  return cleanedData;
}

async function addDocument(collectionName: string, data: any) {
  const cleanedData = cleanData(data);
  try {
    await admin.firestore().collection(collectionName).add(cleanedData);
    console.log('Document successfully written!');
  } catch (error) {
    console.error('Error writing document: ', error);
  }
}

export {
  initializeFirestore,
  verifyFirestoreConnection,
  getCarriersCollection,
  getParsingDictionariesCollection,
  cleanData,
  addDocument,
};
