import axios from 'axios';
import {
  parseXmlToJson,
  buildAxiosOptions,
  processShipmentLocation,
} from './utils';
import { handleSoapRequest } from './create-by-steps/new/manual/soapClient';

// Check if a service is a SOAP service by checking the URL extension
const isSoapService = (url: string): boolean =>
  url.trim().toLowerCase().endsWith('wsdl');

// Handles shipment endpoint requests
async function handleShipmentEndpoint(
  endpoint: any,
  shipmentId: string,
  authToken: string,
): Promise<any> {
  const { url, query: queryDetails, shipmentLocation } = endpoint;
  let body = queryDetails.body ? { ...queryDetails.body } : {};

  if (shipmentLocation) {
    await processShipmentLocation(
      shipmentLocation,
      queryDetails,
      body,
      shipmentId,
    );
  }

  const headers =
    queryDetails.header?.reduce((acc: Record<string, string>, header: any) => {
      if (header.key && header.value) acc[header.key] = header.value;
      return acc;
    }, {}) || {};

  const options: any = buildAxiosOptions(url, queryDetails, headers, body);

  if (authToken) {
    const authLocation = endpoint.inputAuthLocation;
    if (authLocation?.startsWith('params[')) {
      options.params[authLocation.slice(7, -1)] = authToken;
    } else if (authLocation?.startsWith('header[')) {
      options.headers = {
        ...options.headers,
        [authLocation.slice(7, -1)]: `Bearer ${authToken}`,
      };
    } else if (authLocation?.startsWith('auth[')) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${authToken}`,
      };
    }
  }

  try {
    console.log('Axios options:', JSON.stringify(options, null, 2));
    const response = await axios(options);

    if (queryDetails.body.language === 'xml') {
      const jsonResponse = await parseXmlToJson(response.data);
      const actionStatus =
        jsonResponse?.['res:ErrorResponse']?.Response?.Status?.ActionStatus;
      const conditionCode =
        jsonResponse?.['res:ErrorResponse']?.Response?.Status?.Condition
          ?.ConditionCode;

      if (actionStatus && actionStatus !== 'Success') {
        return [jsonResponse, conditionCode, `Error: ${actionStatus}`];
      }
      return [jsonResponse, response.status];
    }

    return [response.data, response.status];
  } catch (error: any) {
    if (error.response) {
      const responseData =
        queryDetails.body.language === 'xml'
          ? await parseXmlToJson(error.response.data)
          : error.response.data;
      return [responseData, error.response.status, error.message];
    }
    return ['Unknown error', 500, error.message];
  }
}

// Handles authentication endpoint requests
async function handleAuthEndpoint(endpoint: any) {
  const { url, query: queryDetails, outputAuthLocation } = endpoint;

  // Set up authentication headers
  if (queryDetails.auth.type === 'basic') {
    const basicAuth = Buffer.from(queryDetails.auth.value).toString('base64');
    queryDetails.header = queryDetails.header || [];
    queryDetails.header.push({
      key: 'Authorization',
      value: `Basic ${basicAuth}`,
    });
  } else if (queryDetails.auth.type === 'bearer') {
    queryDetails.header = queryDetails.header || [];
    queryDetails.header.push({
      key: 'Authorization',
      value: `Bearer ${queryDetails.auth.value}`,
    });
  }

  const options = buildAxiosOptions(url, queryDetails, {}, queryDetails.body);

  try {
    const response = await axios(options);
    const authToken = outputAuthLocation
      .split(/[\[\]\.]+/)
      .filter(Boolean)
      .reduce((acc: any, part: any) => acc?.[part], response.data);
    return [authToken, response.data, response.status];
  } catch (error: any) {
    return [
      null,
      error.response?.data || 'Unknown error',
      error.response?.status || 500,
    ];
  }
}

// Executes all endpoints, handling both authentication and shipment requests
export default async function executeEndpoints(
  endpoints: any,
  shipmentId: string,
) {
  const authEndpoints = endpoints.filter(
    (endpoint: any) => endpoint.isAuthEndpoint,
  );
  const shipmentEndpoints = endpoints.filter(
    (endpoint: any) => endpoint.isGetShipmentEndpoint,
  );

  const orderedEndpoints = [...authEndpoints, ...shipmentEndpoints];
  const responses = [];
  let authToken = null;

  for (const endpoint of orderedEndpoints) {
    if (!endpoint.url || !endpoint.query) {
      throw new Error('Endpoint details are incomplete.');
    }

    if (isSoapService(endpoint.url)) {
      responses.push(await handleSoapRequest(endpoint));
      continue;
    }

    if (endpoint.isAuthEndpoint) {
      const [retrievedToken, authResponse] = await handleAuthEndpoint(endpoint);
      responses.push(authResponse);
      if (retrievedToken) authToken = retrievedToken;
    }

    if (endpoint.isGetShipmentEndpoint) {
      const shipmentResponse = await handleShipmentEndpoint(
        endpoint,
        shipmentId,
        authToken,
      );
      responses.push(shipmentResponse);
    }
  }

  return responses[responses.length - 1];
}
