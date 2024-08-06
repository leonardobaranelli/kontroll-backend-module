import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { encode } from 'gpt-3-encoder';
import {
  ParserResult,
  ShipmentInput,
  ParserOptions,
} from '../../utils/types/shipment-parser.interface';
import { IShipment } from '../../utils/types/models.interface';
import { config } from '../../config/shipment-parser/shipment-parser.config';
import { formatShipmentData } from './formatter';

function getStandardStructure(): string {
  return `{
    "HousebillNumber": "String", // The unique tracking number or house bill number for the shipment. This serves as the primary identifier for tracking the shipment.
    "Origin": {
      "LocationCode": "String", // The ISO 3166 location code for the origin location. This code uniquely identifies the city or region where the shipment originated.
      "LocationName": "String", // The name of the origin location, typically the city or region name.
      "CountryCode": "String" // The ISO 3166 country code for the origin country. This code uniquely identifies the country where the shipment originated.
    },
    "Destination": {
      "LocationCode": "String", // The ISO 3166 location code for the destination location. This code uniquely identifies the city or region where the shipment is being delivered.
      "LocationName": "String", // The name of the destination location, typically the city or region name.
      "CountryCode": "String" // The ISO 3166 country code for the destination country. This code uniquely identifies the country where the shipment is being delivered.
    },
    "DateAndTimes": {
      "ScheduledDeparture": "String", // The scheduled or estimated departure date and time from the origin. This indicates when the shipment is expected to leave the origin.
      "ScheduledArrival": "String", // The scheduled or estimated arrival date and time at the destination. This indicates when the shipment is expected to arrive at the destination.
      "ShipmentDate": "String" // The actual date and time when the shipment was dispatched. This is the date when the shipment was handed over to the carrier.
    },
    "ProductType": "String", // The type of product being shipped. This is an optional field that describes the nature of the goods in the shipment.
    "TotalPackages": "Number", // The total number of packages included in the shipment. This is an optional field.
    "TotalWeight": {
      "*body": "Number", // The total weight of the shipment, including all packages. This is only the numerical value.
      "@uom": "String" // The unit of measure for the weight (e.g., KG for kilograms, LB for pounds).
    },
    "TotalVolume": {
      "*body": "Number", // The total volume of the shipment, including all packages. This is only the numerical value.
      "@uom": "String" // The unit of measure for the volume (e.g., m³ for cubic meters, ft³ for cubic feet).
    },
    "Timestamp": [ // An array of events that occurred during the shipment's transit. Each event provides details about a significant moment in the shipment's journey.
      {
        "TimestampCode": "String", // The code representing the type of event (e.g., PU for Picked Up, DL for Delivered).
        "TimestampDescription": "String", // A description of the event (e.g., "Shipment picked up from the origin").
        "TimestampDateTime": "Date", // The date and time when the event occurred.
        "TimestampLocation": "String" // The location where the event took place, typically the city or region name.
      }
    ],
    "brokerName": "String", // The name of the carrier or freight forwarder responsible for transporting the shipment.
    "incoterms": "String", // The international commercial terms (Incoterms) that define the responsibilities of buyers and sellers in the shipment process.
    "shipmentDate": "String", // The actual date when the shipment was dispatched.
    "booking": "String", // The booking number associated with the shipment.
    "mawb": "String", // The Master Air Waybill number for the shipment. This is used for air freight.
    "hawb": "String", // The House Air Waybill number for the shipment. This is used for air freight.
    "flight": "String", // The flight number if the shipment is transported by air.
    "airportOfDeparture": "String", // The name of the airport where the shipment departs.
    "etd": "String", // The estimated time of departure from the origin.
    "atd": "String", // The actual time of departure from the origin.
    "airportOfArrival": "String", // The name of the airport where the shipment arrives.
    "eta": "String", // The estimated time of arrival at the destination.
    "ata": "String", // The actual time of arrival at the destination.
    "vessel": "String", // The name of the vessel if the shipment is transported by sea.
    "portOfLoading": "String", // The name of the port where the shipment is loaded onto the vessel.
    "mbl": "String", // The Master Bill of Lading number for the shipment. This is used for sea freight.
    "hbl": "String", // The House Bill of Lading number for the shipment. This is used for sea freight.
    "pickupDate": "String", // The date when the shipment was picked up from the origin.
    "containerNumber": "String", // The number of the container if the shipment is transported in a container.
    "portOfUnloading": "String", // The name of the port where the shipment is unloaded from the vessel.
    "finalDestination": "String", // The final destination of the shipment.
    "internationalCarrier": "String", // The name of the international carrier transporting the shipment.
    "voyage": "String", // The voyage number if the shipment is transported by sea.
    "portOfReceipt": "String", // The name of the port where the carrier received the shipment.
    "goodsDescription": "String", // A description of the goods being shipped.
    "containers": [] // A list of containers associated with the shipment. Each container can have its own set of details and identifiers.
  }`;
}

function countTokens(text: string): number {
  return encode(text).length;
}

