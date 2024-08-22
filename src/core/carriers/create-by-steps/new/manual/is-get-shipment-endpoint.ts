import { IEndpoint } from '../../../../../utils/types/models.interface';
import { searchInObject, parseXmlToJson } from './utils';

export default async (
  shipmentId: string,
  endpoint: IEndpoint,
): Promise<boolean> => {
  // Check if the shipmentId is in the params
  if (endpoint.query && endpoint.query.params) {
    for (const param of endpoint.query.params) {
      if (param.value === shipmentId) {
        return true;
      }
    }
  }

  // Check if the shipmentId is in the headers
  if (endpoint.query && endpoint.query.header) {
    for (const header of endpoint.query.header) {
      if (header.value === shipmentId) {
        return true;
      }
    }
  }

  // Check if the shipmentId is in the body
  if (endpoint.query && endpoint.query.body && endpoint.query.body.value) {
    // If the body is JSON, traverse it
    if (endpoint.query.body.language === 'json') {
      const bodyObject = JSON.parse(endpoint.query.body.value);
      if (searchInObject(bodyObject, shipmentId)) {
        return true;
      }
    }
    // If the body is XML, convert it to JSON and then traverse it
    else if (endpoint.query.body.language === 'xml') {
      try {
        const bodyObject = await parseXmlToJson(endpoint.query.body.value);
        if (searchInObject(bodyObject, shipmentId)) {
          return true;
        }
      } catch (error) {
        console.error('Error parsing XML body:', error);
        return false;
      }
    }
  }

  return false;
};
