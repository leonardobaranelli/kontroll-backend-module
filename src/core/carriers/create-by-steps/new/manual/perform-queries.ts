import axios, { AxiosRequestConfig } from 'axios';
import {
  buildFinalUrl,
  buildParams,
  buildHeaders,
  buildBody,
  parseXmlToJson,
} from './utils';
import { handleSoapRequest } from './soapClient';

const isSoapService = (url: string): boolean => {
  return url.trim().toLowerCase().endsWith('wsdl');
};

export default async (endpoint: any): Promise<any> => {
  const { url, query: queryDetails } = endpoint;

  if (!url || !queryDetails) {
    throw new Error('Endpoint details are incomplete.');
  }

  if (isSoapService(url)) {
    return handleSoapRequest(endpoint);
  }

  const replacements: { [key: string]: string } = {};

  // Extract replacements from query params, headers, and auth
  if (queryDetails.params) {
    queryDetails.params.forEach((param: any) => {
      if (param.key && param.value) {
        replacements[param.key] = param.value;
      }
    });
  }

  if (queryDetails.header) {
    queryDetails.header.forEach((header: any) => {
      if (header.key && header.value) {
        replacements[header.key] = header.value;
      }
    });
  }

  if (queryDetails.auth) {
    const { type, value } = queryDetails.auth;

    if (type === 'basic') {
      const token = Buffer.from(value, 'utf8').toString('base64');
      replacements['Authorization'] = `Basic ${token}`;
    } else if (type === 'bearer') {
      replacements['Authorization'] = `Bearer ${value}`;
    }
  }

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
      Authorization: replacements['Authorization'], // Add the Authorization header if present
    },
    params: buildParams(
      queryDetails.params?.reduce((acc: Record<string, string>, param: any) => {
        if (param.key && param.value) {
          acc[param.key] = param.value;
        }
        return acc;
      }, {}),
      replacements,
    ),
  };

  if (queryDetails.body.value && queryDetails.body.value !== '') {
    if (queryDetails.body.language === 'json') {
      try {
        options.data = JSON.parse(queryDetails.body.value);
        //options.data = buildBody(queryDetails.body.value, replacements, 'json');
        //options.headers = {
        //  ...options.headers,
        //'Content-Type': 'application/json',
        //'Content-Type': 'application/x-www-form-urlencoded',
        //};
      } catch (error) {
        throw new Error('Invalid JSON format in the body');
      }
    } else if (queryDetails.body.language === 'xml') {
      options.data = buildBody(queryDetails.body.value, replacements, 'xml');
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/xml',
      };
    } else {
      throw new Error('Unsupported body language');
    }
  } else {
    options.data = undefined;
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/octet-stream',
    };
  }

  console.log('Options: ' + JSON.stringify(options));

  try {
    const response = await axios(options);

    // If the response is XML, parse it to JSON
    if (queryDetails.body.language === 'xml') {
      const jsonResponse = await parseXmlToJson(response.data);

      // Check if the parsed JSON indicates an error status
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

    // For non-XML responses, return as is
    return [response.data, response.status];
  } catch (error: any) {
    if (error.response) {
      if (queryDetails.body.language === 'xml') {
        const jsonResponse = await parseXmlToJson(error.response.data);
        return [jsonResponse, error.response.status, error.message];
      }
      return [error.response.data, error.response.status, error.message];
    } else {
      return ['Unknown error', 500, error.message];
    }
  }
};
