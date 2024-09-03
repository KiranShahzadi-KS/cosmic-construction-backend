const mongoose = require("mongoose");

const questionAnswerSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, "Question is required"],
    trim: true,
  },
  answerText: {
    type: String,
    trim: true,
  },
  isAnswered: {
    type: Boolean,
    default: false,
  },
  askedAt: {
    type: Date,
    default: Date.now,
  },
  answeredAt: {
    type: Date,
  },
});

module.exports = mongoose.model("QuestionAnswer", questionAnswerSchema);
