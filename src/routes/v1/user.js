const { Router } = require("express");
const User = require("./../../controllers/user.js");

const router = Router();

router.post('/login', User.login);

module.exports = router;
