const _getMSCproducts = async () => {
  const simulatedProducts = [
    {
      eventType: "TRANSPORT",
      transportEventTypeCode: "ARRI",
      transportCall: {
        transportCallID: "CLVAP2246W",
        carrierServiceCode: null,
        exportVoyageNumber: null,
        importVoyageNumber: "2246W",
        unLocationCode: "CLVAP",
        facilityCode: null,
        facilityCodeListProvider: null,
        facilityTypeCode: "POTE",
        otherFacility: null,
        modeOfTransport: "VESSEL",
        vessel: {
          vesselIMONumber: "9687540",
          vesselName: "COCHRANE",
          vesselFlag: null,
          vesselCallSignNumber: null,
          vesselOperatorCarrierCode: null,
          vesselOperatorCarrierCodeList: null,
        },
      },
      documentReferences: [
        {
          documentReferenceType: "BKG",
          documentReferenceValue: "177SYHYHSB09531",
        },
        {
          documentReferenceType: "TRD",
          documentReferenceValue: "MEDUOL197367",
        },
      ],
      description: "Estimated Time of Arrival",
      eventId: "EST2022-12-26T04:00:00:00-03:00",
      eventDateTime: "2022-12-26T04:00:00Z",
      eventClassifierCode: "EST",
      eventCreatedDateTime: "2022-12-26T04:00:00Z",
      references: [],
    },
    //       {
    //         "eventType": "TRANSPORT",
    //         "transportEventTypeCode": "ARRI",
    //         "transportCall": {
    //             "transportCallID": "CLVAP2246W",
    //             "carrierServiceCode": null,
    //             "exportVoyageNumber": null,
    //             "importVoyageNumber": "2246W",
    //             "unLocationCode": "CLVAP",
    //             "facilityCode": null,
    //             "facilityCodeListProvider": null,
    //             "facilityTypeCode": "POTE",
    //             "otherFacility": null,
    //             "modeOfTransport": "VESSEL",
    //             "vessel": {
    //                 "vesselIMONumber": "9687540",
    //                 "vesselName": "COCHRANE",
    //                 "vesselFlag": null,
    //                 "vesselCallSignNumber": null,
    //                 "vesselOperatorCarrierCode": null,
    //                 "vesselOperatorCarrierCodeList": null
    //             }
    //         },
    //         "documentReferences": [
    //             {
    //                 "documentReferenceType": "BKG",
    //                 "documentReferenceValue": "177SYHYHSB09531"
    //             },
    //             {
    //                 "documentReferenceType": "TRD",
    //                 "documentReferenceValue": "MEDUOL197367"
    //             }
    //         ],
    //         "description": "Estimated Time of Arrival",
    //         "eventId": "EST2022-12-26T04:00:00:00-03:00",
    //         "eventDateTime": "2022-12-26T04:00:00Z",
    //         "eventClassifierCode": "EST",
    //         "eventCreatedDateTime": "2022-12-26T04:00:00Z",
    //         "references": []
    //     },
    //     {
    //       "eventType": "EQUIPMENT",
    //       "equipmentEventTypeCode": "DISC",
    //       "equipmentReference": "MSCU5956818",
    //       "ISOEquipmentCode": "4310",
    //       "emptyIndicatorCode": "LADEN",
    //       "transportCall": {
    //           "transportCallID": "KRPUSUK244A",
    //           "carrierServiceCode": null,
    //           "exportVoyageNumber": null,
    //           "importVoyageNumber": "UK244A",
    //           "unLocationCode": "KRPUS",
    //           "facilityCode": "PNP",
    //           "facilityCodeListProvider": "SMDG",
    //           "facilityTypeCode": "POTE",
    //           "otherFacility": null,
    //           "modeOfTransport": "VESSEL",
    //           "vessel": {
    //               "vesselIMONumber": "9400289",
    //               "vesselName": "NAVARINO",
    //               "vesselFlag": null,
    //               "vesselCallSignNumber": null,
    //               "vesselOperatorCarrierCode": null,
    //               "vesselOperatorCarrierCodeList": null
    //           }
    //       },
    //       "documentReferences": [
    //           {
    //               "documentReferenceType": "BKG",
    //               "documentReferenceValue": "177SYHYHSB09531"
    //           },
    //           {
    //               "documentReferenceType": "TRD",
    //               "documentReferenceValue": "MEDUOL197367"
    //           }
    //       ],
    //       "eventLocation": {
    //           "locationName": "BUSAN",
    //           "unLocationCode": "KRPUS",
    //           "facilityCode": "PNP",
    //           "facilityCodeListProvider": "SMDG"
    //       },
    //       "seals": [
    //           {
    //               "sealNumber": "FJ16648316",
    //               "sealSource": "CAR"
    //           }
    //       ],
    //       "description": "Full Transshipment Discharged",
    //       "eventId": "1078740398",
    //       "eventDateTime": "2022-11-17T08:50:00Z",
    //       "eventClassifierCode": "ACT",
    //       "eventCreatedDateTime": "2022-11-17T08:50:00Z",
    //       "references": []
    //   },
    //   {
    //       "eventType": "TRANSPORT",
    //       "transportEventTypeCode": "ARRI",
    //       "transportCall": {
    //           "transportCallID": "KRPUSUK244A",
    //           "carrierServiceCode": null,
    //           "exportVoyageNumber": null,
    //           "importVoyageNumber": null,
    //           "unLocationCode": "KRPUS",
    //           "facilityCode": "PNP",
    //           "facilityCodeListProvider": "SMDG",
    //           "facilityTypeCode": "POTE",
    //           "otherFacility": null,
    //           "modeOfTransport": "VESSEL",
    //           "vessel": {
    //               "vesselIMONumber": "9400289",
    //               "vesselName": "NAVARINO",
    //               "vesselFlag": null,
    //               "vesselCallSignNumber": null,
    //               "vesselOperatorCarrierCode": null,
    //               "vesselOperatorCarrierCodeList": null
    //           }
    //       },
    //       "documentReferences": [
    //           {
    //               "documentReferenceType": "BKG",
    //               "documentReferenceValue": "177SYHYHSB09531"
    //           },
    //           {
    //               "documentReferenceType": "TRD",
    //               "documentReferenceValue": "MEDUOL197367"
    //           }
    //       ],
    //       "description": "Vessel Arrival",
    //       "eventId": "ACT2022-11-17T04:00:00:00+09:00",
    //       "eventDateTime": "2022-11-17T04:00:00Z",
    //       "eventClassifierCode": "ACT",
    //       "eventCreatedDateTime": "2022-11-17T04:00:00Z",
    //       "references": []
    //   },
    //   {
    //       "eventType": "TRANSPORT",
    //       "transportEventTypeCode": "DEPA",
    //       "transportCall": {
    //           "transportCallID": "CNSHAUK244A",
    //           "carrierServiceCode": null,
    //           "exportVoyageNumber": null,
    //           "importVoyageNumber": null,
    //           "unLocationCode": "CNSHA",
    //           "facilityCode": null,
    //           "facilityCodeListProvider": null,
    //           "facilityTypeCode": "POTE",
    //           "otherFacility": null,
    //           "modeOfTransport": "VESSEL",
    //           "vessel": {
    //               "vesselIMONumber": "9400289",
    //               "vesselName": "NAVARINO",
    //               "vesselFlag": null,
    //               "vesselCallSignNumber": null,
    //               "vesselOperatorCarrierCode": null,
    //               "vesselOperatorCarrierCodeList": null
    //           }
    //       },
    //       "documentReferences": [
    //           {
    //               "documentReferenceType": "BKG",
    //               "documentReferenceValue": "177SYHYHSB09531"
    //           },
    //           {
    //               "documentReferenceType": "TRD",
    //               "documentReferenceValue": "MEDUOL197367"
    //           }
    //       ],
    //       "description": "Vessel Departure",
    //       "eventId": "ACT2022-11-10T08:00:00:00+00:00",
    //       "eventDateTime": "2022-11-10T08:00:00Z",
    //       "eventClassifierCode": "ACT",
    //       "eventCreatedDateTime": "2022-11-10T08:00:00Z",
    //       "references": []
    //   },
    //   {
    //       "eventType": "EQUIPMENT",
    //       "equipmentEventTypeCode": "LOAD",
    //       "equipmentReference": "MSCU5956818",
    //       "ISOEquipmentCode": "4310",
    //       "emptyIndicatorCode": "LADEN",
    //       "transportCall": {
    //           "transportCallID": "CNSHAUK244A",
    //           "carrierServiceCode": null,
    //           "exportVoyageNumber": "UK244A",
    //           "importVoyageNumber": null,
    //           "unLocationCode": "CNSHA",
    //           "facilityCode": null,
    //           "facilityCodeListProvider": null,
    //           "facilityTypeCode": "POTE",
    //           "otherFacility": null,
    //           "modeOfTransport": "VESSEL",
    //           "vessel": {
    //               "vesselIMONumber": "9400289",
    //               "vesselName": "NAVARINO",
    //               "vesselFlag": null,
    //               "vesselCallSignNumber": null,
    //               "vesselOperatorCarrierCode": null,
    //               "vesselOperatorCarrierCodeList": null
    //           }
    //       },
    //       "documentReferences": [
    //           {
    //               "documentReferenceType": "BKG",
    //               "documentReferenceValue": "177SYHYHSB09531"
    //           },
    //           {
    //               "documentReferenceType": "TRD",
    //               "documentReferenceValue": "MEDUOL197367"
    //           }
    //       ],
    //       "eventLocation": {
    //           "locationName": "SHANGHAI",
    //           "unLocationCode": "CNSHA",
    //           "facilityCode": null,
    //           "facilityCodeListProvider": null
    //       },
    //       "seals": [
    //           {
    //               "sealNumber": "FJ16648316",
    //               "sealSource": "CAR"
    //           }
    //       ],
    //       "description": "Export Loaded on Vessel",
    //       "eventId": "1075525830",
    //       "eventDateTime": "2022-11-10T10:04:00Z",
    //       "eventClassifierCode": "ACT",
    //       "eventCreatedDateTime": "2022-11-10T10:04:00Z",
    //       "references": []
    //   },
    //   {
    //       "eventType": "EQUIPMENT",
    //       "equipmentEventTypeCode": "GTIN",
    //       "equipmentReference": "MSCU5956818",
    //       "ISOEquipmentCode": "4310",
    //       "emptyIndicatorCode": "LADEN",
    //       "transportCall": {
    //           "transportCallID": "CNSHATRB",
    //           "carrierServiceCode": null,
    //           "exportVoyageNumber": null,
    //           "importVoyageNumber": null,
    //           "unLocationCode": "CNSHA",
    //           "facilityCode": null,
    //           "facilityCodeListProvider": null,
    //           "facilityTypeCode": "POTE",
    //           "otherFacility": null,
    //           "modeOfTransport": "TRUCK",
    //           "vessel": null
    //       },
    //       "documentReferences": [
    //           {
    //               "documentReferenceType": "BKG",
    //               "documentReferenceValue": "177SYHYHSB09531"
    //           },
    //           {
    //               "documentReferenceType": "TRD",
    //               "documentReferenceValue": "MEDUOL197367"
    //           }
    //       ],
    //       "eventLocation": {
    //           "locationName": "SHANGHAI",
    //           "unLocationCode": "CNSHA",
    //           "facilityCode": null,
    //           "facilityCodeListProvider": null
    //       },
    //       "seals": [
    //           {
    //               "sealNumber": "FJ16648316",
    //               "sealSource": "CAR"
    //           }
    //       ],
    //       "description": "Export received at CY",
    //       "eventId": "1073821792",
    //       "eventDateTime": "2022-11-06T11:59:00Z",
    //       "eventClassifierCode": "ACT",
    //       "eventCreatedDateTime": "2022-11-06T11:59:00Z",
    //       "references": []
    //   },
    //   {
    //     "eventType": "GTOT",
    //     "equipmentEventTypeCode": "EMPTY",
    //     "equipmentReference": "MSCU5956818",
    //     "ISOEquipmentCode": "4310",
    //     "emptyIndicatorCode": "EMPTY",
    //     "transportCall": {
    //         "transportCallID": "CNSHATRB",
    //         "carrierServiceCode": null,
    //         "exportVoyageNumber": null,
    //         "importVoyageNumber": null,
    //         "unLocationCode": "CNSHA",
    //         "facilityCode": null,
    //         "facilityCodeListProvider": null,
    //         "facilityTypeCode": "POTE",
    //         "otherFacility": null,
    //         "modeOfTransport": "TRUCK",
    //         "vessel": null
    //     },
    //     "documentReferences": [
    //         {
    //             "documentReferenceType": "BKG",
    //             "documentReferenceValue": "177SYHYHSB09531"
    //         },
    //         {
    //             "documentReferenceType": "TRD",
    //             "documentReferenceValue": "MEDUOL197367"
    //         }
    //     ],
    //     "eventLocation": {
    //         "locationName": "SHANGHAI",
    //         "unLocationCode": "CNSHA",
    //         "facilityCode": null,
    //         "facilityCodeListProvider": null
    //     },
    //     "seals": [
    //         {
    //             "sealNumber": "FJ16648316",
    //             "sealSource": "CAR"
    //         }
    //     ],
    //     "description": "Empty to Shipper",
    //     "eventId": "1069516818",
    //     "eventDateTime": "2022-10-28T01:38:00Z",
    //     "eventClassifierCode": "ACT",
    //     "eventCreatedDateTime": "2022-10-28T01:38:00Z",
    //     "references": []
    //     },
    //     {
    //         "eventType": "EQUIPMENT",
    //         "equipmentEventTypeCode": "DISC",
    //         "equipmentReference": "MSCU5956818",
    //         "ISOEquipmentCode": "4310",
    //         "emptyIndicatorCode": "LADEN",
    //         "transportCall": {
    //             "transportCallID": "KRPUSUK244A",
    //             "carrierServiceCode": null,
    //             "exportVoyageNumber": null,
    //             "importVoyageNumber": "UK244A",
    //             "unLocationCode": "KRPUS",
    //             "facilityCode": "PNP",
    //             "facilityCodeListProvider": "SMDG",
    //             "facilityTypeCode": "POTE",
    //             "otherFacility": null,
    //             "modeOfTransport": "VESSEL",
    //             "vessel": {
    //                 "vesselIMONumber": "9400289",
    //                 "vesselName": "NAVARINO",
    //                 "vesselFlag": null,
    //                 "vesselCallSignNumber": null,
    //                 "vesselOperatorCarrierCode": null,
    //                 "vesselOperatorCarrierCodeList": null
    //             }
    //         },
    //         "documentReferences": [
    //             {
    //                 "documentReferenceType": "BKG",
    //                 "documentReferenceValue": "177SYHYHSB09531"
    //             },
    //             {
    //                 "documentReferenceType": "TRD",
    //                 "documentReferenceValue": "MEDUOL197367"
    //             }
    //         ],
    //         "eventLocation": {
    //             "locationName": "BUSAN",
    //             "unLocationCode": "KRPUS",
    //             "facilityCode": "PNP",
    //             "facilityCodeListProvider": "SMDG"
    //         },
    //         "seals": [
    //             {
    //                 "sealNumber": "FJ16648316",
    //                 "sealSource": "CAR"
    //             }
    //         ],
    //         "description": "Full Transshipment Discharged",
    //         "eventId": "1078740398",
    //         "eventDateTime": "2022-11-17T08:50:00Z",
    //         "eventClassifierCode": "ACT",
    //         "eventCreatedDateTime": "2022-11-17T08:50:00Z",
    //         "references": []
    //     },
    //     {
    //         "eventType": "TRANSPORT",
    //         "transportEventTypeCode": "ARRI",
    //         "transportCall": {
    //             "transportCallID": "KRPUSUK244A",
    //             "carrierServiceCode": null,
    //             "exportVoyageNumber": null,
    //             "importVoyageNumber": null,
    //             "unLocationCode": "KRPUS",
    //             "facilityCode": "PNP",
    //             "facilityCodeListProvider": "SMDG",
    //             "facilityTypeCode": "POTE",
    //             "otherFacility": null,
    //             "modeOfTransport": "VESSEL",
    //             "vessel": {
    //                 "vesselIMONumber": "9400289",
    //                 "vesselName": "NAVARINO",
    //                 "vesselFlag": null,
    //                 "vesselCallSignNumber": null,
    //                 "vesselOperatorCarrierCode": null,
    //                 "vesselOperatorCarrierCodeList": null
    //             }
    //         },
    //         "documentReferences": [
    //             {
    //                 "documentReferenceType": "BKG",
    //                 "documentReferenceValue": "177SYHYHSB09531"
    //             },
    //             {
    //                 "documentReferenceType": "TRD",
    //                 "documentReferenceValue": "MEDUOL197367"
    //             }
    //         ],
    //         "description": "Vessel Arrival",
    //         "eventId": "ACT2022-11-17T04:00:00:00+09:00",
    //         "eventDateTime": "2022-11-17T04:00:00Z",
    //         "eventClassifierCode": "ACT",
    //         "eventCreatedDateTime": "2022-11-17T04:00:00Z",
    //         "references": []
    //     },
    //     {
    //       "eventType": "EQUIPMENT",
    //       "equipmentEventTypeCode": "LOAD",
    //       "equipmentReference": "MSCU5956818",
    //       "ISOEquipmentCode": "4310",
    //       "emptyIndicatorCode": "LADEN",
    //       "transportCall": {
    //           "transportCallID": "CNSHAUK244A",
    //           "carrierServiceCode": null,
    //           "exportVoyageNumber": "UK244A",
    //           "importVoyageNumber": null,
    //           "unLocationCode": "CNSHA",
    //           "facilityCode": null,
    //           "facilityCodeListProvider": null,
    //           "facilityTypeCode": "POTE",
    //           "otherFacility": null,
    //           "modeOfTransport": "VESSEL",
    //           "vessel": {
    //               "vesselIMONumber": "9400289",
    //               "vesselName": "NAVARINO",
    //               "vesselFlag": null,
    //               "vesselCallSignNumber": null,
    //               "vesselOperatorCarrierCode": null,
    //               "vesselOperatorCarrierCodeList": null
    //           }
    //       },
    //       "documentReferences": [
    //           {
    //               "documentReferenceType": "BKG",
    //               "documentReferenceValue": "177SYHYHSB09531"
    //           },
    //           {
    //               "documentReferenceType": "TRD",
    //               "documentReferenceValue": "MEDUOL197367"
    //           }
    //       ],
    //       "eventLocation": {
    //           "locationName": "SHANGHAI",
    //           "unLocationCode": "CNSHA",
    //           "facilityCode": null,
    //           "facilityCodeListProvider": null
    //       },
    //       "seals": [
    //           {
    //               "sealNumber": "FJ16648316",
    //               "sealSource": "CAR"
    //           }
    //       ],
    //       "description": "Export Loaded on Vessel",
    //       "eventId": "1075525830",
    //       "eventDateTime": "2022-11-10T10:04:00Z",
    //       "eventClassifierCode": "ACT",
    //       "eventCreatedDateTime": "2022-11-10T10:04:00Z",
    //       "references": []
    //     },
    //     {
    //       "eventType": "EQUIPMENT",
    //       "equipmentEventTypeCode": "GTIN",
    //       "equipmentReference": "MSCU5956818",
    //       "ISOEquipmentCode": "4310",
    //       "emptyIndicatorCode": "LADEN",
    //       "transportCall": {
    //           "transportCallID": "CNSHATRB",
    //           "carrierServiceCode": null,
    //           "exportVoyageNumber": null,
    //           "importVoyageNumber": null,
    //           "unLocationCode": "CNSHA",
    //           "facilityCode": null,
    //           "facilityCodeListProvider": null,
    //           "facilityTypeCode": "POTE",
    //           "otherFacility": null,
    //           "modeOfTransport": "TRUCK",
    //           "vessel": null
    //       },
    //       "documentReferences": [
    //           {
    //               "documentReferenceType": "BKG",
    //               "documentReferenceValue": "177SYHYHSB09531"
    //           },
    //           {
    //               "documentReferenceType": "TRD",
    //               "documentReferenceValue": "MEDUOL197367"
    //           }
    //       ],
    //       "eventLocation": {
    //           "locationName": "SHANGHAI",
    //           "unLocationCode": "CNSHA",
    //           "facilityCode": null,
    //           "facilityCodeListProvider": null
    //       },
    //       "seals": [
    //           {
    //               "sealNumber": "FJ16648316",
    //               "sealSource": "CAR"
    //           }
    //       ],
    //       "description": "Export received at CY",
    //       "eventId": "1073821792",
    //       "eventDateTime": "2022-11-06T11:59:00Z",
    //       "eventClassifierCode": "ACT",
    //       "eventCreatedDateTime": "2022-11-06T11:59:00Z",
    //       "references": []
    //     },
    //     {
    //       "eventType": "EQUIPMENT",
    //       "equipmentEventTypeCode": "LOAD",
    //       "equipmentReference": "MSCU5956818",
    //       "ISOEquipmentCode": "4310",
    //       "emptyIndicatorCode": "LADEN",
    //       "transportCall": {
    //           "transportCallID": "KRPUSUK244A",
    //           "carrierServiceCode": null,
    //           "exportVoyageNumber": null,
    //           "importVoyageNumber": "UK244A",
    //           "unLocationCode": "KRPUS",
    //           "facilityCode": "PNP",
    //           "facilityCodeListProvider": "SMDG",
    //           "facilityTypeCode": "POTE",
    //           "otherFacility": null,
    //           "modeOfTransport": "VESSEL",
    //           "vessel": {
    //               "vesselIMONumber": "9400289",
    //               "vesselName": "NAVARINO",
    //               "vesselFlag": null,
    //               "vesselCallSignNumber": null,
    //               "vesselOperatorCarrierCode": null,
    //               "vesselOperatorCarrierCodeList": null
    //           }
    //       },
    //       "documentReferences": [
    //           {
    //               "documentReferenceType": "BKG",
    //               "documentReferenceValue": "177SYHYHSB09531"
    //           },
    //           {
    //               "documentReferenceType": "TRD",
    //               "documentReferenceValue": "MEDUOL197367"
    //           }
    //       ],
    //       "eventLocation": {
    //           "locationName": "BUSAN",
    //           "unLocationCode": "KRPUS",
    //           "facilityCode": "PNP",
    //           "facilityCodeListProvider": "SMDG"
    //       },
    //       "seals": [
    //           {
    //               "sealNumber": "FJ16648316",
    //               "sealSource": "CAR"
    //           }
    //       ],
    //       "description": "Full Transshipment Loaded",
    //       "eventId": "1076804822",
    //       "eventDateTime": "2022-11-13T13:32:00Z",
    //       "eventClassifierCode": "ACT",
    //       "eventCreatedDateTime": "2022-11-13T13:32:00Z",
    //       "references": []
    //     },
    //     {
    //       "eventType": "EQUIPMENT",
    //       "equipmentEventTypeCode": "DISC",
    //       "equipmentReference": "MSCU5956818",
    //       "ISOEquipmentCode": "4310",
    //       "emptyIndicatorCode": "LADEN",
    //       "transportCall": {
    //           "transportCallID": "KRPUSUK244A",
    //           "carrierServiceCode": null,
    //           "exportVoyageNumber": null,
    //           "importVoyageNumber": "UK244A",
    //           "unLocationCode": "KRPUS",
    //           "facilityCode": "PNP",
    //           "facilityCodeListProvider": "SMDG",
    //           "facilityTypeCode": "POTE",
    //           "otherFacility": null,
    //           "modeOfTransport": "VESSEL",
    //           "vessel": {
    //               "vesselIMONumber": "9400289",
    //               "vesselName": "NAVARINO",
    //               "vesselFlag": null,
    //               "vesselCallSignNumber": null,
    //               "vesselOperatorCarrierCode": null,
    //               "vesselOperatorCarrierCodeList": null
    //           }
    //       },
    //       "documentReferences": [
    //           {
    //               "documentReferenceType": "BKG",
    //               "documentReferenceValue": "177SYHYHSB09531"
    //           },
    //           {
    //               "documentReferenceType": "TRD",
    //               "documentReferenceValue": "MEDUOL197367"
    //           }
    //       ],
    //       "eventLocation": {
    //           "locationName": "BUSAN",
    //           "unLocationCode": "KRPUS",
    //           "facilityCode": "PNP",
    //           "facilityCodeListProvider": "SMDG"
    //       },
    //       "seals": [
    //           {
    //               "sealNumber": "FJ16648316",
    //               "sealSource": "CAR"
    //           }
    //       ],
    //       "description": "Full Transshipment Discharged",
    //       "eventId": "1078740398",
    //       "eventDateTime": "2022-11-17T08:50:00Z",
    //       "eventClassifierCode": "ACT",
    //       "eventCreatedDateTime": "2022-11-17T08:50:00Z",
    //       "references": []
    //     }
  ];

  return simulatedProducts;
};

module.exports = {
  _getMSCproducts,
};
