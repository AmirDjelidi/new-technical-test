const express = require("express");
const router = express.Router();
const passport = require("passport");
const Project = require("../models/project");
const ERROR_CODES = require("../utils/errorCodes");

router.post("/", passport.authenticate("user", { session: false, failWithError: true }), async (req, res) => {
  try {
    const {name, description, budget} = req.body;

    await Project.create({name, description, budget});

    return res.status(200).send({ ok: true, data: Project });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR });
  }
});

router.get("/", passport.authenticate("user", { session: false, failWithError: true }), async (req, res) => {
  try {
    const Project = await Project.find();

    return res.status(200).send({ ok: true, data: Project });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR });
  }
});

router.get("/:id", passport.authenticate("user", { session: false, failWithError: true }), async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = Project.findById(projectId);

    if (!project) return res.status(404).send({ ok: false, error: "Project not found" });

    return res.status(200).send({ ok: true, data: Project });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR });
  }
});

router.delete("/:id", passport.authenticate("user", { session: false, failWithError: true }), async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = Project.findByIdAndDelete(projectId);

    if (!project) return res.status(404).send({ ok: false, error: "Project not found" });

    return res.status(200).send({ ok: true, data: Project });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR });
  }
});
/*
router.put("/:id", passport.authenticate("user", { session: false, failWithError: true }), async (req, res) => {
  try {
    const dummyObject = await DummyObject.findById(req.params.id);

    if (!dummyObject) return res.status(404).send({ ok: false, code: ERROR_CODES.NOT_FOUND });

    if (req.body.hasOwnProperty("name")) dummyObject.name = req.body.name;
    if (req.body.hasOwnProperty("description")) dummyObject.description = req.body.description;

    await dummyObject.save();

    return res.status(200).send({ ok: true, data: dummyObject });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR });
  }
});

router.post("/search", passport.authenticate("user", { session: false, failWithError: true }), async (req, res) => {
  try {
    let query = {};

    const limit = req.body.limit || 10;
    const skip = req.body.offset || 0;

    if (req.body.search) {
      query = {
        $or: [
          { name: { $regex: req.body.search, $options: "i" } },
          { description: { $regex: req.body.search, $options: "i" } },
        ],
      };
    }

    const total = await DummyObject.countDocuments(query);
    const data = await DummyObject.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    return res.status(200).send({ ok: true, data, total });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR });
  }
});
*/

module.exports = router;
