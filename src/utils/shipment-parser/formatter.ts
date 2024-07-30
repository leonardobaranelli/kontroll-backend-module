import { IShipment } from '../types/models.interface';

export function formatShipmentData(
  parsedShipment: Partial<IShipment>,
): IShipment {
  if (!parsedShipment.HousebillNumber) {
    console.warn('HousebillNumber is missing in the parsed shipment data');
  }

  return {
    ...parsedShipment,
    HousebillNumber: parsedShipment.HousebillNumber || '',
    DateAndTimes: {
      ScheduledDeparture: parsedShipment.DateAndTimes?.ScheduledDeparture
        ? formatDate(parsedShipment.DateAndTimes.ScheduledDeparture as string)
        : null,
      ScheduledArrival: parsedShipment.DateAndTimes?.ScheduledArrival
        ? formatDate(parsedShipment.DateAndTimes.ScheduledArrival as string)
        : null,
      ShipmentDate: parsedShipment.DateAndTimes?.ShipmentDate
        ? formatDate(parsedShipment.DateAndTimes.ShipmentDate as string)
        : null,
    },
    Timestamp:
      parsedShipment.Timestamp?.map((timestamp) => ({
        ...timestamp,
        TimestampDateTime: timestamp.TimestampDateTime
          ? formatDate(timestamp.TimestampDateTime as string)
          : null,
      })) || [],
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
}
