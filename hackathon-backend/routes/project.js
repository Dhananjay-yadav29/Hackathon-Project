const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const fetchuser = require('../middlewares/fetchuser');
const { body, validationResult } = require('express-validator');


// Route 1: Get all Projects
router.get('/fetchallprojects', fetchuser, async (req, res) => {
    try {
    const project = await Project.find({user: req.user.id});
    res.json(project);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }

})


// Route 2: Add a Project
router.post('/addproject', fetchuser, [
    body('name', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
    body('university', 'University name must be atleast 3 characters').isLength({ min: 3 })
], async (req, res) => {

    const { name, description, university } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const project = new Project({
            name, description, university, user: req.user.id
        })

        const savedProject = await project.save();
        res.json(savedProject);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }

})


// Route 3: Update a project
router.put('/updateproject/:id', fetchuser, async (req, res) => {
    const { name, description, university } = req.body;
    try {
        // Create a newProject object
        const newProject = {};
        if (name) { newProject.name = name };
        if (description) { newProject.description = description };
        if (university) { newProject.university = university };

        // Find the note to be updated and update it
        let project = await Project.findById(req.params.id);
        if (!project) { return res.status(404).send("Not Found") }

        if (project.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        project = await Project.findByIdAndUpdate(req.params.id, { $set: newProject }, { new: true })
        res.json({ project });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// Route 4: Delete a project
router.delete('/deleteproject/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let project = await Project.findById(req.params.id);
        if (!project) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (project.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        project = await Project.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Project has been deleted", project: project });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;