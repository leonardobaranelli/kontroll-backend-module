import axios, { AxiosRequestConfig } from 'axios';
import {
  buildFinalUrl,
  buildHeaders,
  buildBody,
  parseXmlToJson,
} from './utils';

const createSoapEnvelope = (body: string): string => {
  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.example.com/">
      <soapenv:Header/>
      <soapenv:Body>
        ${body}
      </soapenv:Body>
    </soapenv:Envelope>
  `;
};

export const handleSoapRequest = async (endpoint: any): Promise<any> => {
  const { url, query: queryDetails } = endpoint;

  const soapBody = buildBody(queryDetails.body.value, {}, 'xml');
  const finalUrl = buildFinalUrl(url, {});

  const options: AxiosRequestConfig = {
    method: queryDetails.method,
    url: finalUrl,
    headers: {
      'Content-Type': 'text/xml',
      ...buildHeaders(queryDetails.header, {}),
    },
    data: createSoapEnvelope(soapBody),
  };

  try {
    const response = await axios(options);
    const jsonResponse = await parseXmlToJson(response.data);
    return [jsonResponse, response.status];
  } catch (error: any) {
    if (error.response) {
      const jsonResponse = await parseXmlToJson(error.response.data);
      return [jsonResponse, error.response.status, error.message];
    } else {
      return ['Unknown error', 500, error.message];
    }
  }
};
