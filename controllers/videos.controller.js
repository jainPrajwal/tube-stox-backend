const { VideoModel } = require("../models/video.model");
const { RESPONSE } = require("../utils/common.utils");
const {
  getTotalCountOfVideosInDatabase,
  saveVideo,
  getVideoByVideoId,
} = require("../utils/videos.utils");

function getAllVideosHandler() {
  return async (req, res) => {
    try {
      let {
        query: { pageNo, limit },
      } = req;
      pageNo = Number(pageNo);
      limit = Number(limit);

      const startIndex = (pageNo - 1) * limit;
      const endIndex = pageNo * limit;
      let pagination = { next: null, previous: null, limit };

      if (startIndex > 0) {
        pagination.previous = pageNo - 1;
      }
      if (endIndex < (await getTotalCountOfVideosInDatabase())) {
        pagination.next = pageNo + 1;
      }

      let videos = await VideoModel.find({})
        .populate(`publisher`)
        .limit(limit)
        .skip(startIndex);

      res.json({
        status: 200,
        success: true,
        message: `videos fetched sucessfully`,
        videos,
        pagination,
      });
    } catch (error) {
      console.error(`some error occured while getting videos from DB`, error);
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,

        message: `some error occured while getting videos from DB`,
        errorMessage: error.errorMessage,
      });
    }
  };
}

function saveVideoHandler() {
  return async (req, res) => {
    let { video } = req.body;
    const { user } = req;
    try {
      if (video) {
        video.publisher = user._id;
        let savedVideo = await saveVideo(video);
        res.json({
          status: 201,
          success: true,
          message: `video saved to database succesfully`,
          video: savedVideo,
        });
      } else {
        res.json({
          ...RESPONSE.NOT_FOUND,
          message: `The request could not be understood by the server due to malformed syntax.`,
        });
      }
    } catch (error) {
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        success: false,
        message: `something went wrong while saving video to DB`,
        errorMessage: error.message,
      });
    }
  };
}

function getVideoByVideoIdHandler() {
  return async (req, res) => {
    const {
      params: { videoId },
    } = req;
    try {
      const foundVideo = await getVideoByVideoId(videoId);
      if (foundVideo) {
        res.json({
          status: 200,
          success: true,
          message: `Video fetched Successfully`,
          video: foundVideo,
        });
        return;
      }
      res.json({
        ...RESPONSE.NOT_FOUND,
        message: `Video not found`,
      });
    } catch (error) {
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `something went wrong while fethcing video`,
        errorMessage: error.message,
      });
    }
  };
}

function updateVideoDetailsHandler() {
  return async (req, res) => {
    const {
      params: { videoId },
      user,
      body: { video },
    } = req;
    try {
      const updatedVideo = await VideoModel.findOneAndUpdate(
        {
          _id: videoId,
          publisher: user._id,
        },
        { ...video },
        { new: true }
      );

      if (updatedVideo) {
        res.json({
          status: 201,
          success: true,
          message: `Video Edited Successfully`,
          video: updatedVideo,
        });
        return;
      }
      res.json({
        ...RESPONSE.NOT_FOUND,
        message: `video not found`,
      });
    } catch (error) {
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `something went wrong while editing video details`,
        errorMessage: error.message,
      });
    }
  };
}

module.exports = {
  getAllVideosHandler,
  saveVideoHandler,
  getVideoByVideoIdHandler,
  updateVideoDetailsHandler,
};
