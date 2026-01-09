const express = require("express");
const router = express.Router();
const passport = require("passport");
const Expense = require("../models/expense");
const ERROR_CODES = require("../utils/errorCodes");

router.post("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const { description, amount, projectId } = req.body;

    const expense = await Expense.create({ description, amount, projectId });

    return res.status(200).json({ ok: true, data: expense });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});


router.get("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {

    const { projectId } = req.query;

    const expenses = await Expense.find({ projectId });

    return res.status(200).json({ ok: true, data: expenses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

router.delete("/:id", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    return res.status(200).json({ ok: true, data: "Deleted" });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

module.exports = router;
