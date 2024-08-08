import { IShipment } from '../../../utils/types/models.interface';

export function validateShipmentData(data: IShipment): IShipment {
  if (!data.shipmentContent?.HousebillNumber) {
    throw new Error('HousebillNumber is required');
  }
  return data;
}
