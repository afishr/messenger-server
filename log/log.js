const Elasticsearch = require('winston-elasticsearch');
var winston = require('winston');

const esTransportOpts = {
  level: 'debug',
  clientOpts: {
    node: 'http://elasticsearch:9200',
  },
};


var logger = winston.createLogger({
transports: [

    new winston.transports.File({
        filename: `${__dirname}/logfile.log`,
        level: 'error',
    }),
    new Elasticsearch.ElasticsearchTransport(esTransportOpts),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
],
requestWhitelist: ['headers', 'query'],
responseWhitelist: ['body'],
dynamicMeta: (req, res) => {
  const httpRequest = {}
  const meta = {}
  if (req) {
      meta.httpRequest = httpRequest
      httpRequest.requestMethod = req.method
      httpRequest.requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
      httpRequest.protocol = `HTTP/${req.httpVersion}`
      httpRequest.remoteIp = req.ip.indexOf(':') >= 0 ? req.ip.substring(req.ip.lastIndexOf(':') + 1) : req.ip
      httpRequest.requestSize = req.socket.bytesRead
      httpRequest.userAgent = req.get('User-Agent')
      httpRequest.referrer = req.get('Referrer')
  }
  console.log("hello", meta)
  return meta
},

exitOnError: false
});

module.exports.logger = logger;
