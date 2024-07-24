import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from /src/.env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL,
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  },
};
