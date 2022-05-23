const mongoose = require(`mongoose`);

const intiliazeDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@video-library-cluster.7y3yw.mongodb.net/test`
    );
    console.log(`db connection succesful!`);
  } catch (error) {
    console.error(`error connecting to database`, error);
  }
};

module.exports = { intiliazeDatabase };
