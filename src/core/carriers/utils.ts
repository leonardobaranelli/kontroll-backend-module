import { AxiosRequestConfig } from 'axios';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

// Utility Functions
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
      data = JSON.parse(replacePlaceholders(bodyValue, replacements));
    } catch {
      throw new Error('Invalid JSON format in the body');
    }
  } else if (language === 'xml') {
    data = buildBody(bodyValue, replacements, 'xml');
  } else if (language === 'form') {
    data = new URLSearchParams(
      replacePlaceholders(bodyValue, replacements),
    ).toString();
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

function resolveTarget(
  locationType: string,
  queryDetails: any,
  body: any,
): any {
  switch (locationType) {
    case 'body':
      return typeof body.value === 'string' && body.language === 'json'
        ? JSON.parse(body.value)
        : body;
    case 'header':
      return queryDetails.header || (queryDetails.header = []);
    case 'params':
      return queryDetails.params || (queryDetails.params = {});
    default:
      console.warn(`Invalid shipmentLocation type: ${locationType}`);
      return null;
  }
}

function findFinalTarget(pathParts: string[], target: any): any {
  let finalTarget = target;
  pathParts.slice(0, -1).forEach((key) => {
    if (Array.isArray(finalTarget)) {
      finalTarget =
        finalTarget.find((item: any) => item.key === key)?.value || {};
    } else {
      finalTarget = finalTarget[key];
    }
  });
  return finalTarget;
}

async function updateTargetValue(
  finalTarget: any,
  finalKey: string,
  shipmentId: string,
  locationType: string,
  target: any,
  body: any,
): Promise<void> {
  if (Array.isArray(finalTarget)) {
    const keyObject = finalTarget.find((item: any) => item.key === finalKey);
    if (keyObject) {
      keyObject.value = shipmentId;
    } else {
      console.warn(`Could not find ${finalKey} in target`);
    }
  } else if (finalTarget && finalTarget.hasOwnProperty(finalKey)) {
    finalTarget[finalKey] = shipmentId;

    if (locationType === 'body' && body.language === 'json') {
      body.value = JSON.stringify(target);
    } else if (locationType === 'body' && body.language === 'xml') {
      body.value = jsonToXml(target, body.namespaces || {});
    }
  } else {
    console.warn(`Could not find ${finalKey} in target`);
  }
}

// Converts XML to JSON, handling cases without a root element
export async function parseXmlToJson(xml: string): Promise<any> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
  });

  // Add a temporary root element if necessary
  const wrappedXml = xml.trim().startsWith('<') ? xml : `<root>${xml}</root>`;

  try {
    const result = parser.parse(wrappedXml);
    return wrappedXml.startsWith('<root>') ? result.root : result;
  } catch (error) {
    throw new Error('Invalid XML format');
  }
}

// Converts JSON to XML
export function jsonToXml(json: any, namespaces: any = {}): string {
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    format: true,
  });

  // Add namespaces
  if (namespaces) {
    Object.keys(namespaces).forEach((nsPrefix) => {
      json[`xmlns:${nsPrefix}`] = namespaces[nsPrefix];
    });
  }

  return builder.build(json);
}

export async function processShipmentLocation(
  shipmentLocation: string,
  queryDetails: any,
  body: any,
  shipmentId: string,
): Promise<void> {
  const locationMatch = shipmentLocation.match(/^(\w+)\[(.+)]$/);
  if (!locationMatch) {
    console.warn(`Invalid shipmentLocation format: ${shipmentLocation}`);
    return;
  }

  const locationType = locationMatch[1];
  const propertyPath = locationMatch[2];
  const target = resolveTarget(locationType, queryDetails, body);

  if (!target) {
    console.warn(
      `Could not resolve target for shipmentLocation: ${shipmentLocation}`,
    );
    return;
  }

  let parsedTarget = target;
  let originalXml = target.value;

  if (locationType === 'body' && body.language === 'xml') {
    try {
      parsedTarget = await parseXmlToJson(originalXml);
    } catch (error) {
      console.error('Error parsing XML:', error);
      return;
    }
  }

  const pathParts = propertyPath.split('.');
  const finalTarget = findFinalTarget(pathParts, parsedTarget);
  const finalKey = pathParts[pathParts.length - 1];

  await updateTargetValue(
    finalTarget,
    finalKey,
    shipmentId,
    locationType,
    parsedTarget,
    body,
  );

  if (locationType === 'body' && body.language === 'xml') {
    try {
      const namespaces = body.namespaces || {};
      body.value = jsonToXml(parsedTarget, namespaces);
    } catch (error) {
      console.error('Error converting JSON to XML:', error);
      return;
    }
  }
}
