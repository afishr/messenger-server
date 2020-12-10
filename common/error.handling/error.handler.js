// const logger = require('../logging/winston');

function errorHandler(error, req, res, next) {
  if (error) {
    // const errorMessage = `${error.code} ${error.message}`;
    // error.code >= 500 ? logger.error(errorMessage, error) : logger.warn(errorMessage, error); TODO add winston here
    return res.json({
      error: error.message,
    });
  }
  next();
}

module.exports = { errorHandler };
