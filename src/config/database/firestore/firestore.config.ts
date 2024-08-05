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

function getConnectorsCollection() {
  return admin.firestore().collection('connectors');
}

function getCarriersCollection() {
  return admin.firestore().collection('carriers');
}

export {
  initializeFirestore,
  verifyFirestoreConnection,
  getConnectorsCollection,
  getCarriersCollection,
};

/*
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

function getConnectorsCollection() {
  return admin.firestore().collection('connectors');
}

function getCarriersCollection() {
  return admin.firestore().collection('carriers');
}

function cleanData(data: any) {
  return JSON.parse(JSON.stringify(data));
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
  getConnectorsCollection,
  getCarriersCollection,
  addDocument,
};

*/
