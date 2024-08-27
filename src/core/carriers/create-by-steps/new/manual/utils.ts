// Function to replace placeholders in a template string
export const replacePlaceholders = (
  template: any,
  replacements: { [key: string]: string },
): string => {
  const templateString =
    typeof template === 'string' ? template : String(template);
  return templateString.replace(
    /{(\w+)}/g,
    (_, key) => replacements[key] || '',
  );
};

// Function to build the final URL with replacements
export const buildFinalUrl = (
  url: string,
  replacements: { [key: string]: string },
): string => {
  return replacePlaceholders(url, replacements);
};

// Function to build query parameters with replacements
export const buildParams = (
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

// Function to build headers with replacements
export const buildHeaders = (
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

// Function to build the request body with replacements
export const buildBody = (
  body: any,
  replacements: { [key: string]: string },
  format: 'json' | 'xml',
): any => {
  if (format === 'json') {
    if (typeof body === 'string') {
      return replacePlaceholders(body, replacements);
    } else if (typeof body === 'object') {
      // If body is an object, convert to JSON, replace placeholders, and parse back to object
      const jsonString = JSON.stringify(body);
      return JSON.parse(replacePlaceholders(jsonString, replacements));
    }
  } else if (format === 'xml') {
    // Assume body is a string containing XML
    return replacePlaceholders(body, replacements);
  }
  return body;
};

// Function to parse XML response to JSON
export const parseXmlToJson = async (xml: string): Promise<any> => {
  const xml2js = require('xml2js');
  const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
  return parser.parseStringPromise(xml);
};

// Function to traverse a nested JSON object searching for shipmentId
export const searchInObject = (obj: any, shipmentId: string): boolean => {
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

// Function to traverse a nested JSON object searching for a specific value
// export const searchInObject2 = (
//   obj: Record<string, any>,
//   targetValue: string,
// ): boolean => {
//   if (typeof obj !== 'object' || obj === null) return false;

//   for (const key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       const value = obj[key];

//       if (typeof value === 'object' && value !== null) {
//         if (searchInObject2(value, targetValue)) return true;
//       } else if (value === targetValue) {
//         return true;
//       }
//     }
//   }

//   return false;
// };
