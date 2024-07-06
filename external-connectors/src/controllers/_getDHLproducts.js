const _getDHLproducts = async () => {
  const simulatedProducts = {
    shipments: [
      {
        id: "00340434292135100186",
        service: "ecommerce",
        origin: {
          address: {
            countryCode: "US",
            postalCode: "41048",
            addressLocality: "HEBRON",
          },
        },
        destination: {
          address: {
            countryCode: "US",
            postalCode: "89014",
            addressLocality: "HENDERSON",
          },
        },
        status: {
          timestamp: "2023-05-08T10:37:00",
          location: {
            address: {
              countryCode: "US",
              postalCode: "89014",
              addressLocality: "Henderson, NV, US",
            },
          },
          statusCode: "delivered",
          status: "DELIVERED",
          description: "DELIVERED - PARCEL LOCKER",
        },
        details: {
          product: {
            productName: "DHL SM Parcel Plus Expedited",
          },
          weight: {
            value: 1.352,
            unitText: "LB",
          },
          references: [
            {
              number: "756789",
              type: "customer-reference",
            },
            {
              number: "20230fkl87654",
              type: "customer-confirmation-number",
            },
            {
              number: "6100050512345",
              type: "ecommerce-number",
            },
            {
              number: "936109876h8ikj8",
              type: "local-tracking-number",
            },
          ],
        },
        events: [
          {
            timestamp: "2023-05-08T10:37:00",
            location: {
              address: {
                countryCode: "US",
                postalCode: "89014",
                addressLocality: "Henderson, NV, US",
              },
            },
            statusCode: "delivered",
            status: "DELIVERED",
            description: "DELIVERED - PARCEL LOCKER",
          },
          {
            timestamp: "2023-05-08T06:10:00",
            location: {
              address: {
                countryCode: "US",
                postalCode: "89014",
                addressLocality: "Henderson, NV, US",
              },
            },
            statusCode: "transit",
            status: "OUT FOR DELIVERY",
          },
          {
            timestamp: "2023-05-08T01:17:00",
            location: {
              address: {
                countryCode: "US",
                postalCode: "89012",
                addressLocality: "Henderson, NV, US",
              },
            },
            statusCode: "transit",
            status: "ARRIVAL AT POST OFFICE",
          },
          {
            timestamp: "2023-05-08T00:02:00",
            location: {
              address: {
                countryCode: "US",
                postalCode: "89012",
                addressLocality: "Henderson, NV, US",
              },
            },
            statusCode: "transit",
            status: "ARRIVED USPS SORT FACILITY",
          },
          {
            timestamp: "2023-05-06T04:18:30",
            location: {
              address: {
                countryCode: "US",
                postalCode: "90601",
                addressLocality: "Whittier, CA, US",
              },
            },
            statusCode: "transit",
            status: "TENDERED TO DELIVERY SERVICE PROVIDER",
          },
          {
            timestamp: "2023-05-05T10:51:20",
            location: {
              address: {
                countryCode: "US",
                postalCode: "90601",
                addressLocality: "Whittier, CA, US",
              },
            },
            statusCode: "transit",
            status: "ARRIVAL DESTINATION DHL ECOMMERCE FACILITY",
          },
          {
            timestamp: "2023-05-03T14:27:32",
            location: {
              address: {
                countryCode: "US",
                postalCode: "41048",
                addressLocality: "Hebron, KY, US",
              },
            },
            statusCode: "transit",
            status: "DEPARTURE ORIGIN DHL ECOMMERCE FACILITY",
          },
          {
            timestamp: "2023-05-03T01:10:21",
            location: {
              address: {
                countryCode: "US",
                postalCode: "41048",
                addressLocality: "Hebron, KY, US",
              },
            },
            statusCode: "transit",
            status: "PROCESSED",
          },
          {
            timestamp: "2023-05-02T19:25:28",
            location: {
              address: {
                countryCode: "US",
                postalCode: "41048",
                addressLocality: "Hebron, KY, US",
              },
            },
            statusCode: "transit",
            status: "PACKAGE RECEIVED AT DHL ECOMMERCE DISTRIBUTION CENTER",
          },
          {
            timestamp: "2023-05-01T14:11:21",
            statusCode: "pre-transit",
            status: "EN ROUTE TO DHL ECOMMERCE OR AWAITING PROCESSING",
          },
          {
            timestamp: "2023-05-01T14:05:23",
            statusCode: "pre-transit",
            status:
              "DHL ECOMMERCE CURRENTLY AWAITING SHIPMENT AND TRACKING WILL BE UPDATED WHEN RECEIVED",
          },
          {
            timestamp: "2023-05-01T10:02:48",
            statusCode: "unknown",
            status: "LABEL CREATED",
          },
        ],
      },
      // {
      //   "id": "00340434292135100187",
      //   "service": "express",
      //   "origin": {
      //     "address": {
      //       "countryCode": "DE",
      //       "postalCode": "10115",
      //       "addressLocality": "BERLIN"
      //     }
      //   },
      //   "destination": {
      //     "address": {
      //       "countryCode": "DE",
      //       "postalCode": "80331",
      //       "addressLocality": "MUNICH"
      //     }
      //   },
      //   "status": {
      //     "timestamp": "2023-05-10T14:00:00",
      //     "location": {
      //       "address": {
      //         "countryCode": "DE",
      //         "postalCode": "80331",
      //         "addressLocality": "Munich, DE"
      //       }
      //     },
      //     "statusCode": "delivered",
      //     "status": "DELIVERED",
      //     "description": "DELIVERED - SIGNED BY RECIPIENT"
      //   },
      //   "details": {
      //     "product": {
      //       "productName": "DHL Express Worldwide"
      //     },
      //     "weight": {
      //       "value": 2.5,
      //       "unitText": "KG"
      //     },
      //     "references": [
      //       {
      //         "number": "123456",
      //         "type": "customer-reference"
      //       },
      //       {
      //         "number": "789012",
      //         "type": "customer-confirmation-number"
      //       },
      //       {
      //         "number": "345678",
      //         "type": "ecommerce-number"
      //       },
      //       {
      //         "number": "901234",
      //         "type": "local-tracking-number"
      //       }
      //     ]
      //   },
      //   "events": [
      //     {
      //       "timestamp": "2023-05-10T14:00:00",
      //       "location": {
      //         "address": {
      //           "countryCode": "DE",
      //           "postalCode": "80331",
      //           "addressLocality": "Munich, DE"
      //         }
      //       },
      //       "statusCode": "delivered",
      //       "status": "DELIVERED",
      //       "description": "DELIVERED - SIGNED BY RECIPIENT"
      //     },
      //     {
      //       "timestamp": "2023-05-10T09:30:00",
      //       "location": {
      //         "address": {
      //           "countryCode": "DE",
      //           "postalCode": "80331",
      //           "addressLocality": "Munich, DE"
      //         }
      //       },
      //       "statusCode": "transit",
      //       "status": "OUT FOR DELIVERY"
      //     },
      //     {
      //       "timestamp": "2023-05-10T07:15:00",
      //       "location": {
      //         "address": {
      //           "countryCode": "DE",
      //           "postalCode": "80331",
      //           "addressLocality": "Munich, DE"
      //         }
      //       },
      //       "statusCode": "transit",
      //       "status": "ARRIVAL AT DHL FACILITY"
      //     },
      //     {
      //       "timestamp": "2023-05-09T20:00:00",
      //       "location": {
      //         "address": {
      //           "countryCode": "DE",
      //           "postalCode": "10115",
      //           "addressLocality": "Berlin, DE"
      //         }
      //       },
      //       "statusCode": "transit",
      //       "status": "DEPARTURE ORIGIN DHL FACILITY"
      //     },
      //     {
      //       "timestamp": "2023-05-09T15:30:00",
      //       "location": {
      //         "address": {
      //           "countryCode": "DE",
      //           "postalCode": "10115",
      //           "addressLocality": "Berlin, DE"
      //         }
      //       },
      //       "statusCode": "transit",
      //       "status": "PROCESSED AT DHL FACILITY"
      //     },
      //     {
      //       "timestamp": "2023-05-09T12:00:00",
      //       "location": {
      //         "address": {
      //           "countryCode": "DE",
      //           "postalCode": "10115",
      //           "addressLocality": "Berlin, DE"
      //         }
      //       },
      //       "statusCode": "transit",
      //       "status": "PACKAGE RECEIVED AT DHL FACILITY"
      //     },
      //     {
      //       "timestamp": "2023-05-08T10:00:00",
      //       "statusCode": "pre-transit",
      //       "status": "EN ROUTE TO DHL FACILITY"
      //     },
      //     {
      //       "timestamp": "2023-05-08T09:00:00",
      //       "statusCode": "unknown",
      //       "status": "LABEL CREATED"
      //     }
      //   ]
      // },
      // {
      //   "id": "00340434292135100188",
      //   "service": "ecommerce",
      //   "origin": {
      //     "address": {
      //       "countryCode": "GB",
      //       "postalCode": "E1 6AN",
      //       "addressLocality": "LONDON"
      //     }
      //   },
      //   "destination": {
      //     "address": {
      //       "countryCode": "GB",
      //       "postalCode": "M1 1AE",
      //       "addressLocality": "MANCHESTER"
      //     }
      //   },
      //   "status": {
      //     "timestamp": "2023-05-11T16:00:00",
      //     "location": {
      //       "address": {
      //         "countryCode": "GB",
      //         "postalCode": "M1 1AE",
      //         "addressLocality": "Manchester, GB"
      //       }
      //     },
      //     "statusCode": "delivered",
      //     "status": "DELIVERED",
      //     "description": "DELIVERED - LEFT IN SAFE PLACE"
      //   },
      //   "details": {
      //     "product": {
      //       "productName": "DHL Parcel UK"
      //     },
      //     "weight": {
      //       "value": 0.75,
      //       "unitText": "KG"
      //     },
      //     "references": [
      //       {
      //         "number": "567890",
      //         "type": "customer-reference"
      //       },
      //       {
      //         "number": "123098",
      //         "type": "customer-confirmation-number"
      //       },
      //       {
      //         "number": "456321",
      //         "type": "ecommerce-number"
      //       },
      //       {
      //         "number": "789456",
      //         "type": "local-tracking-number"
      //       }
      //     ]
      //   },
      //   "events": [
      //     {
      //       "timestamp": "2023-05-11T16:00:00",
      //       "location": {
      //         "address": {
      //           "countryCode": "GB",
      //           "postalCode": "M1 1AE",
      //           "addressLocality": "Manchester, GB"
      //         }
      //       },
      //       "statusCode": "delivered",
      //       "status": "DELIVERED",
      //       "description": "DELIVERED - LEFT IN SAFE PLACE"
      //     },
      //     {
      //       "timestamp": "2023-05-11T11:30:00",
      //       "location": {
      //         "address": {
      //           "countryCode": "GB",
      //           "postalCode": "M1 1AE",
      //           "addressLocality": "Manchester, GB"
      //         }
      //       },
      //       "statusCode": "transit",
      //       "status": "OUT FOR DELIVERY"
      //     },
      //     {
      //       "timestamp": "2023-05-11T08:15:00",
      //       "location": {
      //         "address": {
      //           "countryCode": "GB",
      //           "postalCode": "M1 1AE",
      //           "addressLocality": "Manchester, GB"
      //         }
      //       },
      //       "statusCode": "transit",
      //       "status": "ARRIVAL AT DELIVERY FACILITY"
      //     },
      //     {
      //       "timestamp": "2023-05-10T19:00:00",
      //       "location": {
      //         "address": {
      //           "countryCode": "GB",
      //           "postalCode": "E1 6AN",
      //           "addressLocality": "London, GB"
      //         }
      //       },
      //       "statusCode": "transit",
      //       "status": "DEPARTURE ORIGIN FACILITY"
      //     },
      //     {
      //       "timestamp": "2023-05-10T14:30:00",
      //       "location": {
      //         "address": {
      //           "countryCode": "GB",
      //           "postalCode": "E1 6AN",
      //           "addressLocality": "London, GB"
      //         }
      //       },
      //       "statusCode": "transit",
      //       "status": "PROCESSED AT ORIGIN FACILITY"
      //     },
      //     {
      //       "timestamp": "2023-05-10T11:00:00",
      //       "location": {
      //         "address": {
      //           "countryCode": "GB",
      //           "postalCode": "E1 6AN",
      //           "addressLocality": "London, GB"
      //         }
      //       },
      //       "statusCode": "transit",
      //       "status": "PACKAGE RECEIVED AT ORIGIN FACILITY"
      //     },
      //     {
      //       "timestamp": "2023-05-09T09:00:00",
      //       "statusCode": "pre-transit",
      //       "status": "EN ROUTE TO ORIGIN FACILITY"
      //     },
      //     {
      //       "timestamp": "2023-05-09T08:00:00",
      //       "statusCode": "unknown",
      //       "status": "LABEL CREATED"
      //     }
      //   ]
      // }
    ],
  };

  return simulatedProducts;
};

module.exports = {
  _getDHLproducts,
};
