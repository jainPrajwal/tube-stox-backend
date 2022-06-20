const { VideoModel } = require("../models/video.model");

const getVideoByVideoId = async (videoId) => {
  return await VideoModel.findOne({ _id: videoId });
};

const saveVideo = async (video) => {
  return await VideoModel(video).save();
};


const getTotalCountOfVideosInDatabase = async () => {
  return await VideoModel.estimatedDocumentCount();
};

module.exports = { getVideoByVideoId, saveVideo, getTotalCountOfVideosInDatabase };
