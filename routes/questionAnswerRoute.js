const express = require("express");
const {
  addQuestion,
  answerQuestion,
  getAllQuestions,
} = require("../controllers/questionAnswerController");

const router = express.Router();

router.post("/", addQuestion);
router.post("/:id/answer", answerQuestion);
router.get("/", getAllQuestions);

module.exports = router;
