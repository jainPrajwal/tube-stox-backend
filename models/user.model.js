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
      validate: {
        validator: function (value) {
          return /^(?=.*[A-Z])(?=.*\d).{8,}$/g.test(value);
        },
        message: () =>
          `Password should contain atleast 6 characters (atleast one number & one upper case letter)`,
      },
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
