import axios, { AxiosRequestConfig } from 'axios';
import {
  buildFinalUrl,
  buildHeaders,
  buildBody,
} from './create-by-steps/new/manual/utils';
import { handleSoapRequest } from './create-by-steps/new/manual/soapClient';

const isSoapService = (url: string): boolean =>
  url.trim().toLowerCase().endsWith('wsdl');

// Utility function to process parameters
function processParams(
  params: any[],
  key: string,
  value: string,
): Record<string, string> {
  const result: Record<string, string> = {};
  params.forEach((param: any) => {
    if (param.key) {
      result[param.key] = param.value || '';
    }
  });
  if (key) {
    result[key] = value;
  }
  return result;
}

// Utility function to parse and build request data
function buildRequestData(
  language: string,
  bodyValue: string,
  replacements: { [key: string]: string },
) {
  let data;
  if (language === 'json') {
    try {
      data = JSON.parse(bodyValue);
    } catch {
      throw new Error('Invalid JSON format in the body');
    }
  } else if (language === 'xml') {
    data = buildBody(bodyValue, replacements, 'xml');
  } else if (language === 'form') {
    data = new URLSearchParams(bodyValue).toString();
  } else {
    throw new Error('Unsupported body language');
  }
  return data;
}

// Utility function to build Axios options
function buildAxiosOptions(
  url: string,
  queryDetails: any,
  replacements: { [key: string]: string },
  body: any,
): AxiosRequestConfig {
  const finalUrl = buildFinalUrl(url, replacements);
  const options: AxiosRequestConfig = {
    method: queryDetails.method,
    url: finalUrl,
    headers: {
      ...buildHeaders(
        queryDetails.header?.reduce(
          (acc: Record<string, string>, header: any) => {
            if (header.key && header.value) {
              acc[header.key] = header.value;
            }
            return acc;
          },
          {},
        ),
        replacements,
      ),
    },
    params: queryDetails.params
      ? processParams(queryDetails.params, '', '')
      : {},
  };

  if (body?.value) {
    options.data = buildRequestData(body.language, body.value, replacements);
    if (body.language === 'xml' && options.headers) {
      options.headers['Content-Type'] = 'application/xml';
    } else if (body.language === 'form' && options.headers) {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  }

  return options;
}

// Handle shipment endpoints
async function handleShipmentEndpoint(
  endpoint: any,
  shipmentId: string,
  authToken: string | null,
) {
  const { url, query: queryDetails, shipmentLocation } = endpoint;
  console.log('Received SHIPMENT ID:', shipmentId); // Debug log

  let body = queryDetails.body
    ? JSON.parse(JSON.stringify(queryDetails.body))
    : {};

  if (shipmentLocation) {
    const locationParts = shipmentLocation.split(/[\[\]]/).filter(Boolean);
    let target = body;

    console.log('Shipment Location Parts:', locationParts); // Debug log

    for (let i = 0; i < locationParts.length - 1; i++) {
      target = target[locationParts[i]];
      console.log('Navigating to:', target); // Debug log
    }

    const finalKey = locationParts[locationParts.length - 1];
    if (target && target.hasOwnProperty(finalKey)) {
      console.log(`Replacing ${finalKey} with ${shipmentId}`); // Debug log
      target[finalKey] = shipmentId;
    } else {
      console.warn(`Could not find ${finalKey} in target`); // Warning log
    }
  }

  const replacements: { [key: string]: string } =
    queryDetails.header?.reduce((acc: Record<string, string>, header: any) => {
      if (header.key && header.value) {
        acc[header.key] = header.value;
      }
      return acc;
    }, {}) || {};

  const options = buildAxiosOptions(url, queryDetails, replacements, body);

  if (authToken) {
    const authLocation = endpoint.inputAuthLocation;
    if (authLocation?.startsWith('params[') && authLocation.endsWith(']')) {
      const authParamKey = authLocation.slice(7, -1);
      options.params[authParamKey] = authToken;
    } else if (
      authLocation?.startsWith('header[') &&
      authLocation.endsWith(']')
    ) {
      const authHeaderKey = authLocation.slice(7, -1);
      options.headers = {
        ...options.headers,
        [authHeaderKey]: `Bearer ${authToken}`,
      };
    } else if (
      authLocation?.startsWith('auth[') &&
      authLocation.endsWith(']')
    ) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${authToken}`,
      };
    }
  }

  console.log('Final Axios options for shipment request:', options); // Debug log

  try {
    const response = await axios(options);
    console.log('Final response:', response);
    console.log('Final response.data:', response.data);
    return [response.data, response.status];
  } catch (error: any) {
    return error.response
      ? [error.response.data, error.response.status, error.message]
      : ['Unknown error', 500, error.message];
  }
}

// Handle authentication endpoints
async function handleAuthEndpoint(endpoint: any) {
  const { url, query: queryDetails, outputAuthLocation } = endpoint;

  if (queryDetails.auth.type && queryDetails.auth.type === 'basic') {
    const basicAuth = Buffer.from(queryDetails.auth.value).toString('base64');
    queryDetails.header = queryDetails.header || [];
    queryDetails.header.push({
      key: 'Authorization',
      value: `Basic ${basicAuth}`,
    });
  } else if (queryDetails.auth.type && queryDetails.auth.type === 'bearer') {
    queryDetails.header = queryDetails.header || [];
    queryDetails.header.push({
      key: 'Authorization',
      value: `Bearer ${queryDetails.auth.value}`,
    });
  }

  const options = buildAxiosOptions(url, queryDetails, {}, queryDetails.body);

  console.log('Sending auth request with options:', options); // Debug log
  try {
    const response = await axios(options);
    //console.log('response data: ' + response.data.response.access_token);
    console.log('response data: ' + JSON.stringify(response.data));
    //console.log('Auth endpoint response status:', response.status); // Debug log

    const authToken = outputAuthLocation
      .split(/[\[\]\.]+/) // Split on [ ] or .
      .filter(Boolean) // Remove empty strings from the array
      .reduce((acc: any, part: string) => {
        return acc ? acc[part] : null;
      }, response.data);

    console.log('Retrieved token for next request:'.bgMagenta, authToken); // Debug log

    return [authToken, response.data, response.status];
  } catch (error: any) {
    return [
      null,
      error.response ? error.response.data : 'Unknown error',
      error.response ? error.response.status : 500,
    ];
  }
}

// Main function to execute endpoints
export default async function executeEndpoints(
  endpoints: any[],
  shipmentId: string,
): Promise<any[]> {
  const authEndpoints = endpoints.filter((endpoint) => endpoint.isAuthEndpoint);
  const shipmentEndpoints = endpoints.filter(
    (endpoint) => endpoint.isGetShipmentEndpoint,
  );

  const orderedEndpoints = [...authEndpoints, ...shipmentEndpoints];

  const responses: any[] = [];
  let authToken: string | null = null;

  for (const endpoint of orderedEndpoints) {
    const {
      url,
      query: queryDetails,
      isAuthEndpoint,
      isGetShipmentEndpoint,
    } = endpoint;

    if (!url || !queryDetails) {
      throw new Error('Endpoint details are incomplete.');
    }

    if (isSoapService(url)) {
      const soapResponse = await handleSoapRequest(endpoint);
      responses.push(soapResponse);
      continue;
    }

    if (isAuthEndpoint) {
      const [retrievedToken, authResponse] = await handleAuthEndpoint(endpoint);
      responses.push(authResponse);

      if (retrievedToken) {
        authToken = retrievedToken;
      }
    }

    if (isGetShipmentEndpoint) {
      const shipmentResponse = await handleShipmentEndpoint(
        endpoint,
        shipmentId,
        authToken,
      );
      responses.push(shipmentResponse);
    }
  }

  return responses;
}
