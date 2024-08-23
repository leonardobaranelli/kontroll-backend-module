// import { Shipment } from '../models/shipment.model';
import { UpdateShipmentDto } from '../utils/dtos';
import {
  IShipmentPublic,
  // AbstractShipmentPublic,
  IError,
} from '../utils/types/utilities.interface';
// import { getAttributes } from './helpers/commons/get-attributes.helper';
import { getShipmentsCollection } from '../config/database/firestore/firestore.config';

export default class ShipmentService {
  private static getIdFieldForCarrier(carrier: string): string {
    const carrierIdFields: { [key: string]: string } = {
      dhl: 'id',
      dhl_global_forwarding: 'HousebillNumber',
      fedex: 'trackingNumber',
      kandn: 'shipmentNumber',
      sch: 'ShipmentId',
    };

    return carrierIdFields[carrier] || 'id';
  }

  public static async getAllShipments(): Promise<IShipmentPublic[]> {
    try {
      const shipmentsCollection = getShipmentsCollection();
      const allShipments: IShipmentPublic[] = [];

      const snapshot = await shipmentsCollection.get();
      snapshot.forEach((doc) => {
        allShipments.push({ ...(doc.data() as IShipmentPublic) });
      });

      if (allShipments.length === 0) {
        const error: IError = new Error('There are no shipments available');
        error.statusCode = 404;
        throw error;
      }

      return allShipments;
    } catch (error) {
      throw error;
    }
  }
  public static async getShipmentsByCarrier(
    carrier: string,
  ): Promise<IShipmentPublic[]> {
    try {
      const shipmentsCollection = getShipmentsCollection();
      const snapshot = await shipmentsCollection
        .where('carrierId', '==', carrier)
        .get();
      const shipments: IShipmentPublic[] = [];

      snapshot.forEach((doc) => {
        shipments.push(doc.data() as IShipmentPublic);
      });

      if (shipments.length === 0) {
        const error: IError = new Error(
          'There are no shipments available for that carrier',
        );
        error.statusCode = 404;
        throw error;
      }

      return shipments;
    } catch (error) {
      throw error;
    }
  }

  public static async getShipmentByCarrierAndId(
    carrier: string,
    shipmentId: string,
  ): Promise<IShipmentPublic> {
    try {
      const shipmentsCollection = getShipmentsCollection();

      const snapshot = await shipmentsCollection.get();
      const idField = this.getIdFieldForCarrier(carrier);

      let shipmentDoc = null;
      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (carrier === 'fedex') {
          const completeTrackResults = data.output?.completeTrackResults;
          if (Array.isArray(completeTrackResults)) {
            for (const result of completeTrackResults) {
              if (result.trackingNumber === shipmentId) {
                shipmentDoc = result;
                break;
              }
            }
          }
        } else {
          if (data[idField] === shipmentId) {
            shipmentDoc = data;
            break;
          } else {
            const shipments = data.shipments || [];
            shipmentDoc = shipments.find(
              (shipment: any) => shipment[idField] === shipmentId,
            );
          }
        }
        if (shipmentDoc) break;
      }

      if (!shipmentDoc) {
        const error: IError = new Error(
          `Shipment with ID ${shipmentId} not found for carrier ${carrier}`,
        );
        error.statusCode = 404;
        throw error;
      }

      return shipmentDoc as IShipmentPublic;
    } catch (error) {
      throw error;
    }
  }

  /* private static async searchShipmentInConnectors(
    HousebillNumber: string,
  ): Promise<any> {
    // Implementar la lógica para buscar en los conectores
    // Por ahora, retornamos null como placeholder
    console.log('Buscando envío en conectores... a ' + HousebillNumber);
    return null;
  }

  

  private static convertToPublicShipment(shipmentData: any): IShipmentPublic {
    // Implementar la lógica para convertir los datos del conector a IShipmentPublic
    // Por ahora, hacemos un cast simple
    return shipmentData as IShipmentPublic;
  }
    */

  public static async updateShipmentByNumber(
    HousebillNumber: string,
    newData: UpdateShipmentDto,
  ): Promise<IShipmentPublic | null> {
    try {
      const shipmentsCollection = getShipmentsCollection();
      const snapshot = await shipmentsCollection
        .where('shipmentContent.HousebillNumber', '==', HousebillNumber)
        .get();

      if (snapshot.empty) {
        const error: IError = new Error(
          `Shipment with number ${HousebillNumber} not found`,
        );
        error.statusCode = 404;
        throw error;
      }

      let updatedShipmentByNumber: IShipmentPublic | null = null;
      snapshot.forEach(async (doc) => {
        const shipmentDataToSave = this.toPlainObject(newData);
        await doc.ref.set(shipmentDataToSave, { merge: true });
        const updatedDoc = await doc.ref.get();
        updatedShipmentByNumber = updatedDoc.data() as IShipmentPublic;
      });
      return updatedShipmentByNumber;
    } catch (error) {
      throw error;
    }
  }

  private static toPlainObject(dto: UpdateShipmentDto): Record<string, any> {
    return Object.fromEntries(
      Object.entries(dto).filter(([_, value]) => value !== undefined),
    );
  }

  public static async deleteAllShipments(): Promise<void> {
    try {
      const shipmentsCollection = getShipmentsCollection();
      const snapshot = await shipmentsCollection.get();
      const batch = shipmentsCollection.firestore.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log('All connectors deleted succesfully');
    } catch (error) {
      throw error;
    }
  }

  public static async deleteShipmentByNumber(
    HousebillNumber: string,
  ): Promise<void> {
    try {
      const shipmentsCollection = getShipmentsCollection();
      const snapshot = await shipmentsCollection
        .where('shipmentContent.HousebillNumber', '==', HousebillNumber)
        .get();

      if (snapshot.empty) {
        console.log(
          `No connector with Housebill number ${HousebillNumber} found`,
        );
        return;
      }

      const batch = shipmentsCollection.firestore.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Shipment deleted successfully`);
    } catch (error) {
      throw error;
    }
  }
}
