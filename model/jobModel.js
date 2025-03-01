const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, "Job title must have less or equal than 50 characters"],
    minlength: [2, "Job title must have more or equal than 2 characters"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  payment: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, "Location must have less or equal than 50 characters"],
    minlength: [2, "Location must have more or equal than 2 characters"],
  },
  type: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
    required: false,
  },
  createdBy: {
    type: {},
    required: true,
  },
  workers: {
    type: [],
    default: [],
    required: false,
  },
});
const Jobs = mongoose.model("Jobs", jobSchema);
module.exports = Jobs;
