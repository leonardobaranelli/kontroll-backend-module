import axios from 'axios';
import {
  ParserResult,
  ShipmentInput,
  ParserOptions,
} from '../../utils/types/utilities.interface';
import { config } from '../../config/shipment-parser/shipment-parser.config';
import { removeSpecificNullFields } from './utils/formattingUtils';
import { saveMappingDictionary } from './utils/fileUtils';
import { createLogger, countTokens } from './utils/loggingUtils';
import { validateParsedShipmentContent } from './validator/shipment-content.validator';
import { standardShipmentStructure } from './utils/standardStructure';
import { generateMechanicalMapping } from './utils/mappingUtils';
import { IShipmentContent } from '../../utils/types/models.interface';

const Logger = createLogger('ShipmentParser');

async function parseJsonWithOpenAI(inputJson: ShipmentInput) {
  const parsePrompt = createParsePrompt(inputJson);
  const parsedData = await callOpenAI(parsePrompt);

  try {
    // Validar que los campos requeridos estén presentes
    if (!parsedData.HousebillNumber) {
      throw new Error('HousebillNumber is required');
    }
    // Agregar más validaciones según sea necesario

    const validatedData: Partial<IShipmentContent> =
      validateParsedShipmentContent(parsedData) as Partial<IShipmentContent>;
    const finalData = removeSpecificNullFields(validatedData);

    return finalData;
  } catch (error: any) {
    Logger.error(`Validation error: ${error.message}`);
    throw new Error('Parsed data does not match the expected structure');
  }
}

function createParsePrompt(inputJson: ShipmentInput): string {
  return `
### Instruction ###
You are a highly capable JSON parsing assistant for the Kontroll application. Your task is to parse the provided JSON data and convert it into the standard shipment tracking structure as defined below. Ensure to deeply analyze and parse all nested structures.

### Input JSON ###
\`\`\`json
${JSON.stringify(inputJson, null, 2)}
\`\`\`

### Standard Structure for Shipment Tracking ###
{
  HousebillNumber: 'String', // The unique tracking number or house bill number for the shipment. This serves as the primary identifier for tracking the shipment.
  Origin: {
    LocationCode: 'String', // The ISO 3166 location code for the origin location. This code uniquely identifies the city or region where the shipment originated.
    LocationName: 'String', // The name of the origin location, typically the city or region name.
    CountryCode: 'String', // The ISO 3166 country code for the origin country. This code uniquely identifies the country where the shipment originated.
  },
  Destination: {
    LocationCode: 'String', // The ISO 3166 location code for the destination location. This code uniquely identifies the city or region where the shipment is being delivered.
    LocationName: 'String', // The name of the destination location, typically the city or region name.
    CountryCode: 'String', // The ISO 3166 country code for the destination country. This code uniquely identifies the country where the shipment is being delivered.
  },
  DateAndTimes: {
    ScheduledDeparture: 'String', // The scheduled or estimated departure date and time from the origin. This indicates when the shipment is expected to leave the origin.
    ScheduledArrival: 'String', // The scheduled or estimated arrival date and time at the destination. This indicates when the shipment is expected to arrive at the destination.
    ShipmentDate: 'String', // The actual date and time when the shipment was dispatched. This is the date when the shipment was handed over to the carrier.
  },
  ProductType: 'String', // The type of product being shipped. This is an optional field that describes the nature of the goods in the shipment.
  TotalPackages: 'Number', // The total number of packages included in the shipment. This is an optional field.
  TotalWeight: {
    '*body': 'Number', // The total weight of the shipment, including all packages. This is only the numerical value.
    '@uom': 'String', // The unit of measure for the weight (e.g., KG for kilograms, LB for pounds).
  },
  TotalVolume: {
    '*body': 'Number', // The total volume of the shipment, including all packages. This is only the numerical value.
    '@uom': 'String', // The unit of measure for the volume (e.g., m³ for cubic meters, ft³ for cubic feet).
  },
  Timestamp: [
    {
      TimestampCode: 'String', // The code representing the type of event (e.g., PU for Picked Up, DL for Delivered).
      TimestampDescription: 'String', // A description of the event (e.g., "Shipment picked up from the origin").
      TimestampDateTime: 'Date', // The date and time when the event occurred.
      TimestampLocation: 'String', // The location where the event took place, typically the city or region name.
    },
  ],
  brokerName: 'String', // The name of the carrier or freight forwarder responsible for transporting the shipment.
  incoterms: 'String', // The international commercial terms (Incoterms) that define the responsibilities of buyers and sellers in the shipment process.
  shipmentDate: 'String', // The actual date when the shipment was dispatched.
  booking: 'String', // The booking number associated with the shipment.
  mawb: 'String', // The Master Air Waybill number for the shipment. This is used for air freight.
  hawb: 'String', // The House Air Waybill number for the shipment. This is used for air freight.
  flight: 'String', // The flight number if the shipment is transported by air.
  airportOfDeparture: 'String', // The name of the airport where the shipment departs.
  etd: 'String', // The estimated time of departure from the origin.
  atd: 'String', // The actual time of departure from the origin.
  airportOfArrival: 'String', // The name of the airport where the shipment arrives.
  eta: 'String', // The estimated time of arrival at the destination.
  ata: 'String', // The actual time of arrival at the destination.
  vessel: 'String', // The name of the vessel if the shipment is transported by sea.
  portOfLoading: 'String', // The name of the port where the shipment is loaded onto the vessel.
  mbl: 'String', // The Master Bill of Lading number for the shipment. This is used for sea freight.
  hbl: 'String', // The House Bill of Lading number for the shipment. This is used for sea freight.
  pickupDate: 'String', // The date when the shipment was picked up from the origin.
  containerNumber: 'String', // The number of the container if the shipment is transported in a container.
  portOfUnloading: 'String', // The name of the port where the shipment is unloaded from the vessel.
  finalDestination: 'String', // The final destination of the shipment.
  internationalCarrier: 'String', // The name of the international carrier transporting the shipment.
  voyage: 'String', // The voyage number if the shipment is transported by sea.
  portOfReceipt: 'String', // The name of the port where the carrier received the shipment.
  goodsDescription: 'String', // A description of the goods being shipped.
  containers: [], // A list of containers associated with the shipment. Each container can have its own set of details and identifiers.
}


### Instructions ###
- Ensure the output is a valid JSON object with correct data types.
- Any optional fields missing in the input should be set to null.
- Analyze deeply nested structures and ensure all relevant data is mapped.
- Identify and map all relevant date and time fields, ensuring consistent formatting.
- Ensure that all weight and volume fields are correctly mapped, including their units of measure.

Your response should be a valid JSON object following the standard structure, without any additional text or comments.
`;
}

