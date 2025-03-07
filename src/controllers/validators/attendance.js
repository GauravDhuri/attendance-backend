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
        email: joi.string(),
        name: joi.string()
      });
    case ATTENDANCE.FETCH:
      return joi.object({
        name: joi.string(),
        email: joi.string(),
        date: joi.string()
      })
    case ATTENDANCE.FETCH_ALL:
      return joi.object({
        email: joi.string(),
        name: joi.string(),
        department: joi.string(),
        skipPagination: joi.boolean(),
        dateRange: joi.object({
          startDate: joi.string(),
          endDate: joi.string()
        }),
        pagination: joi.object({
          page: joi.number(),
          pageSize: joi.number()
        })
      }).xor('skipPagination', 'pagination');
    default: return joi.object({});
  }
}

module.exports = {
  getAttendaceSchema
};