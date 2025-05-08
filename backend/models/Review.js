const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  professorName: { type: String, required: true },
  courseName: { type: String, required: true },
  semester: { type: String, required: true },
  clarity: Number,
  engagement: Number,
  knowledge: Number,
  fairness: Number,
  approachability: Number,
  organization: Number,
  discussion: Number,
  workload: Number,
  respect: Number,
  realWorldConnections: Number,
  review: String,
  reportMisconduct: Boolean,
  allowAnalytics: Boolean,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
