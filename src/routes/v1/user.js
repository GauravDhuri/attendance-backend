const { Router } = require("express");
const User = require("./../../controllers/user.js");
const { validator } = require("../../controllers/validators/index.js");
const { VALIDATE_MODULE_NAMES } = require("../../config/constants.js");
const USER = VALIDATE_MODULE_NAMES.USER;

const router = Router();

router.post("/login", validator(USER.module, USER.route.LOGIN), User.login);

module.exports = router;
