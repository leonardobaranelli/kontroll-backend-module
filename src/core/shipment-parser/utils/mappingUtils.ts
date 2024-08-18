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
        for (const [outputKey, outputValue] of Object.entries(outputObj)) {
          const currentOutputPath = outputPath
            ? `${outputPath}.${outputKey}`
            : outputKey;
          if (typeof outputValue === 'object' && outputValue !== null) {
            compareObjects(
              inputValue,
              outputValue,
              currentInputPath,
              currentOutputPath,
            );
          }
        }
      } else {
        const matchingOutputPath = findMatchingValue(
          outputObj,
          inputValue,
          outputPath,
        );
        if (matchingOutputPath) {
          mechanicalMapping.push({
            key: currentInputPath,
            value: matchingOutputPath,
          });
        }
      }
    }
  }

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
  parsedData: any,
): Array<{ key: string; value: string }> {
  const combinedMapping = new Map<string, Set<string>>();

  // Helper function to add mappings
  const addMapping = (key: string, value: string) => {
    if (!combinedMapping.has(key)) {
      combinedMapping.set(key, new Set());
    }
    combinedMapping.get(key)!.add(value);
  };

  // Add AI mappings
  for (const { key, value } of aiMappingDictionary) {
    addMapping(key, value);
  }

  // Add mechanical mappings
  for (const { key, value } of mechanicalMappingDictionary) {
    addMapping(key, value);
  }

  // Add all parsed fields
  for (const [key, value] of Object.entries(parsedData)) {
    if (typeof value === 'object' && value !== null) {
      for (const [nestedKey] of Object.entries(value)) {
        addMapping(`${key}.${nestedKey}`, nestedKey);
      }
    } else {
      addMapping(key, key);
    }
  }

  // Convert the map to an array of objects
  const enhancedMapping = Array.from(combinedMapping.entries()).flatMap(
    ([key, values]) => Array.from(values).map((value) => ({ key, value })),
  );

  // Sort the mapping based on the standard structure
  const shipmentStructureOrder = getStructureKeys(standardShipmentStructure);
  const structureKeyOrderMap = new Map<string, number>();
  shipmentStructureOrder.forEach((key, index) => {
    structureKeyOrderMap.set(key, index);
  });

  enhancedMapping.sort((a, b) => {
    const aOrder = structureKeyOrderMap.get(a.value) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = structureKeyOrderMap.get(b.value) ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });

  return enhancedMapping;
}
