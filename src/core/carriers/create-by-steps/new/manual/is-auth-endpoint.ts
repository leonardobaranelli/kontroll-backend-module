import { IEndpoint } from '../../../../../utils/types/models.interface';
import { searchInObject2, parseXmlToJson } from './utils';

export default async (
  response: any, // The response from a previous endpoint
  endpoint: IEndpoint,
): Promise<boolean> => {
  // console.log('Debugging start');
  // console.log('Response:', JSON.stringify(response, null, 2));
  // console.log('Endpoint:', JSON.stringify(endpoint, null, 2));

  // Helper function to match tokens with more precision
  const matchToken = (token: string, response: any): boolean => {
    const result = searchInObject2(response, token);
    //console.log(`Matching token: ${token}, Result: ${result}`);
    return result;
  };

  // Helper function to find matches in a list of values
  const findMatch = (valueList: any[], response: any): boolean => {
    for (const value of valueList) {
      //console.log(`Checking value: ${value}`);
      if (typeof value === 'string' && matchToken(value, response)) {
        //console.log(`Match found for value: ${value}`);
        return true;
      }
    }
    //console.log('No match found in value list.');
    return false;
  };

  // Search for matches in params
  if (endpoint.query && endpoint.query.params) {
    const paramsValues = endpoint.query.params.map((param) => param.value);
    //console.log('Params values:', paramsValues);
    if (findMatch(paramsValues, response)) {
      return true;
    }
  }

  // Search for matches in headers
  if (endpoint.query && endpoint.query.header) {
    const headerValues = endpoint.query.header.map((header) => header.value);
    //console.log('Header values:', headerValues);
    if (findMatch(headerValues, response)) {
      return true;
    }
  }

  // Search for matches in the body
  if (endpoint.query && endpoint.query.body && endpoint.query.body.value) {
    try {
      let bodyObject: any;
      //console.log('Body language:', endpoint.query.body.language);
      //console.log('Body value:', endpoint.query.body.value);

      // Parse the body if it's JSON
      if (endpoint.query.body.language === 'json') {
        bodyObject = JSON.parse(endpoint.query.body.value);
      }
      // Convert the body to JSON if it's XML
      else if (endpoint.query.body.language === 'xml') {
        bodyObject = await parseXmlToJson(endpoint.query.body.value);
      }

      //console.log('Parsed body object:', bodyObject);

      // Search for matches in the parsed body
      if (bodyObject && findMatch([bodyObject], response)) {
        return true;
      }
    } catch (error) {
      console.error('Error parsing body:', error);
      return false;
    }
  }

  // Search for matches directly in the 'auth' object
  if (endpoint.query && endpoint.query.auth) {
    const authValue = endpoint.query.auth.value;
    //console.log('Auth value:', authValue);
    if (typeof authValue === 'string' && matchToken(authValue, response)) {
      return true;
    }
  }

  //console.log('No match found, returning false.');
  return false;
};
