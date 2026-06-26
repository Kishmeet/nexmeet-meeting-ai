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
      meetingId: `meeting-${Date.now()}`,
      transcript,
      summary: summary.summary,
      keyPoints: summary.keyPoints,
      actionItems: summary.actionItems,
    });

    res.status(200).json({
      success: true,
      meeting,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      meetings,
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
    const meeting = await Meeting.findOne({
      meetingId: req.params.meetingId,
    });

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
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};