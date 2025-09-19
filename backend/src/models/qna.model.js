const mongoose = require('mongoose');

const QnASchema = new mongoose.Schema({
  question: String,
  answer: String,
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

QnASchema.index({ question: 'text', answer: 'text', tags: 'text' }); // for simple text search
module.exports = mongoose.model('QnA', QnASchema);
