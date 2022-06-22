const mongoose = require(`mongoose`);
const {
  getRequiredValidationMessage,
  options,
} = require("../utils/common.utils");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: getRequiredValidationMessage(`name `),
    },
    email: {
      type: String,
      required: getRequiredValidationMessage(`email `),
      unique: true,
      immutable: true,
    },
    password: {
      type: String,
      required: getRequiredValidationMessage(`password `),
    },
    avatar: {
      type: String,
      default: `yellow`,
    },
    isAPremiumMember: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: [`male`, `female`, `others`],
      immutable: true,
      required: getRequiredValidationMessage(`gender `),
    },
  },
  options
);

const UserModel = new mongoose.model(`user`, UserSchema);

module.exports = { UserModel };
