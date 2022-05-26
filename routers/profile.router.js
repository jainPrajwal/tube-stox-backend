const express = require(`express`);
const { getProfileHandler } = require("../controllers/profile.controller");
const { PlaylistModel } = require("../models/playlist.model");
const { VideoModel } = require("../models/video.model");
const { RESPONSE } = require("../utils/common.utils");
const router = express.Router();

router.route(`/`).get(getProfileHandler());

module.exports = { router };


