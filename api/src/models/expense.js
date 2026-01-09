const mongoose = require("mongoose");

const MODELNAME = "Expense";

const Schema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "project", required: true },
  createdAt: { type: Date, default: Date.now },
});

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
