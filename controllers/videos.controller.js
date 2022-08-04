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

      let allVideos = await VideoModel.find({}).populate(`publisher`);

      allVideos = allVideos.reverse().slice(startIndex, startIndex + limit);

      // let videos = await VideoModel.find({})
      //   .sort(`-createdAt`)
      //   .populate(`publisher`)
      //   .limit(limit)
      //   .skip(startIndex);

      res.status(200).json({
        status: 200,
        success: true,
        message: `videos fetched sucessfully`,
        videos: allVideos,
        pagination,
      });
    } catch (error) {
      console.error(`some error occured while getting videos from DB`, error);
      res.status(500).json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,

        message: `some error occured while getting videos from DB`,
        errorMessage: error.errorMessage,
      });
    }
  };
}

function getMostWatchedVideosHandler() {
  return async (req, res) => {
    try {
      let videos = await VideoModel.find({}).populate(`publisher`);

      if (videos) {
        let mostWatched = [];
        mostWatched = [...videos]
          .sort((video1, video2) => {
            const totalViews1 =
              video1.views.male + video1.views.female + video1.views.others;
            const totalViews2 =
              video2.views.male + video2.views.female + video2.views.others;
            return totalViews2 - totalViews1;
          })
          .slice(0, 4);

        res.status(200).json({
          status: 200,
          success: true,
          message: `videos fetched sucessfully`,
          videos: mostWatched,
        });
      }
    } catch (error) {
      console.error(`some error occured while getting most videos`, error);
      res.status(500).json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `some error occured while getting most watched videos`,
        errorMessage: error.errorMessage,
      });
    }
  };
}

function getTrendingVideosHandler() {
  return async (req, res) => {
    try {
      let videos = await VideoModel.find({}).populate(`publisher`).limit(10);

      if (videos) {
        const trendingVideos = [...videos].sort((video1, video2) => {
          const currentTime = new Date().getTime();
          const timeElapsed1 =
            currentTime - new Date(video1.createdAt).getTime();
          const timeElapsed2 =
            currentTime - new Date(video2.createdAt).getTime();
         
          

          let totalVideo2Views =
            video2.views.female + video2.views.male + video2.views.others;
          let totalVideo1Views =
            video1.views.female + video1.views.male + video1.views.others;
          /* if (totalVideo2Views === 0) {
            totalVideo2Views = -1;
          }

          if (totalVideo1Views === 0) {
            totalVideo1Views = -1;
          } */
          return (
            parseInt(timeElapsed1 / totalVideo1Views, 10)-
            parseInt(timeElapsed2 / totalVideo2Views, 10) 
          );
        });

        res.status(200).json({
          status: 200,
          success: true,
          message: `videos fetched sucessfully`,
          videos: trendingVideos,
        });
      }
    } catch (error) {
      console.error(`some error occured while getting most videos`, error);
      res.status(500).json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `some error occured while getting most watched videos`,
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
        res.status(201).json({
          status: 201,
          success: true,
          message: `video saved to database succesfully`,
          video: savedVideo,
        });
      } else {
        res.status(404).json({
          ...RESPONSE.NOT_FOUND,
          message: `The request could not be understood by the server due to malformed syntax.`,
        });
      }
    } catch (error) {
      res.status(500).json({
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
        res.status(200).json({
          status: 200,
          success: true,
          message: `Video fetched Successfully`,
          video: foundVideo,
        });
        return;
      }
      res.status(404).json({
        ...RESPONSE.NOT_FOUND,
        message: `Video not found`,
      });
    } catch (error) {
      res.status(500).json({
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
      const updatedVideoWhenUserIsAnOwner = await VideoModel.findOneAndUpdate(
        {
          _id: videoId,
          publisher: user._id,
        },
        { ...video },
        { new: true }
      );

      if (updatedVideoWhenUserIsAnOwner) {
        res.status(201).json({
          status: 201,
          success: true,
          message: `Video Edited Successfully`,
          video: await updatedVideoWhenUserIsAnOwner.populate(`publisher`),
        });
        return;
      } else {
        if (Object.keys(video).length > 1) {
          res.status(401).json({
            status: 401,
            success: false,
            message: `unauthorized action`,
          });
          return;
        }
        try {
          const updatedVideo = await VideoModel.findOneAndUpdate(
            {
              _id: videoId,
            },
            { ...video },
            { new: true }
          );

          res.status(201).json({
            status: 201,
            success: true,
            message: `Video Edited Succesfully`,
            video: await VideoModel(updatedVideo).populate(`publisher`),
          });
          return;
        } catch (error) {
          console.error(`error`, error);
          res.status(500).json({
            ...INTERNAL_SERVER_ERROR,
            message: `somehting went wrong while upading likes or views`,
            errorMessage: error.message,
          });
        }
      }

      res.status(404).json({
        ...RESPONSE.NOT_FOUND,
        message: `video not found`,
      });
    } catch (error) {
      res.status(500).json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `something went wrong while editing video details`,
        errorMessage: error.message,
      });
    }
  };
}

function getUploadedVideosByUserHandler() {
  return async (req, res) => {
    try {
      const { user } = req;
      if (!user) {
        res.status(404).json({
          success: false,
          message: `User not found`,
        });
        return;
      }
      const uploadedVideos = await VideoModel.find({
        publisher: user._id,
      }).populate(`publisher`);
      res.status(200).json({
        success: true,
        message: `videos uploaded by user fetched successfully`,
        videos: uploadedVideos,
      });
    } catch (error) {
      console.error(`error `, error);
      res.status(500).json({
        success: false,
        message: `something went wrong while fetching uploaded videos by user`,
      });
    }
  };
}
module.exports = {
  getAllVideosHandler,
  saveVideoHandler,
  getVideoByVideoIdHandler,
  updateVideoDetailsHandler,
  getMostWatchedVideosHandler,
  getTrendingVideosHandler,
  getUploadedVideosByUserHandler,
};
