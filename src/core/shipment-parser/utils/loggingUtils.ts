import { encode } from 'gpt-3-encoder';
import chalk from 'chalk';

let logCounter = 0;

export enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

let currentLogLevel = LogLevel.INFO;

export function setLogLevel(level: LogLevel): void {
  currentLogLevel = level;
}

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

function shouldLog(level: LogLevel): boolean {
  return level <= currentLogLevel;
}

function getTimestamp(): string {
  return new Date().toISOString();
}

export function logInfo(message: string): void {
  if (shouldLog(LogLevel.INFO)) {
    console.info(
      chalk.blue(`INFO [${logCounter++}] ${getTimestamp()}: ${message}`),
    );
  }
}

export function logWarning(message: string): void {
  if (shouldLog(LogLevel.WARN)) {
    console.warn(
      chalk.yellow(`WARNING [${logCounter++}] ${getTimestamp()}: ${message}`),
    );
  }
}

export function logError(message: string): void {
  if (shouldLog(LogLevel.ERROR)) {
    console.error(
      chalk.red(`ERROR [${logCounter++}] ${getTimestamp()}: ${message}`),
    );
  }
}

export function logDebug(message: string): void {
  if (shouldLog(LogLevel.DEBUG)) {
    console.debug(
      chalk.gray(`DEBUG [${logCounter++}] ${getTimestamp()}: ${message}`),
    );
  }
}

export function logObject(obj: any, level: LogLevel = LogLevel.INFO): void {
  if (shouldLog(level)) {
    const str = JSON.stringify(obj, null, 2);
    console.log(`OBJECT [${logCounter++}] ${getTimestamp()}:`);
    console.log(str);
  }
}

export function logTruncatedObject(
  obj: any,
  maxLength: number = 100,
  level: LogLevel = LogLevel.INFO,
): void {
  if (shouldLog(level)) {
    const str = truncateObject(obj, maxLength);
    console.log(`TRUNCATED OBJECT [${logCounter++}] ${getTimestamp()}: ${str}`);
  }
}

export function logExecutionTime<T>(
  fn: (...args: any[]) => T,
  ...args: any[]
): T {
  const start = Date.now();
  const result = fn(...args);
  const end = Date.now();
  if (shouldLog(LogLevel.DEBUG)) {
    console.log(
      chalk.cyan(
        `Execution time [${logCounter++}] ${getTimestamp()}: ${end - start}ms`,
      ),
    );
  }
  return result;
}

export function createLogger(moduleName: string) {
  return {
    info: (message: string) => logInfo(`[${moduleName}] ${message}`),
    warn: (message: string) => logWarning(`[${moduleName}] ${message}`),
    error: (message: string) => logError(`[${moduleName}] ${message}`),
    debug: (message: string) => logDebug(`[${moduleName}] ${message}`),
    setLogLevel: (level: LogLevel) => {
      currentLogLevel = level;
    },
  };
}
