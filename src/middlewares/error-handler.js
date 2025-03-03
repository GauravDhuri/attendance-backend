const { createLogger } = require("../utils/logger");

const log = createLogger('error-handler-middleware');

module.exports = async (err, req, res, _next) => {
  const functionName = 'error-handler';
  log.error(functionName, 'error', err);
  res.status(500).send({
    status: false,
    message: "INVALID_REQUEST",
    data: "Something went wrong"
  });
}