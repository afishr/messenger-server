const winston = require('winston');
const Elasticsearch = require('winston-elasticsearch');

const esTransportOpts = {
  level: 'info',
  clientOpts: {
    host: 'http://localhost:9200',
    log: 'info',
  },
  transformer: (logData) => ({
    '@timestamp': (new Date()).getTime(),
    severity: logData.level,
    message: `[${logData.level}] LOG Message: ${logData.message}`,
    fields: {},
  }),
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logfile.log', level: 'error' }),
    new Elasticsearch(esTransportOpts),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

exports.logger = logger;
