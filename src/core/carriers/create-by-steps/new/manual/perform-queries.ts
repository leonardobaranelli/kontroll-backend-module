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
    return JSON.parse(replacePlaceholders(JSON.stringify(body), replacements));
  }
  return body;
};

// Main function to make the Axios request using the endpoint object directly
export default async (endpoint: any, query: boolean): Promise<any[]> => {
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
      if (param.name && param.value) {
        replacements[param.name] = param.value;
      }
    });
  }

  if (queryDetails.header) {
    queryDetails.header.forEach((header: any) => {
      if (header.name && header.value) {
        replacements[header.name] = header.value;
      }
    });
  }

  if (queryDetails.auth && queryDetails.auth.value) {
    replacements['Authorization'] = queryDetails.auth.value;
  }

  const finalUrl = buildFinalUrl(url, replacements);

  const options: AxiosRequestConfig = {
    method: queryDetails.method,
    url: finalUrl,
    headers: buildHeaders(
      queryDetails.header?.reduce(
        (acc: Record<string, string>, header: any) => {
          if (header.name && header.value) {
            acc[header.name] = header.value;
          }
          return acc;
        },
        {},
      ),
      replacements,
    ),
    params: buildParams(
      queryDetails.params?.reduce((acc: Record<string, string>, param: any) => {
        if (param.name && param.value) {
          acc[param.name] = param.value;
        }
        return acc;
      }, {}),
      replacements,
    ),
  };

  if (queryDetails.body) {
    options.data = buildBody(queryDetails.body.value, replacements);

    if (queryDetails.body.language === 'xml') {
      options.headers = {
        ...options.headers,
        'Content-Type': 'text/xml',
      };
    } else if (queryDetails.body.language === 'json') {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
      };
    }
  }

  try {
    const response = await axios(options);
    console.log('Axios response:', response.data);
    return [{ response: response.data }];
  } catch (error) {
    console.log('Axios error:', error);
    return [{ error }];
  }
};