async function callOpenAI(prompt: string): Promise<any> {
  Logger.info(`Prompt: ${prompt}`);
  Logger.debug(`Token count: ${countTokens(prompt)}`);

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
        temperature: config.openai.temperature,
        top_p: config.openai.top_p,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.openai.apiKey}`,
        },
      },
    );

    const responseText = response.data.choices[0].message.content.trim();
    Logger.debug(`Raw OpenAI response: ${responseText}`);

    // Try to parse the raw response first
    try {
      const parsedResponse = JSON.parse(responseText);
      Logger.info('OpenAI response successfully parsed from raw response');
      Logger.debug(`Parsed data: ${JSON.stringify(parsedResponse)}`);
      return parsedResponse;
    } catch (rawParseError: any) {
      Logger.warn(
        `Failed to parse raw OpenAI response: ${rawParseError.message}`,
      );

      // If raw parsing fails, try cleaning the response
      const cleanedResponse = responseText.replace(/```json\n|\n```/g, '');
      Logger.debug(`Cleaned OpenAI response: ${cleanedResponse}`);

      try {
        const parsedResponse = JSON.parse(cleanedResponse);
        Logger.info(
          'OpenAI response successfully parsed from cleaned response',
        );
        Logger.debug(`Parsed data: ${JSON.stringify(parsedResponse)}`);
        return parsedResponse;
      } catch (cleanedParseError: any) {
        Logger.error(
          `Error parsing cleaned OpenAI response: ${cleanedParseError.message}`,
        );
        Logger.error(`Problematic JSON: ${cleanedResponse}`);
        throw new Error(
          `Failed to parse OpenAI response: ${cleanedParseError.message}`,
        );
      }
    }
  } catch (error: any) {
    if (error.response) {
      Logger.error(
        `OpenAI API error: ${error.response.status} - ${JSON.stringify(
          error.response.data,
        )}`,
      );
    } else if (error.request) {
      Logger.error(`No response received: ${error.request}`);
    } else {
      Logger.error(`Error setting up request: ${error.message}`);
    }
    throw new Error(`Failed to call OpenAI: ${error.message}`);
  }
}

export async function parseShipmentData(
  input: ShipmentInput,
  carrier: string,
  options?: ParserOptions,
): Promise<ParserResult> {
  try {
    if (Object.keys(input).length === 0) {
      throw new Error('Input JSON is empty');
    }

    if (!options?.useOpenAI) {
      throw new Error('OpenAI option is not enabled');
    }

    if (
      typeof standardShipmentStructure !== 'object' ||
      standardShipmentStructure === null
    ) {
      throw new Error('standardShipmentStructure is not properly defined');
    }

    const parsedData = await parseJsonWithOpenAI(input);
    const mappingDictionary = generateMechanicalMapping(input, parsedData);

    Logger.info('Mechanical Mapping Dictionary:');
    Logger.info(JSON.stringify(mappingDictionary, null, 2));

    await saveMappingDictionary(mappingDictionary, carrier);

    return {
      success: true,
      data: parsedData,
    };
  } catch (error: any) {
    Logger.error(`Error parsing shipment: ${error.message}`);
    Logger.error(`Stack trace: ${error.stack}`);
    return {
      success: false,
      error: `Error parsing shipment: ${error.message}`,
    };
  }
}
