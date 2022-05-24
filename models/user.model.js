const mongoose = require(`mongoose`);
const { getRequiredValidationMessage } = require("../utils/common.utils");

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: getRequiredValidationMessage(`name `),
  },
  email: {
    type: String,
    required: getRequiredValidationMessage(`email `),
    unique: true
  },
  password: {
    type: String,
    required: getRequiredValidationMessage(`password `),
  },
  avatar: {
    type: String,
    default: `yellow`,
  },
});

const UserModel = new mongoose.model(`user`, UserSchema);

module.exports = { UserModel };
