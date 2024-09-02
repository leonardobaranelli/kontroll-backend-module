import { AxiosRequestConfig } from 'axios';

export const replacePlaceholders = (
  template: string | number,
  replacements: Record<string, string>,
): string => {
  const templateString =
    typeof template === 'string' ? template : String(template);
  return templateString.replace(
    /{(\w+)}/g,
    (_, key) => replacements[key] || '',
  );
};

export const buildFinalUrl = (
  url: string,
  replacements: Record<string, string>,
): string => {
  return replacePlaceholders(url, replacements);
};

export const buildParams = (
  params: Record<string, any>,
  replacements: Record<string, string>,
): Record<string, string> => {
  const result: Record<string, string> = {};
  if (params) {
    for (const key in params) {
      result[key] = replacePlaceholders(params[key], replacements);
    }
  }
  return result;
};

export const buildHeaders = (
  headers: Record<string, any>,
  replacements: Record<string, string>,
): Record<string, string> => {
  const result: Record<string, string> = {};
  if (headers) {
    for (const key in headers) {
      result[key] = replacePlaceholders(headers[key], replacements);
    }
  }
  return result;
};

export const buildBody = (
  body: any,
  replacements: Record<string, string>,
  format: string,
): any => {
  if (format === 'json') {
    if (typeof body === 'string') {
      return replacePlaceholders(body, replacements);
    } else if (typeof body === 'object') {
      const jsonString = JSON.stringify(body);
      return JSON.parse(replacePlaceholders(jsonString, replacements));
    }
  } else if (format === 'xml') {
    return replacePlaceholders(body, replacements);
  }
  return body;
};

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

function processParams(
  params: any[],
  key: string,
  value: string,
): Record<string, string> {
  const result: Record<string, string> = {};
  params.forEach((param) => {
    if (param.key) {
      result[param.key] = param.value || '';
    }
  });
  if (key) {
    result[key] = value;
  }
  return result;
}

function buildRequestData(
  language: string,
  bodyValue: string,
  replacements: Record<string, string>,
): any {
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

export function buildAxiosOptions(
  url: string,
  queryDetails: any,
  headers: Record<string, string>,
  body: any,
): AxiosRequestConfig {
  const finalUrl = buildFinalUrl(url, headers);
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
        headers,
      ),
    },
    params: queryDetails.params
      ? processParams(queryDetails.params, '', '')
      : {},
  };

  if (body?.value) {
    options.data = buildRequestData(body.language, body.value, headers);
    if (body.language === 'xml' || body.language === 'form') {
      if (options.headers)
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  }

  return options;
}

export const parseXmlToJson = async (xml: string): Promise<any> => {
  const xml2js = require('xml2js');
  const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
  return parser.parseStringPromise(xml);
};
