const express = require("express");

const upload = require("../config/multer");
const {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/teamController");

const router = express.Router();

router.post("/", upload.single("images"), createTeamMember);
router.get("/", getAllTeamMembers);
router.get("/:id", getTeamMemberById);
router.put("/:id", upload.single("image"), updateTeamMember);
router.delete("/:id", deleteTeamMember);

module.exports = router;
