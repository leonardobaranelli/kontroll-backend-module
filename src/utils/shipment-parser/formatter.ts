import { IShipment } from '../../utils/types/models.interface';
import { formatDate } from './date';

export function formatShipmentData(parsedShipment: IShipment): IShipment {
  return {
    HousebillNumber: parsedShipment.HousebillNumber,
    Origin: parsedShipment.Origin,
    Destination: parsedShipment.Destination,
    DateAndTimes: {
      ScheduledDeparture: parsedShipment.DateAndTimes.ScheduledDeparture
        ? formatDate(parsedShipment.DateAndTimes.ScheduledDeparture)
        : null,
      ScheduledArrival: parsedShipment.DateAndTimes.ScheduledArrival
        ? formatDate(parsedShipment.DateAndTimes.ScheduledArrival)
        : null,
      ShipmentDate: parsedShipment.DateAndTimes.ShipmentDate
        ? formatDate(parsedShipment.DateAndTimes.ShipmentDate)
        : null,
    },
    ProductType: parsedShipment.ProductType,
    TotalPackages: parsedShipment.TotalPackages,
    TotalWeight: parsedShipment.TotalWeight,
    TotalVolume: parsedShipment.TotalVolume,
    Timestamp: parsedShipment.Timestamp.map((timestamp) => ({
      ...timestamp,
      TimestampDateTime: formatDate(timestamp.TimestampDateTime),
    })),
    brokerName: parsedShipment.brokerName,
    incoterms: parsedShipment.incoterms,
    shipmentDate: parsedShipment.shipmentDate,
    booking: parsedShipment.booking,
    mawb: parsedShipment.mawb,
    hawb: parsedShipment.hawb,
    flight: parsedShipment.flight,
    airportOfDeparture: parsedShipment.airportOfDeparture,
    etd: parsedShipment.etd,
    atd: parsedShipment.atd,
    airportOfArrival: parsedShipment.airportOfArrival,
    eta: parsedShipment.eta,
    ata: parsedShipment.ata,
    vessel: parsedShipment.vessel,
    portOfLoading: parsedShipment.portOfLoading,
    mbl: parsedShipment.mbl,
    hbl: parsedShipment.hbl,
    pickupDate: parsedShipment.pickupDate,
    containerNumber: parsedShipment.containerNumber,
    portOfUnloading: parsedShipment.portOfUnloading,
    finalDestination: parsedShipment.finalDestination,
    internationalCarrier: parsedShipment.internationalCarrier,
    voyage: parsedShipment.voyage,
    portOfReceipt: parsedShipment.portOfReceipt,
    goodsDescription: parsedShipment.goodsDescription,
    containers: parsedShipment.containers,
  };
}
