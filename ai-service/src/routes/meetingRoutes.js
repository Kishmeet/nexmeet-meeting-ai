const express = require("express");

const upload = require(
  "../middleware/upload"
);

const {
  processMeeting,
  getMeeting,
} = require(
  "../controllers/meetingController"
);

const router = express.Router();

router.post(
  "/process",
  upload.single("audio"),
  processMeeting
);

router.get(
  "/:id",
  getMeeting
);

module.exports = router;