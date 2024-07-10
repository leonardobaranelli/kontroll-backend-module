type Primitive = string | number | boolean | null | undefined;
type NestedObject = {
  [key: string]: Primitive | NestedObject | PrimitiveArray;
};
type PrimitiveArray = Primitive[];
type DataObject = { [key: string]: Primitive | NestedObject | PrimitiveArray };

function setData(obj: DataObject, parentKey: string = ''): DataObject {
  return Object.keys(obj).reduce((acc: DataObject, key: string) => {
    const fullKey = parentKey ? `${parentKey}_${key}` : key;
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const flattened = setData(value, fullKey);
      acc = { ...acc, ...flattened };
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayKey = `${fullKey}_${index}`;
        if (typeof item === 'object' && item !== null) {
          const flattened = setData(item, arrayKey);
          acc = { ...acc, ...flattened };
        } else {
          acc[arrayKey] = item;
        }
      });
    } else {
      acc[fullKey] = value;
    }

    return acc;
  }, {});
}

export default setData;
