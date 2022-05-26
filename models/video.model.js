const mongoose = require(`mongoose`);
const {
  getRequiredValidationMessage,
  options,
} = require("../utils/common.utils");
const { Schema } = mongoose;

const VideoSchema = new Schema(
  {
    url: {
      type: String,
      required: getRequiredValidationMessage(`URL `),
      unique: true,
      immutable: true,
    },
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
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  options
);
const VideoModel = new mongoose.model(`video`, VideoSchema);

module.exports = { VideoModel };
