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
    channelTitle: {
      type: String,
    },
    thumbnails: {
      type: Array,
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
    originallyCreatedBy: {
      type: String,
    },
  },
  options
);
const VideoModel = new mongoose.model(`video`, VideoSchema);

module.exports = { VideoModel };
