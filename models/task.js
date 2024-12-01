const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    }, // Reference to Project
    milestone: { type: mongoose.Schema.Types.ObjectId, ref: "Milestone" }, // Optional reference to a Milestone
    startDate: { type: Date, required: true },
    deadline: { type: Date, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to Employee
    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending",
    },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of collaborators
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
