const { OPEN_ROUTE } = require("../config/constants");
const { safePromise } = require("../utils");
const User = require("./../services/user");

module.exports = async (req, res, next) => {
  try {
    const reqPath = req.path;
    if(reqPath == '/healthCheck') return next();

    if(OPEN_ROUTE.includes(reqPath)) return next();

    if(!req?.cookies?.token) {
      return res.status(401).json({
        success: false,
        msg: 'Auth Error',
        data: {}
      })
    }

    const [verifyTokenErr, _verifyToken] = await safePromise(User.verifyJsonWebToken(req.cookies.token));
    if(verifyTokenErr) {
      return res.status(401).json({
        success: false,
        msg: 'Auth Error',
        data: {}
      });
    }

    return next();
  } catch (error) {
    return res.status(401).send({
      status: false,
      data: error.message || error
    });
  }
};
