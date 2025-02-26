const joi = require("joi");
const { VALIDATE_MODULE_NAMES } = require("../../config/constants.js");
const USER = VALIDATE_MODULE_NAMES.USER.route;

function getUserSchema(name) {
  switch(name) {
    case USER.LOGIN:
      return joi.object({
        email: joi.string().trim().required(),
        password: joi.string().trim().required()
      })
    default: return joi.object({});
  }
}

module.exports = {
  getUserSchema
};