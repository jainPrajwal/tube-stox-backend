const express = require(`express`);
const router = express.Router();
const { VideoModel } = require("../models/video.model");
const { UserModel } = require("../models/user.model");

router
  .route(`/`)
  .get(async (req, res) => {
    try {
      let videos = await VideoModel.find({}).populate(`publisher`);
      console.log({ videos });
      res.json({
        status: 200,
        success: true,
        message: `videos fetched sucessfully`,
        videos,
      });
    } catch (error) {
      console.error(`some error occured while getting videos from DB`, error);
      res.json({
        status: 500,
        success: false,
        message: `some error occured while getting videos from DB`,
        errorMessage: error.errorMessage,
      });
    }
  })
  .post(async (req, res) => {
    let { video } = req.body;
    try {
      if (video) {
        let savedVideo = await new VideoModel(video).save();
        res.json({
          status: 201,
          success: true,
          message: `video saved to database succesfully`,
          video: savedVideo,
        });
      } else {
        res.json({
          status: 400,
          success: false,
          message: `The request could not be understood by the server due to malformed syntax.`,
        });
      }
    } catch (error) {
      res.json({
        status: 500,
        success: true,
        message: `something went wrong while saving video to DB`,
      });
    }
  });

module.exports = { router };
