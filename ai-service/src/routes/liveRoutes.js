const express = require("express");

const router = express.Router();
const { getCaption } = require("../services/captionBuffer");
const { finalizeMeeting } = require("../services/meetingFinalizer");

// Optional: receive live transcript
router.post("/transcript", async (req, res) => {
  try {
    const { transcript } = req.body;

    console.log("\n========== LIVE TRANSCRIPT ==========");
    console.log(transcript);
    console.log("=====================================\n");

    res.json({
      success: true,
      message: "Transcript received",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
router.get("/caption/:meetingId", (req, res) => {
  const caption = getCaption(req.params.meetingId);

  if (!caption) {
    return res.status(404).json({
      success: false,
      message: "No caption available",
    });
  }

  res.json({
    success: true,
    caption,
  });
});
// End meeting and generate summary
router.post("/end", async (req, res) => {
  try {
    // Ensure body exists
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const meetingId = req.body.meetingId;

    // Validate meetingId
    if (!meetingId || typeof meetingId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid meetingId is required",
      });
    }

    const meeting = await finalizeMeeting(meetingId);

    res.status(200).json({
      success: true,
      meeting,
    });
  } catch (err) {
    console.error("End Meeting Error:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
});

module.exports = router;
