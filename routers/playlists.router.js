const express = require(`express`);
const { PlaylistModel } = require("../models/playlist.model");

const router = express.Router();

router.route(`/`).get(async (req, res) => {
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
      status: 500,
      success: false,
      message: `something went wrong while fetching play lists from DB`,
      errorMessage: error.message,
    });
  }
});

module.exports = { router };
