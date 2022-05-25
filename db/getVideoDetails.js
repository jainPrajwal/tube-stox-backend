const { videosDatabase } = require("./initialDatabase");
const axios = require(`axios`).default
const getVideoDetails = () => {
  let ArrayOfPromises = [];
  for (let key in videosDatabase) {
    for (let id of videosDatabase[key]) {
      ArrayOfPromises.push({
        videoPromise: axios.get(
          `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&regionCode=IN&key=AIzaSyCZB9Mug8n4flDqlfwKbm_2x40SfnjS_XU`
        ),
        category: key,
      });
    }
  }
  return ArrayOfPromises;
};

module.exports = { getVideoDetails };
