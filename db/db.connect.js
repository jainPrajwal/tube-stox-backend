const mongoose = require(`mongoose`);

// const PRODUCTION_URL = 

const intiliazeDatabase = async () => {
  try {
    const PRODUCTION_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@video-library-cluster.7y3yw.mongodb.net/video-library`;
    await mongoose.connect(PRODUCTION_URL);
    console.log(`db connection succesful!`);
  } catch (error) {
    console.error(`error connecting to database`, error);
  }
};

module.exports = { intiliazeDatabase };
