const config = require("../config/index.js");
const { passwordCompare } = require("../utils");
const { sign } = require("jsonwebtoken");
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

async function findUser(email) {
  const { Database } = require("../boot/database.js");
  const supaBase = Database.getInstance();

  const { data, error } = await supaBase.supabaseClient.from("users").select("*").eq("email", email);
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
  generateJsonWebToken,
  findUser
}