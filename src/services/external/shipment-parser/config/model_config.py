MODEL_NAME = 'knowledgator/comprehend_it-base'

FIELD_SYNONYMS = {
  "HousebillNumber": [
    "housebill",
    "house bill",
    "hbl",
    "tracking number",
    "shipment id",
    "consignment number",
    "id",
    "reference number",
    "waybill number",
    "shipment number",
    "tracking id"
  ],
  "Origin.LocationCode": [
    "origin code",
    "departure code",
    "from location code",
    "origin location code"
  ],
  "Origin.LocationName": [
    "origin name",
    "departure location",
    "from location",
    "origin city",
    "origin town",
    "departure city",
    "departure town"
  ],
  "Origin.CountryCode": [
    "origin country code",
    "from country code",
    "origin nation code",
    "origin country",
    "from country"
  ],
  "Destination.LocationCode": [
    "destination code",
    "arrival code",
    "to location code",
    "destination location code",
    "arrival location code"
  ],
  "Destination.LocationName": [
    "destination name",
    "arrival location",
    "to location",
    "destination city",
    "destination town",
    "arrival city",
    "arrival town"
  ],
  "Destination.CountryCode": [
    "destination country code",
    "to country code",
    "destination nation code",
    "destination country",
    "to country"
  ],
  "DateAndTimes.ScheduledDeparture": [
    "scheduled departure",
    "planned departure",
    "estimated departure",
    "departure time",
    "departure date",
    "scheduled dispatch",
    "planned dispatch"
  ],
  "DateAndTimes.ScheduledArrival": [
    "scheduled arrival",
    "planned arrival",
    "estimated arrival",
    "arrival time",
    "arrival date",
    "scheduled delivery",
    "planned delivery"
  ],
  "DateAndTimes.ShipmentDate": [
    "shipment date",
    "shipping date",
    "sent date",
    "dispatch date",
    "date of shipment",
    "date shipped"
  ],
  "ProductType": [
    "product type",
    "service type",
    "shipping method",
    "shipment type",
    "delivery type",
    "service name"
  ],
  "TotalPackages": [
    "total packages",
    "package count",
    "number of items",
    "total items",
    "number of packages",
    "item count"
  ],
  "TotalWeight.*body": [
    "total weight",
    "weight",
    "gross weight",
    "shipment weight",
    "overall weight",
    "total mass",
    "weight value"
  ],
  "TotalWeight.@uom": [
    "weight unit",
    "weight uom",
    "weight measurement",
    "unit of measurement",
    "unit of weight",
    "weight units"
  ],
  "TotalVolume.*body": [
    "total volume",
    "volume",
    "cubic measurement",
    "shipment volume",
    "overall volume",
    "volume value"
  ],
  "TotalVolume.@uom": [
    "volume unit",
    "volume uom",
    "volume measurement",
    "unit of volume",
    "volume units"
  ],
  "Timestamp.TimestampCode": [
    "event code",
    "status code",
    "timestamp code",
    "activity code",
    "event id"
  ],
  "Timestamp.TimestampDescription": [
    "event description",
    "status description",
    "timestamp description",
    "activity description",
    "event detail"
  ],
  "Timestamp.TimestampDateTime": [
    "event date",
    "status date",
    "timestamp",
    "date and time",
    "datetime",
    "timestamp date",
    "timestamp time"
  ],
  "Timestamp.TimestampLocation": [
    "event location",
    "status location",
    "timestamp location",
    "activity location",
    "location of event",
    "event address",
    "location address"
  ]
}

