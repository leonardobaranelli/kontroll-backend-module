interface Step {
  action: (data: any, state: any) => Promise<void>;
  next: string;
}

interface CarrierConfig {
  [key: string]: {
    steps: { [key: string]: Step };
  };
}

export const carrierConfig: CarrierConfig = {
  'DHL Global Forwarding': {
    steps: {
      step1: {
        action: async (data, state) => {
          // Logic to step 1
        },
        next: 'step2',
      },
      step2: {
        action: async (data, state) => {
          // Logic to step 2
        },
        next: 'step3',
      },
      step3: {
        action: async (data, state) => {
          // Logic to step 3
        },
        next: 'complete',
      },
    },
  },
  // More setps
};
