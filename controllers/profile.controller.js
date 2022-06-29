const { PaymentModel } = require("../models/payment.model");
const { PlaylistModel } = require("../models/playlist.model");
const { UserModel } = require("../models/user.model");
const { VideoModel } = require(`../models/video.model`);
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
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isAPremiumMember: user.isAPremiumMember,
          publishedVideos,
          gender: user.gender,
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

function updateProfileHandler() {
  return async (req, res) => {
    const {
      user,
      body: { profile },
    } = req;
    if (profile?.isAPremiumMember) {
      try {
        const foundPayment = await PaymentModel.find({ user: user._id });
        if (!foundPayment) {
          res.status(404).json({
            ...RESPONSE.NOT_FOUND,
            message: `payment details not found`,
          });
          return;
        }
      } catch (error) {
        res.status(500).json({
          status: 500,
          success: false,
          message: `something went wrong while fetching payment details`,
          errorMessage: error.message,
        });
      }
    }
    try {
      const updatedProfile = await UserModel.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          ...profile,
        },
        {
          new: true,
        }
      );
      try {
        const publishedVideos = await VideoModel.find({
          publisher: user._id,
        });
        res.json({
          status: 200,
          success: true,
          message: `profile updated successfully`,
          profile: {
            name: updatedProfile.name,
            avatar: updatedProfile.avatar,
            email: updatedProfile.email,

            isAPremiumMember: updatedProfile.isAPremiumMember,
            publishedVideos,
          },
        });
      } catch (error) {
        res.json({
          ...RESPONSE.INTERNAL_SERVER_ERROR,
          message: `something went wrong while fetching videos published by you`,
          errorMessage: error.message,
        });
      }
    } catch (error) {
      console.error(`error`, error);
      res.status(500).json({
        status: 500,
        success: false,
        message: `something went wrong while upading the user profile`,
        errorMessage: error.message,
      });
    }
  };
}

module.exports = { getProfileHandler, updateProfileHandler };
