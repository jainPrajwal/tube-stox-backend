const express = require(`express`);
const router = express.Router();

router.route(`/`).post(signupUser());

module.exports = { router };
