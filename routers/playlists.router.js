const express = require(`express`);
const { PlaylistModel } = require("../models/playlist.model");
const { RESPONSE } = require("../utils/common.utils");

const router = express.Router();


router
  .route(`/`)
  .get(async (req, res) => {
    try {
      const playlists = await PlaylistModel.find({}).populate(`videos`);
      res.json({
        status: 200,
        success: true,
        message: `play lists fetched successfully`,
        playlists,
      });
    } catch (error) {
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,

        message: `something went wrong while fetching play lists from DB`,
        errorMessage: error.message,
      });
    }
  })
  .post(async (req, res) => {
    const { playlist } = req.body;
    try {
      if (playlist) {
        let savedPlaylist = await new PlaylistModel(playlist).save();
        if (savedPlaylist) {
          res.json({
            status: 201,
            success: true,
            message: `playlist saved succesfully to the DB`,
            playlist: savedPlaylist,
          });
        } else {
          res.json(RESPONSE.MALFORMED_SYNTAX);
        }
      } else {
        res.json(RESPONSE.MALFORMED_SYNTAX);
      }
    } catch (error) {
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,

        message: `somehting went wrong while creating playlist`,
        errorMessage: error.message,
      });
    }
  });

module.exports = { router };
