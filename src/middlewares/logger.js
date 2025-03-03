const { createLogger } = require("../utils/logger");

const log = createLogger('logger');

module.exports = async (req, res, next) => {
  const functionName = 'Logger';
  log.info(functionName, 'Request', req.body);
  next();
}