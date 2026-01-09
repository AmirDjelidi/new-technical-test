const express = require("express");
const router = express.Router();
const passport = require("passport");
const Project = require("../models/project"); // Ton modèle Mongoose


router.post("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const { name, description, budget } = req.body;

    const newProject = await Project.create({ name, description, budget });

    return res.status(200).json({ ok: true, data: newProject });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {

    const projects = await Project.find();

    return res.status(200).json({ ok: true, data: projects });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

router.get("/:id", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ ok: false, error: "Project not found" });

    return res.status(200).json({ ok: true, data: project });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

router.delete("/:id", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const projectId = req.params.id;

    await Project.findByIdAndDelete(projectId);

    return res.status(200).json({ ok: true, data: "Deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

module.exports = router;