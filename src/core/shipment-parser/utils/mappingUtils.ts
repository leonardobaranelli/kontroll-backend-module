import { standardShipmentStructure } from './standardStructure';

// Function to get all keys from an object, including nested keys
export function getStructureKeys(obj: any, prefix: string = ''): string[] {
  let keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      // Recursively get keys for nested objects
      keys = keys.concat(getStructureKeys(value, newKey));
    } else {
      keys.push(newKey);
    }
  }
  return keys;
}

// Function to generate a mechanical mapping between input and output objects
export function generateMechanicalMapping(
  input: any,
  output: any,
): Array<{ key: string; value: string }> {
  const mechanicalMapping: Array<{ key: string; value: string }> = [];
  const standardKeys = getStructureKeys(standardShipmentStructure);

  function compareObjects(
    inputObj: any,
    outputObj: any,
    inputPath: string = '',
    outputPath: string = '',
  ) {
    for (const [inputKey, inputValue] of Object.entries(inputObj)) {
      const currentInputPath = inputPath
        ? `${inputPath}.${inputKey}`
        : inputKey;

      if (typeof inputValue === 'object' && inputValue !== null) {
        if (Array.isArray(inputValue)) {
          for (let i = 0; i < inputValue.length; i++) {
            compareObjects(
              inputValue[i],
              outputObj,
              `${currentInputPath}[${i}]`,
              outputPath,
            );
          }
        } else {
          compareObjects(inputValue, outputObj, currentInputPath, outputPath);
        }
      } else {
        const matchingOutputPaths = findMatchingValues(
          outputObj,
          inputValue,
          outputPath,
        );
        if (matchingOutputPaths.length > 0) {
          matchingOutputPaths.forEach((matchingOutputPath) => {
            mechanicalMapping.push({
              key: currentInputPath,
              value: matchingOutputPath,
            });
          });
        }
      }
    }
    console.log('--------------------------------');
    console.log('mechanicalMapping', mechanicalMapping);
    console.log('--------------------------------');
  }

  function findMatchingValues(
    obj: any,
    value: any,
    path: string = '',
  ): string[] {
    const matchingPaths: string[] = [];
    for (const [key, val] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (val === value) {
        matchingPaths.push(currentPath);
      } else if (typeof val === 'object' && val !== null) {
        if (Array.isArray(val)) {
          for (let i = 0; i < val.length; i++) {
            const arrayPath = `${currentPath}[${i}]`;
            matchingPaths.push(...findMatchingValues(val[i], value, arrayPath));
          }
        } else {
          matchingPaths.push(...findMatchingValues(val, value, currentPath));
        }
      }
    }
    return matchingPaths;
  }

  compareObjects(input, output);

  // Add missing fields from standard structure
  for (const key of standardKeys) {
    if (!mechanicalMapping.some((mapping) => mapping.value === key)) {
      const inputKey = findInputKeyForStandardKey(input, key);
      mechanicalMapping.push({ key: inputKey || 'null', value: key });
    }
  }

  // Sort the mapping based on the standard structure order
  const shipmentStructureOrder = getStructureKeys(standardShipmentStructure);
  mechanicalMapping.sort((a, b) => {
    const aIndex = shipmentStructureOrder.indexOf(a.value);
    const bIndex = shipmentStructureOrder.indexOf(b.value);
    return aIndex - bIndex;
  });

  return mechanicalMapping;
}

function findInputKeyForStandardKey(
  input: any,
  standardKey: string,
): string | null {
  const parts = standardKey.split('.');
  let current = input;
  let currentPath = '';

  for (const part of parts) {
    if (current && typeof current === 'object') {
      const key = Object.keys(current).find(
        (k) => k.toLowerCase() === part.toLowerCase(),
      );
      if (key) {
        currentPath = currentPath ? `${currentPath}.${key}` : key;
        current = current[key];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  return currentPath;
}
