const config = require("../config/index.js");
const { safePromise } = require("../utils");
const User = require("./../services/user.js");
const cookie = config.cookie;
const { createLogger } = require("../utils/logger.js");

const log = createLogger('user');

async function login(req, res) {
  const functionName = 'Login';
  try {
    log.info(functionName, 'Started', req.body);
    const { email, password } = req.body;

    const [findUserErr, findUserRes] = await safePromise(User.findUser({ email }));
    if(findUserErr) {
      log.error(functionName, 'find user error', findUserErr);
      return res.status(500).json({
        status: false,
        msg: "Internal Error",
        data: {}
      });
    }
    if(!findUserRes.data.length || findUserRes.data.length > 1) {
      log.error(functionName, 'No user found', findUserErr);
      return res.status(401).json({
        status: false,
        msg: "Authentication Error",
        data: {}
      })
    }

    const userData = findUserRes.data[0];
    const [verifyUserErr, _verifyUserRes] = await safePromise(User.verifyPassword(password, userData));
    if(verifyUserErr) {
      log.error(functionName, 'Password verification failed', findUserErr);
      return res.status(401).json({
        status: false,
        msg: "Authentication Error",
        data: {}
      });
    }

    const [jwtErr, jwtRes] = await safePromise(User.generateJsonWebToken({
      userName: userData.user_name,
      email: userData.email,
      userId: userData.id
    }));
    if(jwtErr) {
      log.error(functionName, 'jwt generation failed', findUserErr);
      return res.status(401).json({
        status: false,
        msg: "Authentication Error",
        data: {}
      });
    }

    const cookieOptions = {
      httpOnly: true,
      maxAge: cookie.maxAge,
      path: cookie.path,
      sameSite: 'None'
    }

    res.cookie(cookie.name, jwtRes, cookieOptions);
    return res.status(200).json({
      status: true,
      msg: "Success",
      data: {
        email: email,
        userName: userData.user_name,
        role: userData.role,
        department: userData.department
      }
    });
  } catch (error) {
    log.error(functionName, 'catch error', findUserErr);
    return res.status(500).json({
      status: false,
      msg: "Something went wrong",
      data: {}
    })
  }
}

module.exports = {
  login
};
