const {
  finalizeMeeting,
} = require("../services/meetingFinalizer");

exports.endMeeting = async (req, res) => {
  try {
    const { meetingId } = req.body;

    if (!meetingId) {
      return res.status(400).json({
        success: false,
        message: "meetingId is required",
      });
    }

    const meeting =
      await finalizeMeeting(meetingId);

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