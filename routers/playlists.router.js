const express = require(`express`);
const { getPlaylistOfAUserHandler, savePlaylistHandler, updatePlaylistHandler, deletePlaylistHandler, updateVideoInAPlaylistHandler, deleteVideoInAPlaylistHandler, getSpecifiedTypeOfVideosHandler } = require("../controllers/playlists.controller");


const router = express.Router();

router
  .route(`/`)
  .get(getPlaylistOfAUserHandler())
  .post(savePlaylistHandler());

router
  .route(`/:playlistId`)
  .post(updatePlaylistHandler())
  .delete(deletePlaylistHandler());

router
  .route("/:playlistId/videos/:videoId")
  .post(updateVideoInAPlaylistHandler())
  .delete(deleteVideoInAPlaylistHandler());

router.route(`/:type/videos`).get(getSpecifiedTypeOfVideosHandler());
module.exports = { router };