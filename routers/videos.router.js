const express = require(`express`);
const router = express.Router();
const { authVerify } = require("../middlewares/auth.middleware");
const {
  getAllVideosHandler,
  saveVideoHandler,
  getVideoByVideoIdHandler,
  updateVideoDetailsHandler,
  getMostWatchedVideosHandler,
  getTrendingVideosHandler,
} = require("../controllers/videos.controller");
const {
  getNotesForAVideoHandler,
  saveNoteHandler,
  updateNoteHandler,
  deleteNoteHandler,
} = require("../controllers/notes.controller");

router
  .route(`/`)
  .get(getAllVideosHandler())
  .post(authVerify, saveVideoHandler());


  router.route(/^\/mostWatched$/).get(getMostWatchedVideosHandler());
  router.route(/^\/trending$/).get(getTrendingVideosHandler());


  router
  .route(`/:videoId`)
  .get(getVideoByVideoIdHandler())
  .post(authVerify, updateVideoDetailsHandler());
  


router
  .route(`/:videoId/notes`)
  .get(authVerify, getNotesForAVideoHandler())
  .post(authVerify, saveNoteHandler());

router
  .route(`/:videoId/notes/:noteId`)
  .post(authVerify, updateNoteHandler())
  .delete(authVerify, deleteNoteHandler());
module.exports = { router };
