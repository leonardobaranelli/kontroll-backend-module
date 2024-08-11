import { IEndpoint } from '../../../../../utils/types/models.interface';

// Function to traverse a nested JSON object searching for shipmentId
const searchInObject = (obj: any, shipmentId: string): boolean => {
  if (typeof obj !== 'object' || obj === null) return false;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        if (searchInObject(obj[key], shipmentId)) return true;
      } else if (obj[key] === shipmentId) {
        return true;
      }
    }
  }
  return false;
};

export default (shipmentId: string, endpoint: IEndpoint): boolean => {
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
      const xml2js = require('xml2js');
      let bodyObject: any;
      xml2js.parseString(endpoint.query.body.value, (err: any, result: any) => {
        if (err) throw err;
        bodyObject = result;
      });
      if (searchInObject(bodyObject, shipmentId)) {
        return true;
      }
    }
  }

  return false;
};
