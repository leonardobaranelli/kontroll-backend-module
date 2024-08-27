import { IEndpoint } from '../../../../../utils/types/models.interface';
import { parseXmlToJson } from './utils';

type TokenSearchResult = {
  found: boolean;
  inputAuthLocation?: string;
  outputAuthLocation?: string;
  value?: string;
};

// Modified searchInObject function
function searchInObject(
  obj: any,
  searchValue: string,
): { found: boolean; location?: string } {
  let location: string | undefined;
  const found = Object.keys(obj).some((key) => {
    if (typeof obj[key] === 'object') {
      const result = searchInObject(obj[key], searchValue);
      if (result.found) {
        location = `${key}${result.location ? '.' + result.location : ''}`;
        return true;
      }
    } else if (obj[key] === searchValue) {
      location = key;
      return true;
    }
    return false;
  });
  return { found, location };
}

// Main function to find the token in the response
export default async (
  response: any,
  endpoint: IEndpoint,
): Promise<TokenSearchResult> => {
  const matchToken = (
    token: string,
    response: any,
  ): { found: boolean; location?: string } => {
    return searchInObject(response, token);
  };

  const findMatchInObject = (
    queryPart: Record<string, any>,
    inputLocation: string,
    response: any,
  ): TokenSearchResult | undefined => {
    const matchResult = matchToken(queryPart.value, response);
    if (matchResult.found) {
      return {
        found: true,
        inputAuthLocation: inputLocation,
        outputAuthLocation: matchResult.location
          ? `${matchResult.location}`
          : '',
        value: queryPart.value,
      };
    }
    return undefined;
  };

  const searchInQueryParts = async (): Promise<
    TokenSearchResult | undefined
  > => {
    if (endpoint.query) {
      const { params, header, auth, body } = endpoint.query;

      // Search in params
      if (params) {
        for (const param of params) {
          const result = findMatchInObject(
            param,
            `params[${param.key}]`,
            response,
          );
          if (result) return result;
        }
      }

      // Search in headers
      if (header) {
        for (const headerItem of header) {
          const result = findMatchInObject(
            headerItem,
            `header[${headerItem.key}]`,
            response,
          );
          if (result) return result;
        }
      }

      // Search in auth
      if (auth && auth.value) {
        const result = findMatchInObject(auth, `auth[${auth.type}]`, response);
        if (result) return result;
      }

      // Search in body
      if (body && body.value) {
        try {
          let bodyObject: any;
          if (body.language === 'json') {
            bodyObject = JSON.parse(body.value);
          } else if (body.language === 'xml') {
            bodyObject = await parseXmlToJson(body.value);
          }

          for (const [key, value] of Object.entries(bodyObject)) {
            const result = findMatchInObject(
              { value },
              `body[${key}]`,
              response,
            );
            if (result) return result;
          }
        } catch (error) {
          console.error('Error parsing body:', error);
          return { found: false };
        }
      }
    }
    return undefined;
  };

  const result = await searchInQueryParts();
  return result || { found: false };
};
