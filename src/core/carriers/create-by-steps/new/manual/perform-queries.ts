import axios, { AxiosRequestConfig } from 'axios';

// Function to replace placeholders in a template string
const replacePlaceholders = (
  template: string,
  replacements: { [key: string]: string },
): string => {
  return template.replace(/{(\w+)}/g, (_, key) => replacements[key] || '');
};

// Function to build the final URL with replacements
const buildFinalUrl = (
  url: string,
  replacements: { [key: string]: string },
): string => {
  return replacePlaceholders(url, replacements);
};

// Function to build headers with replacements
const buildHeaders = (
  headers: Record<string, string> | undefined,
  replacements: { [key: string]: string },
): Record<string, string> => {
  const result: Record<string, string> = {};
  if (headers) {
    for (const key in headers) {
      result[key] = replacePlaceholders(headers[key], replacements);
    }
  }
  return result;
};

// Function to build query parameters with replacements
const buildParams = (
  params: Record<string, string> | undefined,
  replacements: { [key: string]: string },
): Record<string, string> => {
  const result: Record<string, string> = {};
  if (params) {
    for (const key in params) {
      result[key] = replacePlaceholders(params[key], replacements);
    }
  }
  return result;
};

// Function to build the request body with replacements
const buildBody = (body: any, replacements: { [key: string]: string }): any => {
  if (typeof body === 'string') {
    return replacePlaceholders(body, replacements);
  } else if (typeof body === 'object') {
    // If body is an object, convert to JSON, replace placeholders, and parse back to object
    const jsonString = JSON.stringify(body);
    return JSON.parse(replacePlaceholders(jsonString, replacements));
  }
  return body;
};

// Main function to make the Axios request using the endpoint object directly
export default async (endpoint: any, query: boolean): Promise<any> => {
  if (!query) {
    return [];
  }

  const { url, query: queryDetails } = endpoint;

  if (!url || !queryDetails) {
    throw new Error('Endpoint details are incomplete.');
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

  // Handling authentication
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
        //options.headers = {
        //  ...options.headers,
        //'Content-Type': 'application/json',
        //'Content-Type': 'application/x-www-form-urlencoded',
        //};
      } catch (error) {
        throw new Error('Invalid JSON format in the body');
      }
    } else if (queryDetails.body.language === 'xml') {
      options.data = buildBody(queryDetails.body.value, replacements);
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
    return [response.data, response.status];
  } catch (error: any) {
    if (error.response) {
      return [error.response.data, error.response.status, error.message];
    } else {
      return ['Unknown error', 500, error.message];
    }
  }
};
