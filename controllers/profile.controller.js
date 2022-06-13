const { PlaylistModel } = require("../models/playlist.model");
const { RESPONSE } = require("../utils/common.utils");

function getProfileHandler() {
  return async (req, res) => {
    const { user } = req;
    let createdPlaylists = [];
    try {
      createdPlaylists = await PlaylistModel.find({
        owner: user._id,
      }).populate("videos");
    } catch (error) {
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `something went wrong while fetching playlist from the DB`,
        errorMessage: error.message,
      });
    }

    try {
      const publishedVideos = await VideoModel.find({ publisher: user._id });
      res.json({
        status: 200,
        success: true,
        message: `Playlists and Published Videos fetched Successfully`,
        playlists: createdPlaylists,
        videos: publishedVideos,
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isAPremiumMember: user.isAPremiumMember,
        },
      });
    } catch (error) {
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `something went wrong while fetching videos published bu you`,
        errorMessage: error.message,
      });
    }
  };
}

module.exports = { getProfileHandler };
