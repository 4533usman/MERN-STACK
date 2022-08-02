const express = require('express');
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const User = require('../models/Notes');
const { findById } = require('../models/Notes');
// Route 1. Creating the end point /api/notes/fetchallnotes . Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
 
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }

});
// Route 2. Creating the end point /api/notes/addnote . Login required
router.post('/addnote', [
    body('title', 'title Must be at least 5 character').isLength({ min: 3 }),
    body('description', 'description Should be at least 3 character').isLength({ min: 5 })
], fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tag } = req.body;
        const note = new Notes({ title, description, tag, user: req.user.id })
        const savedNote = await note.save()
        res.json(savedNote)

    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }

});
// Route 3. Creating the end point /api/notes/addnote . Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //Create the new Object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };
        let note = await Notes.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not Found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Found")
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })


    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }


})
// Route 4. Creating the end point /api/notes/deletenote . Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not Found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Found")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ note })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }


})
module.exports = router




