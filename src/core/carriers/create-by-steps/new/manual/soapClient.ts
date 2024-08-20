const soap = require('soap');
const xml2js = require('xml2js');

const parseXmlToJson = (xml: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(
      xml,
      { explicitArray: false },
      (err: any, result: any) => {
        if (err) {
          console.error('Error parsing XML to JSON:', err);
          return reject(err);
        }

        if (result.Envelope) {
          resolve(result.Envelope);
        } else {
          resolve(result);
        }
      },
    );
  });
};

const createSoapClient = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    soap.createClient(url, { timeout: 180000 }, (err: any, client: any) => {
      if (err) {
        return reject(err);
      }
      resolve(client);
    });
  });
};

export const handleSoapRequest = async (endpoint: any): Promise<any[]> => {
  const { url, query: queryDetails } = endpoint;
  const method = queryDetails.method;
  const xml = queryDetails.body.value;

  try {
    const xmlObject = await parseXmlToJson(xml);
    console.log('Creating SOAP client...'.bgGreen);
    const client = await createSoapClient(url);

    const result = await new Promise<any>((resolve, reject) => {
      Reflect.apply(client[method], client, [
        xmlObject,
        (err: any, _result: any) => {
          if (err) {
            console.error('Error invoking method:', err);
            return reject(err);
          }
          console.log('data:', _result);
          resolve(_result);
        },
      ]);
    });

    return [result, 200];
  } catch (error: any) {
    console.error('Error in handleSoapRequest:', error);
    if (error.root) {
      const errorResponse = await parseXmlToJson(error.root.Envelope.Body);
      return [errorResponse, error.statusCode || 500, error.message];
    } else {
      return [{}, 500, error.message || 'An error occurred'];
    }
  }
};

module.exports = { handleSoapRequest };
