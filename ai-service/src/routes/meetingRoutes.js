const express = require("express");

const upload = require("../middleware/upload");

const {
  processMeeting,
  getMeeting,
  getMeetings,
} = require("../controllers/meetingController");

const router = express.Router();

// Offline audio upload
router.post(
  "/process",
  upload.single("audio"),
  processMeeting
);

// Get all meetings
router.get(
  "/",
  getMeetings
);

// Get meeting by meetingId
router.get(
  "/:meetingId",
  getMeeting
);

module.exports = router;