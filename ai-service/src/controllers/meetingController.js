const { generateTranscript } = require("../services/transcriptService");

const { createSummary } = require("../services/summaryService");

const Meeting = require("../models/Meeting");

exports.processMeeting = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required",
      });
    }

    const transcript = await generateTranscript(req.file.path);

    const summary = await createSummary(transcript);

    const meeting = await Meeting.create({
      transcript,

      summary: summary.summary,

      keyPoints: summary.keyPoints,

      actionItems: summary.actionItems,
    });

    res.status(200).json({
      success: true,
      meetingId: meeting._id,
      transcript,
      summary,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
