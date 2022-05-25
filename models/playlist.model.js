const mongoose = require(`mongoose`);
require(`mongoose-type-url`)
const { getRequiredValidationMessage } = require("../utils/common.utils");
const { Schema } = mongoose;

const PlaylistSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: `user`,
  },
  name: {
    type: String,
    requred: getRequiredValidationMessage(`playlist name `),
  },
  description: {
    type: String,
    default: ``,
  },
  type: {
    type: String,
    enum: [`history`, `watchlater`, `liked`, `custom`],
    default: `custom`,
    unique: true
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  thumbnail: {
    type: mongoose.SchemaTypes.Url,
    default: `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870`,
  },
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: `video`,
    },
  ],
});

const PlaylistModel = new mongoose.model(`playlist`, PlaylistSchema);

module.exports = { PlaylistModel };