async function parseJsonWithOpenAI(inputJson: ShipmentInput) {
  const prompt = `### Instruction ###
  You are a highly capable JSON parsing assistant for the Kontroll application. Your tasks are:
  
  1. **Parse the provided JSON data**: Convert the input JSON into the standard shipment tracking structure as defined below. Ensure to deeply analyze and parse all nested structures.
  
  2. **Create a mapping dictionary**: Show how each input field maps to the corresponding output field in the standard structure.
  
  ### Input JSON ###
  \`\`\`json
  ${JSON.stringify(inputJson, null, 2)}
  \`\`\`
  
  ### Standard Structure for Shipment Tracking ###
  \`\`\`json
  ${getStandardStructure()}
  \`\`\`
  
  ### Response Format ###
  \`\`\`json
  {
    "parsedData": {
      // Parsed JSON object here, following the standard structure
    },
    "mappingDictionary": {
      // Mapping key-value pairs here, where keys are input paths and values are output paths
    }
  }
  \`\`\`
  
  ### Instructions ###
  - Ensure the output is a valid JSON object with correct data types.
  - Any optional fields missing in the input should be set to null.
  - HouseBillNumber is the main identifier for the shipment, so it should be mapped to the shipment or tracking field in the output which is higher on the structure of the JSON.
  - If fields like ScheduledDeparture, ScheduledArrival, and ShipmentDate are not present in the input JSON, look for them in the events array and use the most relevant event dates to populate these fields.
  - For arrays, map each relevant field from the input to the corresponding output structure using the index notation for the array elements.
  - For nested objects, use dot notation to specify the path to each field.
  - Identify and map all relevant date and time fields, and ensure they are formatted consistently in the output.
  - Ensure that all weight and volume fields are correctly mapped, including their units of measure.
  - Map event-related fields such as timestamps, event codes, and descriptions to the corresponding fields in the output structure.
  - Be thorough and ensure no fields from the standard structure are left unmapped. Include mappings for all fields present in both the input and output, even if they are null or empty.
  - **Analyze deeply nested structures**: Ensure that all nested objects and arrays are thoroughly analyzed and mapped to the corresponding fields in the standard structure.
  - **Iterate over all keys and arrays**: Dynamically iterate over all keys and arrays to ensure a comprehensive mapping.

  ### Mapping Dictionary Guidelines ###
  1. Use dot notation for nested objects and [] for array indices.
  2. Include mappings for ALL fields present in both the input and output, even if they are null or empty.
  3. Pay special attention to fields like ProductType, TotalPackages, TotalWeight, TotalVolume, and all timestamp-related fields.
  4. If a field in the standard structure doesn't have a direct correspondence in the input, map it to null or the most appropriate alternative.
  5. For arrays like Timestamp, map each relevant field from the input to the corresponding output structure.
  6. Ensure all fields from the input are mapped to the output, even if the output field is null.
  
  Ensure no fields from the standard structure are left unmapped. Your response should be concise, clear, and formatted correctly as JSON without any additional text or comments.
  `;
  const promptTokens = countTokens(prompt);
  console.log(`Prompt: ${prompt}`);
  console.log(`Prompt tokens: ${promptTokens}`);

  try {
    const response = await axios.post(
      config.openai.apiEndpoint,
      {
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that parses JSON data and creates mapping dictionaries. Always respond with valid JSON only, without any additional formatting or text.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        top_p: 0.9,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.openai.apiKey}`,
        },
      },
    );

    const responseText = response.data.choices[0].message.content.trim();
    const responseTokens = countTokens(responseText);
    console.log(`Response tokens: ${responseTokens}`);
    console.log(`Total tokens: ${promptTokens + responseTokens}`);

    const cleanedResponse = responseText.replace(/```json\n|\n```/g, '');

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError: any) {
      console.error('Error parsing OpenAI response:', cleanedResponse);
      throw new Error(`Invalid JSON in OpenAI response: ${parseError.message}`);
    }

    if (!parsedResponse.parsedData || !parsedResponse.mappingDictionary) {
      console.error('Incomplete OpenAI response:', parsedResponse);
      throw new Error(
        'OpenAI response is missing parsedData or mappingDictionary',
      );
    }

    const formattedData = formatShipmentData(parsedResponse.parsedData);
    const finalData = removeSpecificNullFields(formattedData);
    let enhancedMappingDictionary;
    try {
      const cleanMappingDictionary = Object.fromEntries(
        Object.entries(parsedResponse.mappingDictionary)
          .filter(([_, v]) => v != null && v !== 'null')
          .map(([k, v]) => [k, String(v)]),
      );
      enhancedMappingDictionary = enhanceMappingDictionary(
        cleanMappingDictionary,
      );
    } catch (error: any) {
      console.error('Error enhancing mapping dictionary:', error);
      enhancedMappingDictionary = parsedResponse.mappingDictionary;
    }

    return {
      parsedData: finalData,
      mappingDictionary: enhancedMappingDictionary,
    };
  } catch (error: any) {
    console.error('Error in parseJsonWithOpenAI:', error);
    throw new Error(`Failed to parse JSON with OpenAI: ${error.message}`);
  }
}

function enhanceMappingDictionary(
  mappingDictionary: Record<string, string>,
): Record<string, string> {
  const enhancedMapping: Record<string, string> = {};
  let standardStructure;

  try {
    standardStructure = JSON.parse(getStandardStructure());
  } catch (error) {
    console.error('Error parsing standard structure:', error);
    return mappingDictionary;
  }

  function recursivelyCheckFields(obj: any, path: string = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = path ? `${path}.${key}` : key;
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        recursivelyCheckFields(value, fullPath);
      } else if (!mappingDictionary[fullPath]) {
        enhancedMapping[fullPath] = 'null';
      }
    }
  }

  recursivelyCheckFields(standardStructure);
  for (const [key, value] of Object.entries(mappingDictionary)) {
    if (value !== null && value !== 'null') {
      enhancedMapping[key] = value;
    }
  }

  return enhancedMapping;
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

    const { parsedData, mappingDictionary } = await parseJsonWithOpenAI(input);
    saveMappingDictionary(mappingDictionary);

    return {
      success: true,
      data: parsedData,
      mappingDictionary: mappingDictionary,
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Error parsing shipment with OpenAI: ${error.message}`,
    };
  }
}
