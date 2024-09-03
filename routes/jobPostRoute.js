const express = require("express");
const {
  createJob,
  getById,
  updateJob,
  deleteJob,
  getAll,
  getJobsByCategory,
} = require("../controllers/jobPostController");

const router = express.Router();

router.post("/", createJob);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

//seaarch
router.get("/jobs/category/:categoryId", getJobsByCategory);

module.exports = router;
