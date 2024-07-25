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
}
