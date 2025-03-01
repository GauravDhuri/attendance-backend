const { Router } = require("express");
const Attendance = require("./../../controllers/attendance.js");
const { validator } = require("../../controllers/validators/index.js");
const { VALIDATE_MODULE_NAMES } = require("../../config/constants.js");
const ATTENDANCE = VALIDATE_MODULE_NAMES.ATTENDANCE;

const router = Router();

router.post("/mark", validator(ATTENDANCE.module, ATTENDANCE.route.MARK), Attendance.mark);

module.exports = router;
