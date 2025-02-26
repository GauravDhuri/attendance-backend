const { compareSync } = require("bcrypt");

const safePromise = (promise) => promise.then(data => ([null, data])).catch(err => ([err]));

async function passwordCompare(plainPassword, encryptedPassword) {
  let matched = false;
  try {
    matched = compareSync(plainPassword, encryptedPassword);
  } catch (error) {
    console.log("error", error);
    return matched;
  }
}

module.exports = {
  safePromise,
  passwordCompare
}