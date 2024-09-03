const Team = require("../models/teamModel");
const fs = require("fs");
const path = require("path");

// Create a new team member
exports.createTeamMember = async (req, res) => {
  try {
    const { name, designation, expertise, experience, description } = req.body;

    const images = req.file.path;

    const teamMember = new Team({
      name,
      designation,
      expertise,
      experience,
      description,
      images: images,
    });
    await teamMember.save();
    res.status(201).json(teamMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all team members
exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.find();
    res.json(teamMembers);
    console.log(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single team member by ID
exports.getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found." });
    }
    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a team member by ID
exports.updateTeamMember = async (req, res) => {
  try {
    const teamMember = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found." });
    }
    res.json(teamMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// // Delete a team member by ID
// exports.deleteTeamMember = async (req, res) => {
//   try {
//     const teamMember = await Team.findByIdAndDelete(req.params.id);
//     if (!teamMember) {
//       return res.status(404).json({ message: "Team member not found." });
//     }
//     res.json({ message: "Team member deleted successfully." });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Delete a team member by ID
exports.deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await Team.findByIdAndDelete(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found." });
    }

    // Delete the associated image
    const imagePath = path.join(__dirname, "../", teamMember.images);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Failed to delete image:", err);
        return res.status(500).json({ message: "Failed to delete image." });
      }
      res.json({ message: "Team member and image deleted successfully." });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
