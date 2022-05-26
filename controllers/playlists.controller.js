const { PlaylistModel } = require("../models/playlist.model");
const { RESPONSE } = require("../utils/common.utils");

function getPlaylistOfAUserHandler() {
  return async (req, res) => {
    const { user } = req;

    if (!user) {
      throw new Error(`User not found in playlists`);
    }
    try {
      const playlists = await PlaylistModel.find({ owner: user._id }).populate(
        `videos`
      );
      res.json({
        status: 200,
        success: true,
        message: `playlists fetched successfully`,
        playlists,
      });
    } catch (error) {
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,

        message: `something went wrong while fetching play lists from DB`,
        errorMessage: error.message,
      });
    }
  };
}

function savePlaylistHandler() {
  return async (req, res) => {
    const {
      body: { playlist },
      user,
    } = req;

    console.log(`user`, user);
    if (!user) {
      throw new Error(`User not found in playlists`);
    }
    try {
      if (playlist) {
        if (playlist.type !== `custom`) {
          res.json({
            status: 400,
            success: false,
            message: `Playlist is of type default playlist`,
          });
          return;
        }
        playlist.owner = user._id;
        playlist.videos = [];
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

        message: `something went wrong while creating playlist`,
        errorMessage: error.message,
      });
    }
  };
}

function updatePlaylistHandler() {
  return async (req, res) => {
    const {
      body: { playlist },
      user,
      params: { playlistId },
    } = req;
    try {
      const foundPlaylist = await PlaylistModel.findOneAndUpdate(
        { _id: playlistId, isDefault: false },
        { ...playlist },
        { new: true }
      );
      if (!foundPlaylist) {
        res.json({
          ...RESPONSE.NOT_FOUND,
          message: `playlist ${playlistId} not found`,
        });
        return;
      }
      res.json({
        status: 201,
        success: true,
        message: `playlist updated successfully`,
        playlist: foundPlaylist,
      });
    } catch (error) {
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `something went wrong while updating the playlist`,
        errorMessage: error.message,
      });
    }
  };
}

function deletePlaylistHandler() {
  return async (req, res) => {
    const {
      user,
      params: { playlistId },
    } = req;
    try {
      const foundPlaylist = await PlaylistModel.findOneAndDelete({
        _id: playlistId,
        isDefault: false,
      });
      if (!foundPlaylist) {
        res.json({
          ...RESPONSE.NOT_FOUND,
          message: `playlist ${playlistId} not found`,
        });
        return;
      }
      res.json({
        status: 200,
        success: true,
        message: `Playlist deleted sucessfully`,
      });
    } catch (error) {
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `something went wrong while deleting the playlist`,
        errorMessage: error.message,
      });
    }
  };
}

function updateVideoInAPlaylistHandler() {
  return async (req, res) => {
    const {
      params: { playlistId, videoId },
    } = req;

    try {
      const foundPlaylist = await PlaylistModel.findOne({
        _id: playlistId,
      });
      const video = await VideoModel.findOne({ _id: videoId });
      let updatedPlaylist;

      if (!foundPlaylist) {
        res.json({
          ...RESPONSE.NOT_FOUND,
          message: `Playlist not found!`,
        });
        return;
      }
      if (!video) {
        res.json({
          ...RESPONSE.NOT_FOUND,
          message: `Video not found!`,
        });
        return;
      }

      if (foundPlaylist.type === `liked`) {
        if (foundPlaylist.videos.some((id) => id.toString() === videoId)) {
          foundPlaylist.videos = foundPlaylist.videos.filter(
            (id) => id.toString() !== videoId
          );
        } else {
          foundPlaylist.videos = [...foundPlaylist.videos, videoId];
        }
      } else {
        if (foundPlaylist.videos.some((id) => id.toString() === videoId)) {
          foundPlaylist.videos = [video._id];
        } else {
          if (foundPlaylist.type === `history`) {
            foundPlaylist.videos = [videoId, ...foundPlaylist.videos];
          } else {
            foundPlaylist.videos = [...foundPlaylist.videos, videoId];
          }
        }
      }
      updatedPlaylist = await foundPlaylist.save();

      res.json({
        status: 201,
        success: true,
        message: `Playlist Updated Succesfully`,
        playlist: await updatedPlaylist.populate("videos"),
      });
    } catch (error) {
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `something went wrong while fetching playlsit from DB`,
        errorMessage: error.message,
      });
    }
  };
}

function deleteVideoInAPlaylistHandler() {
  return async (req, res) => {
    const {
      user,
      params: { playlistId, videoId },
    } = req;
    const foundPlaylist = await PlaylistModel.findOne({
      _id: playlistId,
    });
    if (!foundPlaylist) {
      res.json({
        ...RESPONSE.NOT_FOUND,
        message: `Playlist not found!`,
      });
      return;
    }
    const video = await VideoModel.findOne({ _id: videoId });
    if (!video) {
      res.json({
        ...RESPONSE.NOT_FOUND,
        message: `Video not found!`,
      });
      return;
    }

    const updatedVideosList = foundPlaylist.videos.filter(
      (_id) => _id.toString() !== videoId
    );
    foundPlaylist.videos = updatedVideosList;
    const updatedPLaylist = await foundPlaylist.save();
    res.json({
      status: 200,
      success: true,
      message: `Video Deleted Successfully`,
      playlist: updatedPLaylist,
    });
  };
}

function getSpecifiedTypeOfVideosHandler() {
  return async (req, res) => {
    const {
      params: { type },
      user,
    } = req;

    try {
      const foundPlaylist = await PlaylistModel.find({
        owner: user._id,
        type,
      }).populate("videos");

      if (foundPlaylist.length <= 0) {
        res.json({
          ...RESPONSE.NOT_FOUND,
          message: `type not found in your playlist`,
        });
        return;
      }

      res.json({
        status: 200,
        success: true,
        message: `Playlist fetched successfully from the DB`,
        playlist: foundPlaylist,
      });
    } catch (error) {
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `something went wrong while fetching playlsit from DB`,
        errorMessage: error.message,
      });
    }
  };
}

module.exports = {
  getPlaylistOfAUserHandler,
  savePlaylistHandler,
  updatePlaylistHandler,
  deletePlaylistHandler,
  updateVideoInAPlaylistHandler,
  deleteVideoInAPlaylistHandler,
  getSpecifiedTypeOfVideosHandler,
};
