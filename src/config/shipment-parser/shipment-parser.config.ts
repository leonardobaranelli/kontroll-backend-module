import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');
console.log('Loading .env file from:', envPath);
dotenv.config({ path: envPath });

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
console.log('OPENAI_MODEL:', process.env.OPENAI_MODEL);
console.log('Process env OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
console.log('Process env OPENAI_MODEL:', process.env.OPENAI_MODEL);

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL,
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  },
};

console.log('Exported config:', JSON.stringify(config, null, 2));
