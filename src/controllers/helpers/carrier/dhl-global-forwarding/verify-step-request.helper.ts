import { Request, Response, NextFunction } from 'express';
import { StepKey } from '../../../../services/helpers/carrier/dhl-global-forwarding/dhl-g-f-config.helper';

export const verifyStepRequest = (
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
      requestExampleToStep2: {
        step: 'step2',
        data: {
          name: 'Example Carrier Name',
          url: 'https://example-carrier-url.com',
        },
      },
      requestExampleToStep3: {
        step: 'step3',
        data: {
          accountNumber: '123',
        },
      },
      requestExampleToStep4: {
        step: 'step4',
        data: {
          apiKey: 'asd123',
        },
      },
    };

    res.status(400).json(errorMessage);
    return;
  }

  try {
    switch (step) {
      case 'step2':
        validateStep2(data);
        break;
      case 'step3':
        validateStep3(data);
        break;
      case 'step4':
        validateStep4(data);
        break;
      default:
        res.status(400).json({ error: 'Invalid step' });
        return;
    }

    next();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

function validateStep2(data: any): void {
  if (!data.name || !data.url) {
    throw new Error('Name and URL are required for this step');
  }
  if (typeof data.name !== 'string') {
    throw new Error('Name must be a string');
  }
  if (typeof data.url !== 'string') {
    throw new Error('Please insert a valid URL');
  }
}

function validateStep3(data: any): void {
  if (!data.accountNumber) {
    throw new Error('Account number is required for this step');
  }
  if (typeof data.accountNumber !== 'string') {
    throw new Error('Account number must be a string');
  }
}

function validateStep4(data: any): void {
  if (!data.apiKey) {
    throw new Error('API key is required for this step');
  }
  if (typeof data.apiKey !== 'string') {
    throw new Error('API key must be a string');
  }
}
