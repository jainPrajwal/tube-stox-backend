const { videosDatabase } = require("./initialDatabase");
const https = require(`https`);

const axios = require(`axios`).default;
const getVideoDetails = () => {
  let ArrayOfPromises = [];
  for (let key in videosDatabase) {
    for (let id of videosDatabase[key]) {
      ArrayOfPromises.push({
        videoPromise: axios.get(
          `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&regionCode=IN&key=AIzaSyCZB9Mug8n4flDqlfwKbm_2x40SfnjS_XU`,
          {
            httpsAgent: new https.Agent({ keepAlive: true }),
            timeout: 160000
          }
        ),
        category: key,
      });
    }
  }
  console.log(`ArrayOfPromises length`, ArrayOfPromises.length);
  return ArrayOfPromises;
};

module.exports = { getVideoDetails };
