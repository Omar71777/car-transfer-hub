/**
 * Production-ready logging utility that only logs in development
 * and removes all logs in production builds.
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

const isDevelopment = import.meta.env.DEV;

/**
 * Logger utility that automatically removes console logs in production builds
 */
export const logger = {
  log: (message?: any, ...optionalParams: any[]) => {
    if (isDevelopment) {
      console.log(message, ...optionalParams);
    }
  },
  
  info: (message?: any, ...optionalParams: any[]) => {
    if (isDevelopment) {
      console.info(message, ...optionalParams);
    }
  },
  
  warn: (message?: any, ...optionalParams: any[]) => {
    // We keep warnings in production for critical issues
    console.warn(message, ...optionalParams);
  },
  
  error: (message?: any, ...optionalParams: any[]) => {
    // We keep errors in production for critical issues
    console.error(message, ...optionalParams);
  },
  
  debug: (message?: any, ...optionalParams: any[]) => {
    if (isDevelopment) {
      console.debug(message, ...optionalParams);
    }
  },
  
  table: (tabularData?: any, properties?: string[]) => {
    if (isDevelopment) {
      console.table(tabularData, properties);
    }
  }
};

// Replacement for try-catch console.error patterns
export const tryCatchWithLogging = async <T>(
  fn: () => Promise<T>,
  errorMessage = "An operation failed"
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    logger.error(`${errorMessage}:`, error);
    return null;
  }
};
