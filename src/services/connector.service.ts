import { ConnectorFirebase } from '../models/firebase/connector.model';
import { getConnectorsCollection } from '../config/database/firestore/firestore.config';
import { v4 as uuidv4 } from 'uuid';
import { CreateConnectorDto, UpdateConnectorDto } from '../utils/dtos';
import {
 IConnectorPublic,
 IError,
} from '../utils/types/utilities.interface';
// import { getAttributes } from './helpers/commons/get-attributes.helper';




export default class ConnectorService {


 public static async getAllConnectors(): Promise<IConnectorPublic[]> {
   try {
     const connectorsCollection = getConnectorsCollection();
     const snapshot = await connectorsCollection.get();


     if (snapshot.empty) {
       const error: IError = new Error('There are no connectors available');
       error.statusCode = 404;
       throw error;
     }


     const allConnectors: IConnectorPublic[] = snapshot.docs.map((doc) => {
       const data = doc.data() as ConnectorFirebase;
       return {
         id: doc.id,
         type: data.type,
         users: data.users || [],
       } as IConnectorPublic;
     });


     return allConnectors;
   } catch (error) {
     throw error;
   }
 }


 public static async getConnectorByType(
   type: string,
 ): Promise<IConnectorPublic[]> {
   try {
     const connectorsCollection = getConnectorsCollection();
     const snapshot = await connectorsCollection.where('type', '==', type).get();


     if (snapshot.empty) {
       const error: IError = new Error(`Connector with type ${type} not found`);
       error.statusCode = 404;
       throw error;
     }


     const connectorsByType: IConnectorPublic[] = snapshot.docs.map((doc) => {
       const data = doc.data() as ConnectorFirebase;
       return {
         id: doc.id,
         type: data.type,
         users: data.users || [],
       } as IConnectorPublic;
     });


     return connectorsByType
   } catch (error) {
     throw error;
   }
 }


 public static async getConnectorById(id: string): Promise<IConnectorPublic> {
   try {
    const connectorsCollection = getConnectorsCollection()
    const snapshot = await connectorsCollection.where('id', '==', id).get();


    if (snapshot.empty) {
     const error: IError = new Error(`Connector with ID ${id} not found`)
     error.statusCode = 404;
     throw error;
    }


    const doc = snapshot.docs[0];
    const data = doc.data() as ConnectorFirebase


    const connectorById: IConnectorPublic = {
     id: doc.id,
     type: data.type
    }


    return connectorById
   } catch (error) {
     throw error;
   }
 }


 public static async createConnector(
   connectorData: CreateConnectorDto,
 ): Promise<IConnectorPublic> {
   try {
     const id = uuidv4();
     const newConnector = new ConnectorFirebase();
     newConnector.id = id;
     newConnector.type = connectorData.type;


     const connectorsCollection = getConnectorsCollection();


     const docRef = connectorsCollection.doc(id);


     const connectorDataToSave = {
       id: newConnector.id,
       type: newConnector.type,
       users: newConnector.users || [],
     };


     await docRef.set(connectorDataToSave);


     return newConnector;
   } catch (error) {
     throw error;
   }
 }


 public static async updateConnectorByType(
   type: string,
   newData: UpdateConnectorDto,
 ): Promise<IConnectorPublic | null> {
   try {
     const connectorsCollection = getConnectorsCollection()
     const snapshot = await connectorsCollection.where('type', '==', type).get();


     if (snapshot.empty) {
     const error: IError = new Error(`No connectors with type ${type} found`)
   error.statusCode = 404;
 throw error;
}


let updatedConnectorByType: IConnectorPublic | null = null;
snapshot.forEach(async (doc) => {
 const connectorDataToSave = this.toPlainObject(newData)
 await doc.ref.set(connectorDataToSave, { merge: true });
 const updatedDoc = await doc.ref.get()
 updatedConnectorByType = updatedDoc.data() as IConnectorPublic
})




return updatedConnectorByType
   } catch (error) {
     throw error;
   }
 }


 public static async updateConnectorById(
   id: string,
   newData: UpdateConnectorDto,
 ): Promise<IConnectorPublic | null> {
   try {
     const connectorsCollection = getConnectorsCollection()
     const snapshot = await connectorsCollection.where('id', '==', id).get();


     if (snapshot.empty) {
     const error: IError = new Error(`No connectors with type ${id} found`)
   error.statusCode = 404;
 throw error;
}


let updatedConnectorById: IConnectorPublic | null = null;
snapshot.forEach(async (doc) => {
 const connectorDataToSave = this.toPlainObject(newData)
 await doc.ref.set(connectorDataToSave, { merge: true });
 const updatedDoc = await doc.ref.get()
 updatedConnectorById = updatedDoc.data() as IConnectorPublic
})




return updatedConnectorById
   } catch (error) {
     throw error;
   }
 }


 private static toPlainObject(dto: UpdateConnectorDto): Record<string, any> {
 return Object.fromEntries(
   Object.entries(dto).filter(([_, value]) => value !== undefined)
 );
}


 public static async deleteAllConnectors(): Promise<void> {
   try {
     const connectorsCollection = getConnectorsCollection();
     const snapshot = await connectorsCollection.get();


     if (snapshot.empty) {
       console.log('No connectors to delete')
       return
     }


     const batch = connectorsCollection.firestore.batch();
     snapshot.docs.forEach(doc => {
       batch.delete(doc.ref)
     })


     await batch.commit()
     console.log('All connectors deleted succesfully')
   } catch (error: unknown) {
     throw error;
   }
 }


 public static async deleteConnectorByType(type: string): Promise<void> {
   try {
     const connectorsCollection = getConnectorsCollection();
     const snapshot = await connectorsCollection.where('type', '==', type).get();


     if (snapshot.empty) {
       console.log(`No connector with type ${type} found`)
       return
     }


     const batch = connectorsCollection.firestore.batch();
     snapshot.docs.forEach(doc => {
       batch.delete(doc.ref)
     })


     await batch.commit()
     console.log(`Connectors with type ${type} deleted succesfully`)
   } catch (error: unknown) {
     throw error;
   }
 }


 public static async deleteConnectorById(id: string): Promise<void> {
   try {
     const connectorsCollection = getConnectorsCollection();
     const snapshot = await connectorsCollection.where('id', '==', id).get();


     if (snapshot.empty) {
       console.log(`No connector with ID ${id} found`)
       return
     }


     const batch = connectorsCollection.firestore.batch();
     snapshot.docs.forEach(doc => {
       batch.delete(doc.ref)
     })


     await batch.commit()
     console.log(`Connectors with ID ${id} deleted succesfully`)
   } catch (error: unknown) {
     throw error;
   }
 }
}
