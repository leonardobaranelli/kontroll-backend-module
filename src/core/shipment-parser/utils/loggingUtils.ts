import { encode } from 'gpt-3-encoder';

let logCounter = 0;

export function countTokens(text: string): number {
  return encode(text).length;
}

export function truncateObject(obj: any, maxLength: number = 100): string {
  const str = JSON.stringify(obj);
  if (str.length <= maxLength) {
    return str;
  }
  return (
    str.slice(0, maxLength / 2) +
    '... (truncated) ...' +
    str.slice(-maxLength / 2)
  );
}

export function logInfo(message: string): void {
  console.info(`INFO [${logCounter++}]: ${message}`);
}

export function logWarning(message: string): void {
  console.warn(`WARNING [${logCounter++}]: ${message}`);
}

export function logError(message: string): void {
  console.error(`ERROR [${logCounter++}]: ${message}`);
}

export function logObject(obj: any): void {
  const str = JSON.stringify(obj, null, 2);
  console.log(`OBJECT [${logCounter++}]: ${str}`);
}

export function logTruncatedObject(obj: any, maxLength: number = 100): void {
  const str = truncateObject(obj, maxLength);
  console.log(`OBJECT [${logCounter++}]: ${str}`);
}

export function logExecutionTime<T>(
  fn: (...args: any[]) => T,
  ...args: any[]
): T {
  const start = Date.now();
  const result = fn(...args);
  const end = Date.now();
  console.log(`Execution time [${logCounter++}]: ${end - start}ms`);
  return result;
}
