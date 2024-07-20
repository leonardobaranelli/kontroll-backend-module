export type StepKey = 'step2' | 'step3' | 'step4';

interface StepConfig {
  action: (data: any, state: any) => Promise<void>;
  message: (state: any) => string;
  next: StepKey | 'complete';
  stepsDetails?: {
    step: number;
    stepTitle: string;
    details1: string;
    details2: string;
    details3: string;
    details4: string;
  };
  form?: {
    expectedFieldName: string;
    instruction: string;
    label: string;
    title: string;
    placeholder: string;
  };
}

export const carrierConfig: Record<StepKey, StepConfig> = {
  step2: {
    action: async (data: any, state: any) => {
      state.name = data.name;
      state.url = data.url;
      await findCarrier(state.name, state.url);
    },
    message: (state: any) => `Carrier ${state.name} founded!`,
    stepsDetails: {
      step: 3,
      stepTitle: 'How to find your account number',
      details1:
        'Account Settings: Go to the account settings. The account number is usually listed there for billing and identification purposes.',
      details2:
        'Welcome Emails: When you sign up for a service, you often receive a welcome email that includes your account details, including the account number.',
      details3:
        'Contact Support: If all else fails, contact the provider’s support team or your own IT manager and they can help you find your account number.',
      details4: '',
    },
    form: {
      expectedFieldName: 'accountNumber',
      instruction:
        'Log into your provider account and navigate to the account or profile section. Your account number should be listed there.',
      label: 'Account number',
      title: 'Enter your account number',
      placeholder: 'Number',
    },
    next: 'step3',
  },
  step3: {
    action: async (data: any, state: any) => {
      state.accountNumber = data.accountNumber;
    },
    message: (state: any) =>
      `Account number ${state.accountNumber} saved successfully`,
    stepsDetails: {
      step: 4,
      stepTitle: 'How to find the Api Key',
      details1:
        "Generate Key: Log into your account on the API provider’s website. Navigate to the API section, and look for an option to generate or manage your API keys. Look for sections like 'Getting Started', 'Tutorials', or 'Developer Guide'.",
      details2:
        'Account Dashboard: Go to your account dashboard or developer portal. There should be a section dedicated to API keys where you can view or generate new keys.',
      details3:
        'Email Notifications: Some API providers send your API key via email when you first sign up or request a key. Check your inbox and spam folder for any such emails.',
      details4: '',
    },
    form: {
      expectedFieldName: 'apiKey',
      instruction:
        'Generate your API key in the developer or API section of your account dashboard. Ensure to store it securely for future use.',
      label: 'Api Key',
      title: 'Enter the Api Key',
      placeholder: 'Number',
    },
    next: 'step4',
  },
  step4: {
    action: async (data: any, state: any) => {
      state.apiKey = data.apiKey;
      await connectToCarrier(state.url, state.accountNumber, state.apiKey);
    },
    message: (state: any) =>
      `Connection with the ${state.name} carrier established correctly`,
    next: 'complete',
  },
};

export const findCarrier = async (name: string, url: string): Promise<void> => {
  console.log('Searching carrier ' + name + ' at ' + url);
};

export const connectToCarrier = async (
  url: string,
  accountNumber: string,
  apiKey: string,
): Promise<void> => {
  console.log(
    'Connecting to carrier ' +
      url +
      ' with account number ' +
      accountNumber +
      ' and API key ' +
      apiKey,
  );
};
