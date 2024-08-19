import * as soap from 'soap';
import { xml2js } from 'xml2js';
import { Request, Response, NextFunction } from 'express';

export const soapToJsonMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.headers['content-type'] === 'application/soap+xml') {
    const rawBody = await getRawBody(req);

    try {
      const result = await xml2js.parseStringPromise(rawBody);
      const soapBody = result['soap:Envelope']['soap:Body'][0];

      // Extraer el nombre del método y los parámetros
      const methodName = Object.keys(soapBody)[0];
      const params = soapBody[methodName][0];

      // Convertir a JSON
      req.body = {
        method: methodName,
        params: params,
      };

      // Cambiar el content-type a JSON
      req.headers['content-type'] = 'application/json';

      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid SOAP request' });
    }
  } else {
    next();
  }
};
