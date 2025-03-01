const { getUserSchema } = require("../validators/user.js");
const { getAttendaceSchema } = require("../validators/attendance.js");
const { VALIDATE_MODULE_NAMES } = require("../../config/constants.js");

function validator(module, route) {
  return async (req, res, next) => {
    try {
      const schema = getSchema(module, route, req.body);
      const validationErrors = validate(req.body, schema);

      if (!validationErrors) {
        return next();
      }

      const cleanedErrors = validationErrors.map(err => err.replace(/"/g, ""));

      return res.status(400).json({
        status: false,
        message: "INSUFFICIENT_PARAMS",
        data: cleanedErrors,
      });
    } catch (err) {
      console.error("Validation middleware error:", err);
      return res.status(500).json({
        status: false,
        message: "INTERNAL_SERVER_ERROR",
        data: err.message,
      });
    }
  };
}

function validate(data, schema) {
  try {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      return error.details.map(detail => detail.message);
    }
  } catch (error) {
    console.error("Validation function error:", error);
    return ["Failed to validate"];
  }
}

function getSchema(moduleName, routeName) {
  const schemas = {
    [VALIDATE_MODULE_NAMES.USER.module]: getUserSchema(routeName),
    [VALIDATE_MODULE_NAMES.ATTENDANCE.module]: getAttendaceSchema(routeName)
  };

  return schemas[moduleName] || null;
}

module.exports = { validator };