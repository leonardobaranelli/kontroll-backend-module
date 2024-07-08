type AnyObject = { [key: string]: any };

function setData(obj: AnyObject, parentKey: string = ''): AnyObject {
  return Object.keys(obj).reduce((acc: AnyObject, key: string) => {
    const fullKey = parentKey ? `${parentKey}_${key}` : key;
    if (
      typeof obj[key] === 'object' &&
      !Array.isArray(obj[key]) &&
      obj[key] !== null
    ) {
      const flattened = setData(obj[key], fullKey);
      return { ...acc, ...flattened };
    } else if (Array.isArray(obj[key])) {
      obj[key].forEach((item: any, index: number) => {
        if (typeof item === 'object' && !Array.isArray(item) && item !== null) {
          const flattened = setData(item, `${fullKey}[${index}]`);
          acc = { ...acc, ...flattened };
        } else {
          acc[`${fullKey}[${index}]`] = item;
        }
      });
    } else {
      acc[fullKey] = obj[key];
    }
    return acc;
  }, {});
}

function formatData(obj: AnyObject): AnyObject {
  const flattenedData = setData(obj);
  const result: AnyObject = {};

  Object.keys(flattenedData).forEach((key) => {
    if (!key.includes('events')) {
      const newKey = key
        .replace(/shipments\[\d+\]\./g, '') // Remove 'shipments[n].'
        .replace(/\./g, '_') // Replace '.' with '_'
        .replace(/\[\d+\]/g, ''); // Remove '[n]'
      result[newKey] = flattenedData[key];
    }
  });

  return result;
}

export default formatData;
