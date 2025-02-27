type LogLevel = 'info' | 'warn' | 'error';

const logger = {
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DEBUG]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
  info: (...args: any[]) => {
    console.log('[INFO]', ...args);
  }
};

export default logger;
