import fs from 'fs';
import path from 'path';
import axios from 'axios';
import {
  ParserResult,
  ShipmentInput,
  ParserOptions,
} from '../../utils/types/shipment-parser.interface';
import { IShipment } from '../../utils/types/models.interface';
import { config } from '../../config/shipment-parser/shipment-parser.config';
import { formatShipmentData } from './formatter';

const apiDocumentationLink =
  'https://developer.dhl.com/api-reference/shipment-tracking#get-started-section/';

function getStandardStructure(): string {
  return `{
    "HousebillNumber": "String", // This would be the tracking number
    "Origin": {
      "LocationCode": "String", // Origin location code in ISO 3166 code
      "LocationName": "String", // Origin location name
      "CountryCode": "String" // Origin country code in ISO 3166 code
    },
    "Destination": {
      "LocationCode": "String", // Destination location code in ISO 3166 code
      "LocationName": "String", // Destination location name
      "CountryCode": "String" // Destination country code in ISO 3166 code
    },
    "DateAndTimes": {
      "ScheduledDeparture": "String", // Scheduled or estimated departure date from origin
      "ScheduledArrival": "String", // Scheduled or estimated arrival date at destination
      "ShipmentDate": "String" // Shipment date
    },
    "ProductType": "String", // Product type - Optional
    "TotalPackages": "Number", // Total packages in the shipment - Optional
    "TotalWeight": {
      "*body": "Number", // Total weight - Only the quantity
      "@uom": "String" // Total weight - Unit of measure (KG, LB, etc.)
    },
    "TotalVolume": {
      "*body": "Number", // Total volume - Only the quantity
      "@uom": "String" // Total volume - Unit of measure (m³, ft³, etc.)
    },
    "Timestamp": [ // Array of events
      {
        "TimestampCode": "String", // Event code
        "TimestampDescription": "String", // Event description
        "TimestampDateTime": "Date", // Event occurrence date
        "TimestampLocation": "String" // Event location
      }
    ],
    "brokerName": "String", // Carrier name
    "incoterms": "String", // Delivery terms
    "shipmentDate": "String", // Shipment date
    "booking": "String", // Booking number
    "mawb": "String", // Master Air Waybill number (MAWB)
    "hawb": "String", // House Air Waybill number (HAWB)
    "flight": "String", // Flight number
    "airportOfDeparture": "String", // Departure airport name
    "etd": "String", // Estimated Time of Departure (ETD)
    "atd": "String", // Actual Time of Departure (ATD)
    "airportOfArrival": "String", // Arrival airport name
    "eta": "String", // Estimated Time of Arrival (ETA)
    "ata": "String", // Actual Time of Arrival (ATA)
    "vessel": "String", // Vessel name
    "portOfLoading": "String", // Port of loading name
    "mbl": "String", // Master Bill of Lading number (MBL)
    "hbl": "String", // House Bill of Lading number (HBL)
    "pickupDate": "String", // Pickup date
    "containerNumber": "String", // Container number
    "portOfUnloading": "String", // Port of unloading name
    "finalDestination": "String", // Final destination name
    "internationalCarrier": "String", // International carrier name
    "voyage": "String", // Voyage number
    "portOfReceipt": "String", // Port of receipt name
    "goodsDescription": "String", // Goods description
    "containers": [] // List of containers associated with the shipment
  }`;
}

