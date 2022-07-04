const { NoteModel } = require("../models/note.model");
const { RESPONSE } = require("../utils/common.utils");

function getNotesForAVideoHandler() {
  return async (req, res) => {
    const {
      params: { videoId },
      user,
    } = req;

    try {
      const notes = await NoteModel.find({ video: videoId, user: user._id });
      res.status(200).json({
        status: 200,
        success: true,
        message: `notes fetched successfully from DB`,
        notes,
      });
    } catch (error) {
      res.status(500).json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `something went wrong while fetching notes from DB`,
        errorMessage: error.message,
      });
    }
  };
}

function saveNoteHandler() {
  return async (req, res) => {
    const {
      params: { videoId },
      body: { note },
      user,
    } = req;
    if (!note) {
      res.status(400).json({
        ...RESPONSE.MALFORMED_SYNTAX,
        message: `Invalid note sent`,
      });
      return;
    }

    try {
      note.user = user._id;
      note.video = videoId;
      const savedNote = await new NoteModel({ ...note }).save();
      res.status(201).json({
        status: 201,
        success: true,
        message: `note created succesfully`,
        note: savedNote,
      });
    } catch (error) {
      res.status(500).json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `somehtibng went wrong while updating note`,
        errorMessage: error.message,
      });
    }
  };
}

function updateNoteHandler() {
  return async (req, res) => {
    const {
      params: { noteId },
      user,
      body: { note },
    } = req;

    if (!note) {
      res.status(400).json({
        ...RESPONSE.MALFORMED_SYNTAX,
        message: `Invalid note sent`,
      });

      return;
    }
    try {
      const updatedNote = await NoteModel.findOneAndUpdate(
        { _id: noteId },
        { ...note },
        { new: true }
      );

      res.status(201).json({
        status: 201,
        message: `Note updated successfully`,
        note: updatedNote,
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `something went wrong while updating the note`,
        errorMessage: error.message,
      });
    }
  };
}

function deleteNoteHandler() {
  return async (req, res) => {
    const {
      params: { videoId, noteId },
    } = req;
    const foundNote = await NoteModel.findOneAndDelete({
      _id: noteId,
    });
    if (!foundNote) {
      res.status(404).json({
        ...RESPONSE.NOT_FOUND,
        message: `Note not found!`,
      });
      return;
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: `Video Deleted Successfully`,
      note: foundNote,
    });
  };
}

module.exports = {
  getNotesForAVideoHandler,
  updateNoteHandler,
  saveNoteHandler,
  deleteNoteHandler,
};
