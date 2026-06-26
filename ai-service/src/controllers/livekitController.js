const {
  generateUserToken,
} = require("../services/livekitTokenService");

async function getToken(req, res) {
  try {
    const room = req.query.room || "test-room";
    const identity = req.query.identity || "test-user";

    const token = await generateUserToken(
      room,
      identity
    );

    res.json({
      success: true,
      room,
      identity,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

module.exports = {
  getToken,
};