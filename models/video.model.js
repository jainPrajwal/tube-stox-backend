const mongoose = require(`mongoose`);
const { getRequiredValidationMessage } = require("../utils/common.utils");
const { Schema } = mongoose;

const VideoSchema = new Schema({
  title: {
    type: String,
    required: getRequiredValidationMessage(`title `),
  },
  description: {
    type: String,
    required: getRequiredValidationMessage(`description `),
  },
  views: {
    type: Number,
    required: getRequiredValidationMessage(`Number of Views `),
  },
  likes: {
    type: Number,
    required: getRequiredValidationMessage(`Number of likes `),
  },
  channelId: {
    type: String,
    required: getRequiredValidationMessage(`Channel Id `),
  },
  duration: {
    type: String,
    required: getRequiredValidationMessage(`Duration `),
  },
  category: {
    type: String,
    required: getRequiredValidationMessage(`Category `),
  },
  publisher: {
    type: Schema.Types.ObjectId,
    ref: `user`,
  },
});
const VideoModel = new mongoose.model(`video`, VideoSchema);

module.exports = { VideoModel };
