import { IEndpoint } from '../../../../../utils/types/models.interface';
import { searchInObject, parseXmlToJson } from './utils';

type SearchResult = {
  found: boolean;
  location?: string;
  value?: string;
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
        console.log(
          'location: ' + `params[${param.key}]` + 'value ' + param.value,
        );
        return {
          found: true,
          location: `params[${param.key}]`,
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
          location: `headers[${header.key}]`,
          value: header.value,
        };
      }
    }
  }

  // Check if the shipmentId is in the body
  if (endpoint.query && endpoint.query.body && endpoint.query.body.value) {
    // If the body is JSON, traverse it
    if (endpoint.query.body.language === 'json') {
      const bodyObject = JSON.parse(endpoint.query.body.value);
      if (searchInObject(bodyObject, shipmentId)) {
        return {
          found: true,
          location: 'body',
          value: endpoint.query.body.value,
        };
      }
    }
    // If the body is XML, convert it to JSON and then traverse it
    else if (endpoint.query.body.language === 'xml') {
      try {
        const bodyObject = await parseXmlToJson(endpoint.query.body.value);
        if (searchInObject(bodyObject, shipmentId)) {
          return {
            found: true,
            location: 'body',
            value: endpoint.query.body.value,
          };
        }
      } catch (error) {
        console.error('Error parsing XML body:', error);
        return { found: false };
      }
    }
  }

  return { found: false };
};
