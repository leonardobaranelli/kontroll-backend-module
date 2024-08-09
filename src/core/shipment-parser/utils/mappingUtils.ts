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

  // Helper function to compare objects and find matching values
  function compareObjects(
    inputObj: any,
    outputObj: any,
    inputPath: string = '',
  ) {
    for (const [inputKey, inputValue] of Object.entries(inputObj)) {
      const currentInputPath = inputPath
        ? `${inputPath}.${inputKey}`
        : inputKey;

      if (typeof inputValue === 'object' && inputValue !== null) {
        // Recursively compare nested objects
        compareObjects(inputValue, outputObj, currentInputPath);
      } else {
        // Find matching value in the output object
        const matchingOutputPath = findMatchingValue(outputObj, inputValue);
        if (matchingOutputPath) {
          mechanicalMapping.push({
            key: currentInputPath,
            value: matchingOutputPath,
          });
          console.log(
            `Mapping found: ${currentInputPath} -> ${matchingOutputPath}`,
          );
        }
      }
    }
  }

  // Helper function to find a matching value in an object
  function findMatchingValue(
    obj: any,
    value: any,
    path: string = '',
  ): string | null {
    for (const [key, val] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (val === value) {
        return currentPath;
      } else if (typeof val === 'object' && val !== null) {
        if (Array.isArray(val)) {
          for (let i = 0; i < val.length; i++) {
            const arrayPath = `${currentPath}[${i}]`;
            const result = findMatchingValue(val[i], value, arrayPath);
            if (result) return result;
          }
        } else {
          const result = findMatchingValue(val, value, currentPath);
          if (result) return result;
        }
      }
    }
    return null;
  }

  // Start comparing input and output objects
  compareObjects(input, output);
  return mechanicalMapping;
}

// Function to combine AI and mechanical mappings
export function combineMappings(
  aiMapping: Array<{ key: string; value: string }>,
  mechanicalMapping: Array<{ key: string; value: string }>,
): Array<{ key: string; value: string }> {
  const combinedMapping: Array<{ key: string; value: string }> = [...aiMapping];
  const existingValues: Set<string> = new Set(
    aiMapping.map((item) => item.value),
  );

  for (const { key, value } of mechanicalMapping) {
    if (!existingValues.has(value)) {
      combinedMapping.push({ key, value });
    }
  }

  return combinedMapping;
}

// Function to enhance the mapping dictionary by combining AI and mechanical mappings
export function enhanceMappingDictionary(
  aiMappingDictionary: Array<{ key: string; value: string }>,
  mechanicalMappingDictionary: Array<{ key: string; value: string }>,
): Array<{ key: string; value: string }> {
  const enhancedMapping: Array<{ key: string; value: string }> = [];
  const usedDestinations: Set<string> = new Set();

  // Combine AI and mechanical mappings using the new function
  const combinedMapping = combineMappings(
    aiMappingDictionary,
    mechanicalMappingDictionary,
  );

  console.log('--- Combined Mapping Dictionary ---');
  console.log(JSON.stringify(combinedMapping, null, 2));

  // Get the order of keys from the standard shipment structure
  const shipmentStructureOrder = getStructureKeys(standardShipmentStructure);

  // Create a map for quick lookup of the order of structure keys
  const structureKeyOrderMap = new Map<string, number>();
  shipmentStructureOrder.forEach((key, index) => {
    structureKeyOrderMap.set(key, index);
  });

  // Sort combinedMapping based on the order of values in standardShipmentStructure
  combinedMapping.sort((a, b) => {
    const aOrder = structureKeyOrderMap.get(a.value) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = structureKeyOrderMap.get(b.value) ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });

  // Add mappings to enhancedMapping, ensuring no duplicates and no null values
  for (const { key, value } of combinedMapping) {
    if (
      !usedDestinations.has(value) &&
      key !== null &&
      value !== null &&
      key !== '' &&
      value !== ''
    ) {
      console.log(`Adding mapping: ${key} -> ${value}`);
      enhancedMapping.push({ key, value });
      usedDestinations.add(value);
    }
  }

  console.log('--- Enhanced Mapping Dictionary ---');
  console.log(JSON.stringify(enhancedMapping, null, 2));

  return enhancedMapping;
}
