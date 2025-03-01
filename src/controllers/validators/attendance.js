const joi = require("joi");
const { VALIDATE_MODULE_NAMES } = require("../../config/constants.js");
const ATTENDANCE = VALIDATE_MODULE_NAMES.ATTENDANCE.route;

function getAttendaceSchema(name) {
  switch(name) {
    case ATTENDANCE.MARK:
      return joi.object({
        date: joi.string(),
        checkInTime: joi.string(),
        checkOutTime: joi.string(),
        email: joi.string()
      })
    default: return joi.object({});
  }
}

module.exports = {
  getAttendaceSchema
};