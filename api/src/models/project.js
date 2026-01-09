const mongoose = require("mongoose");

const MODELNAME = "Project";

const Schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  budget: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
