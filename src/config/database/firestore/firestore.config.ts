import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

let initialized = false;

function initializeFirestore() {
  if (!admin.apps.length && !initialized) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    initialized = true;
  }
}

async function verifyFirestoreConnection(): Promise<void> {
  try {
    await admin
      .firestore()
      .collection('test')
      .doc('testDoc')
      .set({ test: 'testValue' });
    console.log(
      'Connection to Firestore has been established successfully'.green,
    );
  } catch (error) {
    console.error('Unable to connect to Firestore:'.red, error);
    throw error;
  }
}

function getParsingDictionariesCollection() {
  initializeFirestore();
  return admin.firestore().collection('parsing_dictionaries');
}

function getCarriersCollection() {
  initializeFirestore();
  return admin.firestore().collection('carriers');
}

function getShipmentsCollection() {
  initializeFirestore();
  return admin.firestore().collection('parsed-shipments');
}

function cleanData(data: any) {
  return JSON.parse(
    JSON.stringify(data, (_key, value) => (value === undefined ? null : value)),
  );
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
  getShipmentsCollection,
  cleanData,
  addDocument,
};
