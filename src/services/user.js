const config = require("../config/index.js");
const { passwordCompare } = require("../utils");
const { sign, verify } = require("jsonwebtoken");
const TOKEN_SECRET = config.jwt.JWT_TOKEN_SECRET;
const JWT_EXPIRY_TIME = config.jwt.JWT_EXPIRY_TIME;

async function verifyPassword(password, userData) {
  if(!passwordCompare(password, userData.password)) {
    return Promise.reject({
      success: false,
      data: "Inccorect Password"
    });
  }

  return Promise.resolve({
    success: true,
    data: "Login successful"
  })
}

async function verifyJsonWebToken(token) {
  try {
    return new Promise((resolve, reject) => {
      verify(token, config.jwt.JWT_TOKEN_SECRET, async(err, decoded) => {
        if(err) {
          if(err.name == 'TokenExpiredError') {
            return reject({
              success: false,
              msg: 'Token Expired'
            })
          } else if(err?.name == 'JsonWebTokenError') {
            return reject({
              success: false,
              msg: 'Incorrect Token'
            })
          } else if(err) {
            return reject({
              success: false,
              msg: 'Auth Error'
            })
          }
        } 

        delete decoded.iat;
        delete decoded.exp;

        if(!decoded && !decoded.token) {
          return reject({
            success: false,
            msg: 'Auth Error'
          })
        }
        if(!decoded && !decoded.userId) {
          return reject({
            success: false,
            msg: 'Auth Error'
          })
        }

        return resolve(decoded);
      })
    })
  } catch (error) {
    return Promise.reject({
      success: false,
      msg: 'Auth Error',
      data: {}
    })
  }
}

async function generateJsonWebToken(data) {
  const token = sign(data, TOKEN_SECRET, { expiresIn: JWT_EXPIRY_TIME });
  if(!token) {
    return Promise.reject({
      success: false,
      data: "Token not generated"
    });
  }
  return Promise.resolve(token);
}

async function findUser(params) {
  const { Database } = require("../boot/database.js");
  const supaBase = Database.getInstance();

  const query = supaBase.supabaseClient.from("users").select("*");
  if(params.name) {
    query.eq('user_name', params.name);
  }

  if(params.email) {
    query.eq('email', params.email);
  }

  if(params.department) {
    query.eq('department', params.department)
  }

  const { data, error } = await query;
  if(error) {
    return Promise.reject({
      success: false,
      data: error
    });
  }
  
  return Promise.resolve({
    success: true,
    data: data
  })
}

module.exports = {
  verifyPassword,
  verifyJsonWebToken,
  generateJsonWebToken,
  findUser
}