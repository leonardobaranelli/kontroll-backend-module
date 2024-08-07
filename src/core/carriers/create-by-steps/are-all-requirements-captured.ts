import { extractKeysFromBody } from './extract-keys-from-body';

export default (requirements: any, userInputs: any[]): boolean => {
  const requiredKeys = new Set<string>();

  if (requirements?.paramas && typeof requirements.paramas === 'object') {
    Object.keys(requirements.paramas).forEach((key) => requiredKeys.add(key));
  }

  if (requirements?.header && typeof requirements.header === 'object') {
    Object.keys(requirements.header).forEach((key) => requiredKeys.add(key));
  }

  if (
    requirements?.body &&
    typeof requirements.body === 'object' &&
    Object.keys(requirements.body).length > 0
  ) {
    extractKeysFromBody(requirements.body, requiredKeys);
  }

  const capturedKeys = new Set<string>();
  if (userInputs) {
    userInputs.forEach((input) => {
      Object.keys(input.data).forEach((key) => capturedKeys.add(key));
    });
  }

  for (const key of requiredKeys) {
    if (!capturedKeys.has(key)) {
      return false;
    }
  }

  return true;
};
