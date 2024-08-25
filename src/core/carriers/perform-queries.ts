import axios, { AxiosRequestConfig } from 'axios';
import {
  buildFinalUrl,
  buildHeaders,
  buildBody,
} from './create-by-steps/new/manual/utils';
import { handleSoapRequest } from './create-by-steps/new/manual/soapClient';

const isSoapService = (url: string): boolean => {
  return url.trim().toLowerCase().endsWith('wsdl');
};

// Utility function to process parameters
function processParams(params: any[], key: string, value: string) {
  const result: Record<string, string> = {};
  params.forEach((param: any) => {
    if (param.key) {
      result[param.key] = param.value || ''; // Use '' if value is undefined
    }
  });
  if (key) {
    result[key] = value;
  }
  return result;
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

  if (body && body.value) {
    if (body.language === 'json') {
      try {
        options.data = JSON.parse(body.value);
      } catch (error) {
        throw new Error('Invalid JSON format in the body');
      }
    } else if (body.language === 'xml') {
      options.data = buildBody(body.value, replacements, 'xml');
      if (options.headers) options.headers['Content-Type'] = 'application/xml';
    } else {
      throw new Error('Unsupported body language');
    }
  }

  return options;
}

// Handle shipment endpoints
async function handleShipmentEndpoint(endpoint: any, shipmentId: string) {
  const { url, query: queryDetails, location } = endpoint;
  const paramKey =
    location?.startsWith('params[') && location?.endsWith(']')
      ? location.slice(7, -1) // Extract key name
      : undefined;

  const params = processParams(queryDetails.params || [], paramKey, shipmentId);

  const replacements: { [key: string]: string } = {};

  if (queryDetails.header) {
    queryDetails.header.forEach((header: any) => {
      if (header.key && header.value) {
        replacements[header.key] = header.value;
      }
    });
  }

  const options = buildAxiosOptions(
    url,
    queryDetails,
    replacements,
    queryDetails.body,
  );

  options.params = params;

  try {
    const response = await axios(options);
    return [response.data, response.status];
  } catch (error: any) {
    return error.response
      ? [error.response.data, error.response.status, error.message]
      : ['Unknown error', 500, error.message];
  }
}

// Handle authentication endpoints
async function handleAuthEndpoint(
  endpoint: any,
  token: string | undefined | null,
) {
  const { url, query: queryDetails, authLocation } = endpoint;
  const paramKey =
    authLocation?.startsWith('params[') && authLocation?.endsWith(']')
      ? authLocation.slice(7, -1) // Extract key name
      : undefined;

  const params = processParams(
    queryDetails.params || [],
    paramKey,
    token || '',
  );

  const replacements: { [key: string]: string } = {};

  if (queryDetails.header) {
    queryDetails.header.forEach((header: any) => {
      if (header.key && header.value) {
        replacements[header.key] = header.value;
      }
    });
  }

  const options = buildAxiosOptions(
    url,
    queryDetails,
    replacements,
    queryDetails.body,
  );

  options.params = params;
  options.headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : undefined,
  };

  try {
    const response = await axios(options);
    return [response.data, response.status];
  } catch (error: any) {
    return error.response
      ? [error.response.data, error.response.status, error.message]
      : ['Unknown error', 500, error.message];
  }
}

// Main function to execute endpoints
export default async function executeEndpoints(
  endpoints: any[],
  shipmentId: string,
  token: string | undefined | null,
): Promise<any[]> {
  const responses: any[] = [];

  for (const endpoint of endpoints) {
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
      const authResponse = await handleAuthEndpoint(endpoint, token);
      responses.push(authResponse);
    }

    if (isGetShipmentEndpoint) {
      const shipmentResponse = await handleShipmentEndpoint(
        endpoint,
        shipmentId,
      );
      responses.push(shipmentResponse);
    }
  }

  return responses;
}
