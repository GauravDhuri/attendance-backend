const config = require("../config/index.js");
const { safePromise } = require("../utils");
const User = require("./../services/user.js");
const cookie = config.cookie;

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const [findUserErr, findUserRes] = await safePromise(User.findUser(email));
    if(findUserErr) {
      return res.status(200).json({
        status: false,
        data: "Internal Error"
      });
    }

    if(!findUserRes.data.length || findUserRes.data.length > 1) {
      return res.status(401).json({
        status: false,
        data: "Authentication Error"
      })
    }

    const userData = findUserRes.data[0];

    const [verifyUserErr, _verifyUserRes] = await safePromise(User.verifyPassword(password, userData));
    if(verifyUserErr) {
      return res.status(401).json({
        status: false,
        data: "Authentication Error"
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
        data: "Authentication Error"
      });
    }

    const cookieOptions = {
      maxAge: cookie.maxAge,
      path: cookie.path
    }

    res.cookie(cookie.name, jwtRes, cookieOptions);

    return res.status(200).json({
      status: true,
      data: "Success"
    });
  } catch (error) {
    
  }
}

module.exports = {
  login
};
