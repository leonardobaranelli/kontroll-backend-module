import { IEndpoint } from '../../../../../utils/types/models.interface';
import { parseXmlToJson } from './utils';

type SearchResult = {
  found: boolean;
  shipmentLocation?: string;
  value?: string;
};

// Helper function to find shipmentId and return its key
const findShipmentIdInObject = (
  obj: any,
  shipmentId: string,
): string | null => {
  if (typeof obj !== 'object' || obj === null) return null;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        const foundKey = findShipmentIdInObject(obj[key], shipmentId);
        if (foundKey) return `${key}.${foundKey}`;
      } else if (obj[key] === shipmentId) {
        return key;
      }
    }
  }
  return null;
};

export default async (
  shipmentId: string,
  endpoint: IEndpoint,
): Promise<SearchResult> => {
  console.log('Endpoint ' + JSON.stringify(endpoint));

  // Check if the shipmentId is in the params
  if (endpoint.query && endpoint.query.params) {
    for (const param of endpoint.query.params) {
      if (param.value === shipmentId) {
        return {
          found: true,
          shipmentLocation: `params[${param.key}]`,
          value: param.value,
        };
      }
    }
  }

  // Check if the shipmentId is in the headers
  if (endpoint.query && endpoint.query.header) {
    for (const header of endpoint.query.header) {
      if (header.value === shipmentId) {
        return {
          found: true,
          shipmentLocation: `headers[${header.key}]`,
          value: header.value,
        };
      }
    }
  }

  // Check if the shipmentId is in the body
  if (endpoint.query && endpoint.query.body && endpoint.query.body.value) {
    try {
      let bodyObject: any;

      // If the body is JSON, parse it
      if (endpoint.query.body.language === 'json') {
        bodyObject = JSON.parse(endpoint.query.body.value);

        // Find the shipmentId in the JSON object and get the key
        const key = findShipmentIdInObject(bodyObject, shipmentId);
        if (key) {
          return {
            found: true,
            shipmentLocation: `body[${key}]`,
            value: shipmentId,
          };
        }
      }
      // If the body is XML, convert it to JSON
      else if (endpoint.query.body.language === 'xml') {
        bodyObject = await parseXmlToJson(endpoint.query.body.value);

        // Find the shipmentId in the JSON object and get the key
        const key = findShipmentIdInObject(bodyObject, shipmentId);
        if (key) {
          return {
            found: true,
            shipmentLocation: `body[${key}]`,
            value: shipmentId,
          };
        }
      }
    } catch (error) {
      console.error('Error parsing body:', error);
      return { found: false };
    }
  }

  return { found: false };
};
