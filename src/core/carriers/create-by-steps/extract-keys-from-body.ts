export const extractKeysFromBody = (body: any, keySet: Set<string>): void => {
  if (typeof body === 'object' && body !== null) {
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        if (typeof body[key] === 'object') {
          extractKeysFromBody(body[key], keySet);
        } else {
          keySet.add(key);
        }
      }
    }
  }
};
