const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Reference to Project
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Milestone', MilestoneSchema);
