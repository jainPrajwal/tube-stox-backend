const express = require(`express`);
const { getProfileHandler, updateProfileHandler } = require("../controllers/profile.controller");
const router = express.Router();

router
  .route(`/`)
  .get(getProfileHandler())
  .post(updateProfileHandler());

module.exports = { router };


