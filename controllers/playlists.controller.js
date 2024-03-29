const { PlaylistModel } = require("../models/playlist.model");
const { VideoModel } = require("../models/video.model");
const { RESPONSE } = require("../utils/common.utils");

function getPlaylistOfAUserHandler() {
  return async (req, res) => {
    const { user } = req;

    if (!user) {
      res.status(404).json({
        success: false,
        message: `User not found in playlists`,
      });
    }
    try {
      const playlists = await PlaylistModel.find({ owner: user._id }).populate(
        `videos`
      );
      const formattedPlaylists = playlists.reduce((acc, current) => {
        return {
          ...acc,
          [current.type]:
            current.type === `custom`
              ? acc[current.type]
                ? [...acc[current.type], current]
                : [current]
              : current,
        };
      }, {});

      res.status(200).json({
        status: 200,
        success: true,
        message: `playlists fetched successfully`,
        playlists,
      });
    } catch (error) {
      res.status(500).json({
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

    if (!user) {
      res.status(404).json({
        success: false,
        message: `User not found in playlists`,
      });
    }
    try {
      if (playlist) {
        if (playlist.type !== `custom`) {
          res.status(400).json({
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
          res.status(201).json({
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
      res.status(500).json({
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
        res.status(404).json({
          ...RESPONSE.NOT_FOUND,
          message: `playlist ${playlistId} not found`,
        });
        return;
      }
      res.status(201).json({
        status: 201,
        success: true,
        message: `playlist updated successfully`,
        playlist: foundPlaylist,
      });
    } catch (error) {
      res.status(500).json({
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
        res.status(404).json({
          ...RESPONSE.NOT_FOUND,
          message: `playlist not found`,
        });
        return;
      }
      res.status(200).json({
        status: 200,
        success: true,
        message: `Playlist deleted sucessfully`,
        playlist: foundPlaylist,
      });
    } catch (error) {
      res.status(500).json({
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
        res.status(404).json({
          ...RESPONSE.NOT_FOUND,
          message: `Playlist not found!`,
        });
        return;
      }
      if (!video) {
        res.status(404).json({
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

      res.status(201).json({
        status: 201,
        success: true,
        message: `Playlist Updated Succesfully`,
        video,
      });
    } catch (error) {
      res.status(500).json({
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
      res.status(404).json({
        ...RESPONSE.NOT_FOUND,
        message: `Playlist not found!`,
      });
      return;
    }
    const video = await VideoModel.findOne({ _id: videoId });
    if (!video) {
      res.status(404).json({
        ...RESPONSE.NOT_FOUND,
        message: `Video not found!`,
      });
      return;
    }

    const updatedVideosList = foundPlaylist.videos.filter(
      (_id) => _id.toString() !== videoId
    );
    foundPlaylist.videos = updatedVideosList;
    await foundPlaylist.save();
    res.status(200).json({
      status: 200,
      success: true,
      message: `Video Deleted Successfully`,
      video,
    });
  };
}

function saveVideoInAPlaylistHandler() {
  return async (req, res) => {
    const {
      body: { video },
      params: { playlistId },
    } = req;

    if (!video) {
      res
        .status(RESPONSE.MALFORMED_SYNTAX.status)
        .json(RESPONSE.MALFORMED_SYNTAX);
      return;
    }
    try {
      const foundPlaylist = await PlaylistModel.findOne({ _id: playlistId });
      if (!foundPlaylist) {
        res.status(RESPONSE.NOT_FOUND.status).json({
          ...RESPONSE.NOT_FOUND,
          message: `Playlist not found!`,
        });
        return;
      }
      if (foundPlaylist.type === `history`) {
        if (foundPlaylist.videos.some((id) => id.toString() === video._id)) {
          foundPlaylist.videos = foundPlaylist.videos.filter(
            (id) => id.toString() !== video._id
          );
        }
      }
      const updatedVideos = foundPlaylist.videos.concat(video);
      foundPlaylist.videos = updatedVideos;

      await foundPlaylist.save();

      res.status(201).json({
        status: 201,
        success: true,
        message: `Video Saved to Playlist Successfully`,
        video,
      });
    } catch (error) {
      console.error(error);
      res.status(RESPONSE.INTERNAL_SERVER_ERROR.status).json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `somehting went wrong while finding your playlist`,
        errorMessage: error.message,
      });
    }
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
        res.status(404).json({
          ...RESPONSE.NOT_FOUND,
          message: `type not found in your playlist`,
        });
        return;
      }

      res.status(200).json({
        status: 200,
        success: true,
        message: `Playlist fetched successfully from the DB`,
        playlist: foundPlaylist,
      });
    } catch (error) {
      res.status(500).json({
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
  saveVideoInAPlaylistHandler,
};
