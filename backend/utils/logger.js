const colors = require('colors');

// Define colors for different log levels
colors.setTheme({
  info: 'green',
  warn: 'yellow',
  error: 'red',
  debug: 'blue',
  verbose: 'cyan'
});

const logger = {
  info: (message) => {
    console.log(`[${new Date().toISOString()}]`.gray, `INFO: ${message}`.info);
  },
  
  warn: (message) => {
    console.warn(`[${new Date().toISOString()}]`.gray, `WARN: ${message}`.warn);
  },
  
  error: (message) => {
    console.error(`[${new Date().toISOString()}]`.gray, `ERROR: ${message}`.error);
  },
  
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${new Date().toISOString()}]`.gray, `DEBUG: ${message}`.debug);
    }
  },
  
  verbose: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${new Date().toISOString()}]`.gray, `VERBOSE: ${message}`.verbose);
    }
  }
};

module.exports = logger;
