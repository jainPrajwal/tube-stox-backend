const { getVideoDetails } = require("./getVideoDetails");

const getNormalizedVideoDetails = (arr = getVideoDetails()) => {
  let finalArray = [];
  let completedPromises = 0;
  return new Promise((resolve, reject) => {
    arr.forEach(async (promise) => {
      try {
        const response = await promise.videoPromise;
        const {
          data: { items },
        } = response;
        completedPromises += 1;
        items.forEach((item) => {
          delete item[`kind`];
          delete item[`etag`];
          delete item[`snippet`][`categoryId`];
          delete item[`snippet`][`liveBroadcastContent`];
          delete item[`snippet`][`localized`];
          delete item[`snippet`][`defaultAudioLanguage`];
          const normalizedObject = {
            url: item.id,
            category: promise.category,
            views: 0,
            likes: 0,
            title: item.snippet.title,
            description: item.snippet.description,
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle,
            thumbnails: item.snippet.thumbnails,
            duration: item.contentDetails.duration,
            publisher:
              completedPromises % 2 === 0
                ? `628cdc97496dc17e7ee51cb9`
                : `628cdca6496dc17e7ee51cc2`,
            isPremium: completedPromises % 4 === 0,
          };
          finalArray.push(normalizedObject);
        });

        if (completedPromises === arr.length - 1) {
          resolve(finalArray);
        }
      } catch (error) {
        console.log(`error`, error.message, promise.videoPromise);
        reject(error);
      }
    });
  });
};

module.exports = { getNormalizedVideoDetails };
