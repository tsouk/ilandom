const path = require('path');
const winston = require('winston');
const config = require(path.join(global.__base, 'config'));
const BYTESIN10MB = 10485760;

const loggingLevel = process.env.NODE_ENV === 'production' ? config.logging.production : config.logging.development;

const consoleTransportConfig = {
  colorize: true,
  timestamp: true,
  level: loggingLevel,
  handleExceptions: false,
  humanReadableUnhandledException: true,
};

const fileTransportConfig = {
  filename: config.logging.filename,
  timestamp: true,
  maxsize: BYTESIN10MB,
  maxFiles: 5,
  tailable: true,
  zippedArchive: true,
  level: loggingLevel,
  handleExceptions: false,
  humanReadableUnhandledException: true,
};

const getTransportConfig = (transportjson, label) => {
  const newConfig = transportjson;
  newConfig.label = label;
  return newConfig;
};

// default logger with no label
winston.loggers.add('main', {
  transports: [
    new (winston.transports.Console)(consoleTransportConfig),
    new (winston.transports.File)(fileTransportConfig),
  ],
});

const getLogger = (label) => {
  let logger;
  if (label === undefined) {
    logger = winston.loggers.get('main');
  }
  else {
    winston.loggers.add(label, {
      transports: [
        new (winston.transports.Console)(getTransportConfig(consoleTransportConfig, label)),
        new (winston.transports.File)(getTransportConfig(fileTransportConfig, label)),
      ],
    });
    logger = winston.loggers.get(label);
  }
  return logger;
};

module.exports = {
  getLogger,
};
