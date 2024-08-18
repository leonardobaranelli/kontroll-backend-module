import Redis from 'ioredis';
import crypto from 'crypto';
import { createLogger } from './loggingUtils';

const Logger = createLogger('CacheUtils');

const redis = new Redis();

redis.on('error', (err) => {
  Logger.error(`Redis connection error: ${err.message}`);
});

export async function saveMappingInCache(
  inputJson: any,
  mappingDictionary: any,
) {
  try {
    const key = `mapping:${hashInputJson(inputJson)}`;
    await redis.set(key, JSON.stringify(mappingDictionary), 'EX', 86400); // Cache for 24 hours
  } catch (err: any) {
    Logger.error(`Failed to save mapping in cache: ${err.message}`);
  }
}

export async function getMappingFromCache(inputJson: any) {
  try {
    const key = `mapping:${hashInputJson(inputJson)}`;
    const cachedMapping = await redis.get(key);
    return cachedMapping ? JSON.parse(cachedMapping) : null;
  } catch (err: any) {
    Logger.error(`Failed to get mapping from cache: ${err.message}`);
    return null;
  }
}

function hashInputJson(inputJson: any) {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(inputJson))
    .digest('hex');
}
