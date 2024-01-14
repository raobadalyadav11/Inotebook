const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");

// Rote:1 get all the notes using: GET "/api/notes/fetchallnotes" (login required Auth)

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Rote:2 Add new notes  using: POST "/api/notes/addnotes" (login required Auth)
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter valid title").isLength({ min: 3 }),
    body("description", "Enter a minimum 8 digit description ").isLength({
      min: 8,
    }),
    // body("tag", "Enter a tag name ").isLength({ min: 3 })
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //if there are error return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNotes = await note.save();
      res.json(saveNotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
// Rote:3 update notes using: PUT "/api/notes/updatenotes" (login required Auth)

router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  //create newnote object
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }
  try {
    // find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note not found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Rote:4 delete an exiting notes using: DELETE "/api/notes/deletenotes" (login required Auth)

router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
    try {
      // find the note to be delete and deleted it
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Note not found");
      }
      //allow deletion only if user own this notes
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
      }
  
      note = await Note.findByIdAndDelete(req.params.id);
  
      res.json({"success":"Note has been deleted",note:note});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  });
  
module.exports = router;