// Production-ready logging utility
// Provides structured logging with different levels

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  info(message: string, context?: LogContext) {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error | any, context?: LogContext) {
    const errorContext = {
      ...context,
      ...(error && {
        error: error.message || error,
        stack: error.stack,
      }),
    };
    console.error(this.formatMessage('error', message, errorContext));
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  // API-specific logging
  apiRequest(method: string, path: string, userId?: string) {
    this.info('API Request', { method, path, userId });
  }

  apiError(method: string, path: string, error: Error | any, userId?: string) {
    this.error('API Error', error, { method, path, userId });
  }

  apiSuccess(method: string, path: string, duration?: number) {
    this.debug('API Success', { method, path, duration });
  }

  // Database-specific logging
  dbQuery(table: string, operation: string) {
    this.debug('Database Query', { table, operation });
  }

  dbError(table: string, operation: string, error: Error | any) {
    this.error('Database Error', error, { table, operation });
  }

  // Third-party service logging
  serviceCall(service: string, operation: string) {
    this.info('Service Call', { service, operation });
  }

  serviceError(service: string, operation: string, error: Error | any) {
    this.error('Service Error', error, { service, operation });
  }
}

export const logger = new Logger();

