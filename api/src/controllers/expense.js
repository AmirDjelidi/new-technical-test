const express = require("express");
const router = express.Router();
const passport = require("passport");
const Expense = require("../models/expense");
const Project = require("../models/project");
const { sendEmail } = require("../services/brevo");
const ERROR_CODES = require("../utils/errorCodes");

router.post("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const { description, amount, projectId } = req.body;
    if (!description || !amount || !projectId) {
      return res.status(400).json({ ok: false, error: "Missing parameters" });
    }
    const expense = await Expense.create({ description, amount, projectId });

    {/*Alert mail if over budget*/}
    const project = await Project.findById(projectId);
    const allExpenses = await Expense.find({ projectId });

    const totalSpent = allExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    if (totalSpent > project.budget) {
      try {
        await sendEmail(
              [{name: "user", email: req.user.email  }],
              `Alerte Dépassement : ${project.name}`,
              `<p>Le projet <b>${project.name}</b> a dépassé son budget de ${project.budget}€.<br>Total actuel : <b>${totalSpent}€</b></p>`
          );
      } catch (emailError) {
        return res.status(500).json({ ok: false, error: "Server error" });
      }
    }

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
