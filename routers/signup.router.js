const express = require(`express`);
const { signupUser } = require("../controllers/auth.controller");
const router = express.Router();

router.route(`/`).post(signupUser());

module.exports = { router };
