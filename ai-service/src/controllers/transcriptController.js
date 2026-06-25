const { generateTranscript } = require("../services/transcriptService");

exports.transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required",
      });
    }

    const transcript = await generateTranscript(req.file.path);

    res.status(200).json({
      success: true,
      transcript,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
