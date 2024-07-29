import admin from 'firebase-admin';
import { IShipmentPublic, IError } from '../utils/types/utilities.interface';

export default class ShipmentServiceFirebase {
  public static async getShipmentsByCarrier(
    carrier: string,
  ): Promise<IShipmentPublic[]> {
    try {
      const shipmentsCollection = admin
        .firestore()
        .collection(`shipments_${carrier}`);
      const snapshot = await shipmentsCollection.get();
      const shipments: IShipmentPublic[] = [];

      snapshot.forEach((doc) => {
        shipments.push(doc.data() as IShipmentPublic);
      });

      if (shipments.length === 0) {
        const error: IError = new Error(
          'There are no shipments available in Firebase',
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
    console.log(
      `[DEBUG] Entering getShipmentByCarrierAndId: carrier=${carrier}, shipmentId=${shipmentId}`,
    );
    try {
      const shipmentsCollection = admin
        .firestore()
        .collection(`shipments_${carrier}`);
      console.log(`[DEBUG] Accessing collection: shipments_${carrier}`);

      const snapshot = await shipmentsCollection.get();
      console.log(`[DEBUG] Snapshot size: ${snapshot.size}`);

      const idField = this.getIdFieldForCarrier(carrier);
      console.log(`[DEBUG] ID field for carrier ${carrier}: ${idField}`);

      let shipmentDoc = null;
      for (const doc of snapshot.docs) {
        const data = doc.data();
        console.log(`[DEBUG] Checking document: ${doc.id}`);
        console.log(`[DEBUG] Document data:`, JSON.stringify(data, null, 2));

        if (data.shipments && Array.isArray(data.shipments)) {
          shipmentDoc = data.shipments.find((shipment: any) => {
            if (idField === 'id') {
              return shipment[idField] === shipmentId;
            } else {
              return shipment.details?.references?.some(
                (ref: any) =>
                  ref.type === 'customer-confirmation-number' &&
                  ref.number === shipmentId,
              );
            }
          });
          if (shipmentDoc) {
            console.log(`[DEBUG] Shipment found in document: ${doc.id}`);
            break;
          }
        }
      }

      if (!shipmentDoc) {
        console.log(`[DEBUG] Shipment not found for ID: ${shipmentId}`);
        const error: IError = new Error(
          `Shipment with ID ${shipmentId} not found for carrier ${carrier}`,
        );
        error.statusCode = 404;
        throw error;
      }

      console.log(`[DEBUG] Returning shipment data`);
      return shipmentDoc as IShipmentPublic;
    } catch (error) {
      console.error(`[DEBUG] Error in getShipmentByCarrierAndId:`, error);
      throw error;
    }
  }

  private static getIdFieldForCarrier(carrier: string): string {
    const carrierIdFields: { [key: string]: string } = {
      dhl: 'id',
      fedex: 'transactionId',
      kn: 'hbl',
      // Add more carriers and their respective ID fields as needed
    };

    return carrierIdFields[carrier.toLowerCase()] || 'id';
  }
}
