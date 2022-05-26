const express = require(`express`);
const mongoose = require(`mongoose`);
const { options } = require("../utils/common.utils");

const { Schema } = mongoose;

const NoteSchema = new Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `video`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `user`,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  options
);

const NoteModel = new mongoose.model(`note`, NoteSchema);

module.exports = { NoteModel };