async function parseJsonWithOpenAI(
  inputJson: ShipmentInput,
): Promise<IShipment> {
  const prompt = `
  As a helpful assistant for the Kontroll application, your task is to parse the provided JSON data and convert it into the standard shipment tracking structure. Ensure the output is a valid JSON object with correct data types and that any optional fields missing in the input are set to null. 
  
  The output must be exclusively JSON without any additional text.
  
  Here is the input JSON:
  ${JSON.stringify(inputJson, null, 2)}
  
  The standard structure for shipment tracking is as follows:
  ${getStandardStructure()} 

  
  Your response should only contain the JSON object. Do not include any other text. Ensure that the output is a valid JSON format.
  
  If the fields ScheduledDeparture, ScheduledArrival, and ShipmentDate are not present in the input JSON, you should look for them in the events.
  
  API documentation for reference: ${apiDocumentationLink}
  `;

  try {
    const response = await axios.post(
      config.openai.apiEndpoint,
      {
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that parses JSON data.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.openai.apiKey}`,
        },
      },
    );

    const responseText = response.data.choices[0].message.content.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in the response');
    }

    const parsedJson = jsonMatch[0];
    const parsedData = JSON.parse(parsedJson);
    const formattedData = formatShipmentData(parsedData);

    return removeSpecificNullFields(formattedData);
  } catch (error: any) {
    throw new Error(`Failed to parse JSON with OpenAI: ${error.message}`);
  }
}

function removeSpecificNullFields(obj: Partial<IShipment>): IShipment {
  const optionalFields: Array<keyof IShipment> = [
    'brokerName',
    'incoterms',
    'shipmentDate',
    'booking',
    'mawb',
    'hawb',
    'flight',
    'airportOfDeparture',
    'etd',
    'atd',
    'airportOfArrival',
    'eta',
    'ata',
    'vessel',
    'portOfLoading',
    'mbl',
    'hbl',
    'pickupDate',
    'containerNumber',
    'portOfUnloading',
    'finalDestination',
    'internationalCarrier',
    'voyage',
    'portOfReceipt',
    'goodsDescription',
    'containers',
  ];

  const result: IShipment = {
    HousebillNumber: obj.HousebillNumber || '',
    Origin: obj.Origin || {
      LocationCode: '',
      LocationName: '',
      CountryCode: '',
    },
    Destination: obj.Destination || {
      LocationCode: '',
      LocationName: '',
      CountryCode: '',
    },
    DateAndTimes: obj.DateAndTimes || {
      ScheduledDeparture: null,
      ScheduledArrival: null,
      ShipmentDate: null,
    },
    ProductType: obj.ProductType || null,
    TotalPackages: obj.TotalPackages || null,
    TotalWeight: obj.TotalWeight || {
      '*body': null,
      '@uom': null,
    },
    TotalVolume: obj.TotalVolume || {
      '*body': null,
      '@uom': null,
    },
    Timestamp: obj.Timestamp || [],
  };

  if (!result.HousebillNumber) {
    throw new Error('HousebillNumber is required');
  }

  for (const key of optionalFields) {
    const value = obj[key];
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      (result as any)[key] = value;
    }
  }

  return result;
}

async function generateMappingDictionary(
  inputJson: any,
  parsedData: any,
): Promise<Record<string, string>> {
  console.log('Generating mapping dictionary using OpenAI');

  const prompt = `
  Analyze the following input JSON and its corresponding parsed output.
  Create a comprehensive mapping dictionary where the keys are the paths in the input JSON
  and the values are the corresponding paths in the parsed output.
  Use dot notation for nested objects and [] for array indices.
  Include mappings for all fields present in both the input and output, even if they are null or empty.
  Pay special attention to fields like ProductType, TotalPackages, and any other fields that might be missing in the current mapping.
  
  Input JSON:
  ${JSON.stringify(inputJson, null, 2)}
  
  Parsed Output:
  ${JSON.stringify(parsedData, null, 2)}
  
  Return only the JSON mapping dictionary without any additional text or formatting.
  Ensure the response is a valid JSON object.
  `;

  try {
    const response = await axios.post(
      config.openai.apiEndpoint,
      {
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that creates comprehensive mapping dictionaries for JSON structures. Always respond with valid JSON only.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.openai.apiKey}`,
        },
      },
    );

    const responseContent = response.data.choices[0].message.content.trim();
    let mappingDictionary;

    try {
      mappingDictionary = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', responseContent);
      throw new Error('Invalid JSON in OpenAI response');
    }

    if (typeof mappingDictionary !== 'object' || mappingDictionary === null) {
      throw new Error('OpenAI response is not a valid mapping dictionary');
    }

    console.log('Generated mapping dictionary:', mappingDictionary);
    return mappingDictionary;
  } catch (error: any) {
    console.error(
      'Error generating mapping dictionary with OpenAI:',
      error.message,
    );
    throw new Error(`Failed to generate mapping dictionary: ${error.message}`);
  }
}

function saveMappingDictionary(mapping: any) {
  const filePath = path.join(__dirname, '..', '..', 'mappingDictionary.json');
  fs.writeFileSync(filePath, JSON.stringify(mapping, null, 2));
}

export async function parseShipmentData(
  input: ShipmentInput,
  options?: ParserOptions,
): Promise<ParserResult> {
  try {
    if (Object.keys(input).length === 0) {
      throw new Error('Input JSON is empty');
    }
    console.log('Using OpenAI in parsing function ', options?.useOpenAI);

    if (!options?.useOpenAI) {
      throw new Error('OpenAI option is not enabled');
    }

    const parsedData = await parseJsonWithOpenAI(input);
    const mappingDictionary = await generateMappingDictionary(
      input,
      parsedData,
    );
    saveMappingDictionary(mappingDictionary);

    return {
      success: true,
      data: parsedData,
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Error parsing shipment with OpenAI: ${error.message}`,
    };
  }
}
