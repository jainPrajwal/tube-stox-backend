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
      res.json({
        status: 200,
        success: true,
        message: `notes fetched successfully from DB`,
        notes,
      });
    } catch (error) {
      res.json({
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
      res.json({
        ...RESPONSE.MALFORMED_SYNTAX,
        message: `Invalid note sent`,
      });
      return;
    }

    try {
      note.user = user._id;
      note.video = videoId;
      const savedNote = await new NoteModel({ ...note }).save();
      res.json({
        status: 201,
        success: true,
        message: `note created succesfully`,
        note: savedNote,
      });
    } catch (error) {
      res.json({
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
      res.json({
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

      res.json({
        status: 200,
        message: `Note updated successfully`,
        note: updatedNote,
      });
    } catch (error) {
      res.json({
        ...RESPONSE.INTERNAL_SERVER_ERROR,
        message: `something went wrong while updating the note`,
        errorMessage: error.message,
      });
    }
  };
}

module.exports = {
  getNotesForAVideoHandler,
  updateNoteHandler,
  saveNoteHandler,
};