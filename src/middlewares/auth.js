const { OPEN_ROUTE } = require("../config/constants");
const { safePromise } = require("../utils");
const { createLogger } = require("../utils/logger");
const User = require("./../services/user");

const log = createLogger('auth-middleware');

module.exports = async (req, res, next) => {
  const functionName = 'Auth';
  try {
    const reqPath = req.path;
    log.info(functionName, 'Request Path', reqPath);
    if(reqPath == '/healthCheck') return next();

    if(OPEN_ROUTE.includes(reqPath)) return next();

    if(!req?.cookies?.token) {
      log.error(functionName, 'No Cookie Token')
      return res.status(401).json({
        success: false,
        msg: 'Auth Error',
        data: {}
      })
    }

    const [verifyTokenErr, _verifyToken] = await safePromise(User.verifyJsonWebToken(req.cookies.token));
    if(verifyTokenErr) {
      log.error(functionName, 'JWT verification failed', verifyTokenErr)
      return res.status(401).json({
        success: false,
        msg: 'Auth Error',
        data: {}
      });
    }

    return next();
  } catch (error) {
    log.error(functionName, 'catch error', verifyTokenErr)
    return res.status(401).send({
      status: false,
      data: error.message || error
    });
  }
};
