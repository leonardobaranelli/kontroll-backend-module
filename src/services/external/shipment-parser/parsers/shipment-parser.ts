import axios from 'axios';
import { ShipmentData, ParserResult, ShipmentInput } from '../types';
import { config } from '../config/config';
import fs from 'fs';

const apiDocumentationLink =
  'https://developer.dhl.com/api-reference/shipment-tracking#get-started-section/';

const shipmentDataStructure: ShipmentData = {
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
    '*body': null,
    '@uom': null,
  },
  TotalVolume: {
    '*body': null,
    '@uom': null,
  },
  Timestamp: [],
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

export async function parseShipment(
  inputJson: ShipmentInput,
): Promise<ParserResult> {
  try {
    if (Object.keys(inputJson).length === 0) {
      throw new Error('Input JSON is empty');
    }

    const parsedData = await parseJsonWithOpenAI(inputJson);

    // Generate and save the mapping dictionary
    console.log(
      '\n\n--------------------------------------------------------------------------------',
    );
    console.log('Generating mapping dictionary...');
    console.log(
      '--------------------------------------------------------------------------------\n\n',
    );
    console.log('Input JSON:', inputJson);
    console.log('Parsed Data:', parsedData);

    const mappingDictionary = generateMappingDictionary(inputJson, parsedData);
    console.log('Mapping Dictionary:', mappingDictionary);

    saveMappingDictionary(mappingDictionary);

    return {
      success: true,
      data: parsedData,
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Error parsing shipment: ${error.message}`,
    };
  }
}

async function parseJsonWithOpenAI(
  inputJson: ShipmentInput,
): Promise<ShipmentData> {
  console.log('Preparing OpenAI request...');

  const prompt = `
  As a helpful assistant for the Kontroll application, your task is to parse the provided JSON data and convert it into the standard shipment tracking structure. Ensure the output is a valid JSON object with correct data types and that any optional fields missing in the input are set to null. 
  
  The output must be exclusively JSON without any additional text.
  
  Here is the input JSON:
  ${JSON.stringify(inputJson, null, 2)}
  
  The standard structure for shipment tracking is as follows:
  ${JSON.stringify(shipmentDataStructure, null, 2)}
  
  Your response should only contain the JSON object. Do not include any other text. Ensure that the output is a valid JSON format.
  
  If the fields ScheduledDeparture, ScheduledArrival, and ShipmentDate are not present in the input JSON, you should look for them in the events.
  
  API documentation for reference: ${apiDocumentationLink}
  `;

  console.log('Sending request to OpenAI...');
  console.log('Prompt:', prompt);

  try {
    console.log('API Endpoint:', config.openai.apiEndpoint);
    console.log('Model:', config.openai.model);
    console.log('API Key:', config.openai.apiKey);

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
    console.log('Full response:', response.data);

    const responseText = response.data.choices[0].message.content.trim();
    console.log('Response Text:', responseText);

    // Extract JSON part from the response text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in the response');
    }

    const parsedJson = jsonMatch[0];
    console.log('Parsed JSON:', parsedJson);

    // Validate JSON before parsing
    try {
      const parsedData = JSON.parse(parsedJson);

      // Remove specific null fields from the parsed data
      const cleanedData = removeSpecificNullFields(parsedData);
      return cleanedData;
    } catch (jsonError: any) {
      throw new Error(`Invalid JSON format: ${jsonError.message}`);
    }
  } catch (error: any) {
    console.error('Error in OpenAI API call:', error.message);
    console.error(
      'Full error response:',
      error.response ? error.response.data : error.message,
    );
    throw new Error(`Failed to parse JSON with OpenAI: ${error.message}`);
  }
}

function removeSpecificNullFields(obj: any): any {
  const optionalFields = [
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

  if (Array.isArray(obj)) {
    return obj.map(removeSpecificNullFields);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([k, v]) => v !== null || !optionalFields.includes(k))
        .map(([k, v]) => [k, removeSpecificNullFields(v)]),
    );
  } else {
    return obj;
  }
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
  const filePath = './mappingDictionary.json';
  fs.writeFileSync(filePath, JSON.stringify(mapping, null, 2));
  console.log(`Mapping dictionary saved to ${filePath}`);
}
