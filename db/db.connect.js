const mongoose = require(`mongoose`);
const { VideoModel } = require("../models/video.model");
const { getNormalizedVideoDetails } = require("./getNormalizedVideoDetails");

const intiliazeDatabase = async () => {
  try {
    const PRODUCTION_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@video-library-cluster.7y3yw.mongodb.net/video-library`;
    const db = mongoose.connection;
    db.once(`connected`, async () => {
      if ((await VideoModel.estimatedDocumentCount()) <= 5) {
        try {
          const videos = await getNormalizedVideoDetails();
          try {
            const response = await createModels(videos);
            
          } catch (error) {
            console.error(`error while creating models`, error);
          }
        } catch (error) {
          console.error(`error while getting normailzedData`, error);
        }
      }
    });
    await mongoose.connect(PRODUCTION_URL);
    console.log(`db connection succesful!`);
  } catch (error) {
    console.error(`error connecting to database`, error);
  }
};

module.exports = { intiliazeDatabase };

function createModels(videos) {
 
  let modelsCreated = 0;
  return new Promise((resolve, reject) => {
    videos.forEach(async (video) => {
      await VideoModel.create({ ...video });
      modelsCreated += 1;
      if (modelsCreated === videos.length) {
        resolve(true);
      }
    });
  });
}
