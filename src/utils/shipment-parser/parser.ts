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
import { parseShipment as parseShipmentWithMemory } from './memory-parser';
import { formatShipmentData } from './formatter';

const apiDocumentationLink =
  'https://developer.dhl.com/api-reference/shipment-tracking#get-started-section/';

async function parseJsonWithOpenAI(
  inputJson: ShipmentInput,
): Promise<IShipment> {
  console.log('Preparing OpenAI request...');

  const prompt = `
  As a helpful assistant for the Kontroll application, your task is to parse the provided JSON data and convert it into the standard shipment tracking structure. Ensure the output is a valid JSON object with correct data types and that any optional fields missing in the input are set to null. 
  
  The output must be exclusively JSON without any additional text.
  
  Here is the input JSON:
  ${JSON.stringify(inputJson, null, 2)}
  
  The standard structure for shipment tracking is as follows:
  ${JSON.stringify({}, null, 2)}
  
  Your response should only contain the JSON object. Do not include any other text. Ensure that the output is a valid JSON format.
  
  If the fields ScheduledDeparture, ScheduledArrival, and ShipmentDate are not present in the input JSON, you should look for them in the events.
  
  API documentation for reference: ${apiDocumentationLink}
  `;

  console.log('Sending request to OpenAI...');

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

    console.log('Received response from OpenAI');

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
    console.error('Error in OpenAI API call:', error.message);
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
    HousebillNumber: '',
    Origin: {
      LocationCode: '',
      LocationName: '',
      CountryCode: '',
    },
    Destination: {
      LocationCode: '',
      LocationName: '',
      CountryCode: '',
    },
    DateAndTimes: {
      ScheduledDeparture: null,
      ScheduledArrival: null,
      ShipmentDate: null,
    },
    ProductType: null,
    TotalPackages: null,
    TotalWeight: {
      '*body': 0,
      '@uom': '',
    },
    TotalVolume: {
      '*body': 0,
      '@uom': '',
    },
    Timestamp: [
      {
        TimestampCode: '',
        TimestampDescription: '',
        TimestampDateTime: '',
        TimestampLocation: '',
      },
    ],
    // Add the missing properties
    brokerName: null,
    incoterms: null,
    shipmentDate: null,
    booking: null,
    mawb: null,
    hawb: null,
    flight: null,
    airportOfDeparture: null,
    etd: null,
    atd: null,
    airportOfArrival: null,
    eta: null,
    ata: null,
    vessel: null,
    portOfLoading: null,
    mbl: null,
    hbl: null,
    pickupDate: null,
    containerNumber: null,
    portOfUnloading: null,
    finalDestination: null,
    internationalCarrier: null,
    voyage: null,
    portOfReceipt: null,
    goodsDescription: null,
    containers: null,
  };

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key as keyof IShipment];
      if (value !== null || !optionalFields.includes(key as keyof IShipment)) {
        (result as any)[key] = value;
      }
    }
  }

  return result;
}

function generateMappingDictionary(inputJson: any, parsedData: any): any {
  const mapping: any = {};

  function findMatchingValues(
    input: any,
    output: any,
    inputPath: string = '',
    outputPath: string = '',
  ) {
    if (Array.isArray(input)) {
      input.forEach((item, index) => {
        findMatchingValues(item, output, `${inputPath}[${index}]`, outputPath);
      });
    } else if (typeof input === 'object' && input !== null) {
      for (const key in input) {
        const newInputPath = inputPath ? `${inputPath}.${key}` : key;
        if (typeof input[key] === 'object' && input[key] !== null) {
          findMatchingValues(input[key], output, newInputPath, outputPath);
        } else {
          findValueInOutput(input[key], output, newInputPath, outputPath);
        }
      }
    }
  }

  function findValueInOutput(
    value: any,
    output: any,
    inputPath: string,
    outputPath: string = '',
  ) {
    if (Array.isArray(output)) {
      output.forEach((item, index) => {
        findValueInOutput(value, item, inputPath, `${outputPath}[${index}]`);
      });
    } else if (typeof output === 'object' && output !== null) {
      for (const key in output) {
        const newOutputPath = outputPath ? `${outputPath}.${key}` : key;
        if (output[key] === value) {
          console.log(`Debug: Match found: ${inputPath} -> ${newOutputPath}`);
          mapping[inputPath] = newOutputPath;
        }
        if (typeof output[key] === 'object' && output[key] !== null) {
          findValueInOutput(value, output[key], inputPath, newOutputPath);
        }
      }
    }
  }

  findMatchingValues(inputJson, parsedData);
  console.log(`Debug: Final mapping:`, mapping);
  return mapping;
}

function saveMappingDictionary(mapping: any) {
  const filePath = path.join(__dirname, '..', '..', 'mappingDictionary.json');
  fs.writeFileSync(filePath, JSON.stringify(mapping, null, 2));
  console.log(`Mapping dictionary saved to ${filePath}`);
}

export async function parseShipmentData(
  input: ShipmentInput,
  options?: ParserOptions,
): Promise<ParserResult> {
  try {
    if (Object.keys(input).length === 0) {
      throw new Error('Input JSON is empty');
    }

    let parsedData: IShipment;

    if (options?.useOpenAI) {
      parsedData = await parseJsonWithOpenAI(input);
    } else {
      const result = await parseShipmentWithMemory(input);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'No data returned from parser');
      }
      parsedData = formatShipmentData(result.data);
    }

    // Generate and save the mapping dictionary
    console.log(
      '\n\n--------------------------------------------------------------------------------',
    );
    console.log('Generating mapping dictionary...');
    console.log(
      '--------------------------------------------------------------------------------\n\n',
    );
    const mappingDictionary = generateMappingDictionary(input, parsedData);
    saveMappingDictionary(mappingDictionary);

    return {
      success: true,
      data: parsedData,
    };
  } catch (error: any) {
    console.error('Error parsing shipment:', error);
    return {
      success: false,
      error: `Error parsing shipment: ${error.message}`,
    };
  }
}