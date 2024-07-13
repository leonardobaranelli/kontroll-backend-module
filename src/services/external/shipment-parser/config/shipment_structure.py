SHIPMENT_STRUCTURE = {
    "HousebillNumber": str,
    "Origin": {
        "LocationCode": str,
        "LocationName": str,
        "CountryCode": str
    },
    "Destination": {
        "LocationCode": str,
        "LocationName": str,
        "CountryCode": str
    },
    "DateAndTimes": {
        "ScheduledDeparture": str,
        "ScheduledArrival": str,
        "ShipmentDate": str
    },
    "ProductType": str,
    "TotalPackages": (int, type(None)),
    "TotalWeight": {
        "*body": (float, int),
        "@uom": str
    },
    "TotalVolume": {
        "*body": (float, int, type(None)),
        "@uom": str
    },
    "Timestamp": [
        {
            "TimestampCode": str,
            "TimestampDescription": str,
            "TimestampDateTime": str,
            "TimestampLocation": str
        }
    ]
}