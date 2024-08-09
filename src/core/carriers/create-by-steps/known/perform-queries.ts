import axios from 'axios';

export default async (state: any, query: boolean) => {
  const { requirements } = state;
  console.log('Requirements:', requirements);
  if (!requirements) {
    throw new Error('No requirements found in state.');
  }

  const results = [];

  if (query) {
    const userInputs = state.userInputs || [];
    const replacements: { [key: string]: string | undefined } = {};

    for (const input of userInputs) {
      for (const key in input.data) {
        replacements[key] = input.data[key];
      }
    }

    const { url, method, requirements: reqDetails } = requirements;
    let finalUrl = url;

    for (const key in replacements) {
      if (replacements.hasOwnProperty(key)) {
        finalUrl = finalUrl.replace(`{${key}}`, replacements[key] as string);
      }
    }

    const options: any = {
      method,
      url: finalUrl,
      headers: reqDetails?.header ? { ...reqDetails.header } : {},
      params: reqDetails?.paramas ? { ...reqDetails.paramas } : {},
    };

    for (const key in options.headers) {
      if (options.headers[key] === 'value' && replacements[key]) {
        options.headers[key] = replacements[key];
      }
    }

    for (const param in options.params) {
      if (options.params[param] === 'value' && replacements[param]) {
        options.params[param] = replacements[param];
      }
    }

    if (reqDetails?.body) {
      if (
        typeof reqDetails.body === 'string' &&
        reqDetails.body.trim().startsWith('<?xml')
      ) {
        options.data = reqDetails.body;
        for (const key in replacements) {
          if (replacements.hasOwnProperty(key)) {
            options.data = options.data.replace(
              new RegExp(`{${key}}`, 'g'),
              replacements[key] as string,
            );
          }
        }
        options.headers['Content-Type'] = 'text/xml';
      } else if (typeof reqDetails.body === 'object') {
        options.data = reqDetails.body;
        for (const key in replacements) {
          if (replacements.hasOwnProperty(key)) {
            options.data = JSON.parse(
              JSON.stringify(options.data).replace(
                new RegExp(`{${key}}`, 'g'),
                replacements[key] as string,
              ),
            );
          }
        }
      }
    }

    try {
      const response = await axios(options);
      console.log(`Axios response:`, response.data);
      results.push({ response: response.data });
    } catch (error) {
      console.log(`Axios error:`, error);
      results.push({ error });
    }
  }

  return results;
};
