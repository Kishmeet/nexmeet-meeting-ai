const { createSummary } = require("../services/summaryService");

exports.generateSummary = async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({
        success: false,
        message: "Transcript is required",
      });
    }

    const summaryData = await createSummary(transcript);

    return res.status(200).json({
      success: true,
      data: summaryData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
