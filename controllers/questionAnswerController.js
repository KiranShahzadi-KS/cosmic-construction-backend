const QuestionAnswer = require("../models/questionAnswerModel");

// Add a new question
exports.addQuestion = async (req, res) => {
  try {
    const newQuestion = await QuestionAnswer.create({
      questionText: req.body.questionText,
    });
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Answer a question
exports.answerQuestion = async (req, res) => {
  try {
    const updatedQuestion = await QuestionAnswer.findByIdAndUpdate(
      req.params.id,
      {
        answerText: req.body.answerText,
        isAnswered: true,
        answeredAt: Date.now(),
      },
      { new: true }
    );
    res.status(200).json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await QuestionAnswer.find().sort({ askedAt: -1 });
    res.status(200).json(questions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
