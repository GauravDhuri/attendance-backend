const config = require("../config/index.js");
const { safePromise } = require("../utils");
const User = require("./../services/user.js");
const cookie = config.cookie;

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const [findUserErr, findUserRes] = await safePromise(User.findUser(email));
    if(findUserErr) {
      return res.status(500).json({
        status: false,
        msg: "Internal Error",
        data: {}
      });
    }

    if(!findUserRes.data.length || findUserRes.data.length > 1) {
      return res.status(401).json({
        status: false,
        msg: "Authentication Error",
        data: {}
      })
    }

    const userData = findUserRes.data[0];

    const [verifyUserErr, _verifyUserRes] = await safePromise(User.verifyPassword(password, userData));
    if(verifyUserErr) {
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
      return res.status(401).json({
        status: false,
        msg: "Authentication Error",
        data: {}
      });
    }

    const cookieOptions = {
      maxAge: cookie.maxAge,
      path: cookie.path
    }

    res.cookie(cookie.name, jwtRes, cookieOptions);

    return res.status(200).json({
      status: true,
      msg: "Success",
      data: {
        email: email,
        userName: userData.user_name
      }
    });
  } catch (error) {
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
