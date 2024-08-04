import { Request, Response, NextFunction } from 'express';
import { StepKey } from '../../../../utils/types/models.interface';
import { integrated } from '../../../../storage/carriers/known/integrated.storage';

export const verifyKnownStepRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { step, data } = req.body as {
    step: StepKey;
    data: any;
  };

  if (!data || !step) {
    const errorMessage = {
      error:
        'Invalid structure. Please ensure the request body follows this format:',
      requestStep1toExample1: {
        step: 'step1',
        data: {
          name: 'dhl global forwarding',
        },
      },
      requestStep2toExample1: {
        step: 'step2',
        data: {
          'api-key': 'the api key',
        },
      },
      requestStep3toExample1: {
        step: 'step3',
        data: {
          shipmentID: 'a shipmentID',
        },
      },
      requestStep1toExample2: {
        step: 'step1',
        data: {
          name: 'dhl express',
        },
      },
      requestStep2toExample2: {
        step: 'step2',
        data: {
          siteID: 'the site ID',
        },
      },
      requestStep3toExample2: {
        step: 'step3',
        data: {
          password: 'the passowrd',
        },
      },
      requestStep4toExample2: {
        step: 'step4',
        data: {
          shipmentID: 'a shipmentID',
        },
      },
    };

    res.status(400).json(errorMessage);
    return;
  }

  try {
    const carrierNameLowerCase = data.name.toLowerCase();
    const carrier = integrated.find(
      (carrier) => carrier.name.toLowerCase() === carrierNameLowerCase,
    );
    if (!carrier) {
      throw new Error(`Carrier ${data.name} is not registered`);
    }
    // validateAttributes(carrier, step, data);

    // if (step === 'step1') {
    //   validateName(data);
    // }

    next();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// function validateName(data: any): void {
//   if (!data.name) {
//     throw new Error('Name is required for this step');
//   }
//   if (typeof data.name !== 'string') {
//     throw new Error('Name must be a string');
//   }
//   if (!integrated.some((carrier) => carrier.name === data.name)) {
//     throw new Error(
//       `The carrier ${data.name} is not registered yet, please ensure the name is written correctly`,
//     );
//   }
//   if (typeof data.apiKey !== 'string') {
//     throw new Error('The API key must be a string');
//   }
// }

// function validateAttributes(carrier: any, step: StepKey, data: any): void {
//   if (typeof data !== 'object' || data === null) {
//     throw new Error('Data must be an object');
//   }

//   // Get the required attributes for the step from the carrier configuration
//   const requiredAttributes = carrier.steps[step];
//   if (!requiredAttributes) {
//     throw new Error(`No configuration found for step: ${step}`);
//   }

//   // Validate each attribute
//   for (const attribute of requiredAttributes) {
//     if (!data[attribute]) {
//       throw new Error(`Attribute ${attribute} is required for step ${step}`);
//     }
//     if (typeof data[attribute] !== 'string') {
//       throw new Error(
//         `The value of the attribute ${attribute} must be a string`,
//       );
//     }
//   }
//};
