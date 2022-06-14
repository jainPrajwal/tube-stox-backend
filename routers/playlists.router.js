const express = require(`express`);
const {
  getPlaylistOfAUserHandler,
  savePlaylistHandler,
  updatePlaylistHandler,
  deletePlaylistHandler,
  updateVideoInAPlaylistHandler,
  deleteVideoInAPlaylistHandler,
  getSpecifiedTypeOfVideosHandler,
  saveVideoInAPlaylistHandler,
} = require("../controllers/playlists.controller");
const { VideoModel } = require("../models/video.model");
const { RESPONSE } = require("../utils/common.utils");

const router = express.Router();

router.route(`/`).get(getPlaylistOfAUserHandler()).post(savePlaylistHandler());

router
  .route(`/:playlistId`)
  .post(updatePlaylistHandler())
  .delete(deletePlaylistHandler());

router.post(`/:playlistId/videos`, saveVideoInAPlaylistHandler());

router
  .route("/:playlistId/videos/:videoId")
  .post(updateVideoInAPlaylistHandler())
  .delete(deleteVideoInAPlaylistHandler());

router.route(`/:type/videos`).get(getSpecifiedTypeOfVideosHandler());
module.exports = { router };
