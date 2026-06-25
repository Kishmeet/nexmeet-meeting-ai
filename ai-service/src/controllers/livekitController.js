const {
  generateToken,
  createRoom,
  listRooms,
} = require("../services/livekitService");

// Generate participant token
exports.createToken = async (req, res) => {
  try {
    const { roomName, participantName } = req.body;

    if (!roomName || !participantName) {
      return res.status(400).json({
        success: false,
        message: "roomName and participantName are required",
      });
    }

    const token = await generateToken(roomName, participantName);

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a new room
exports.createNewRoom = async (req, res) => {
  try {
    const { roomName } = req.body;

    if (!roomName) {
      return res.status(400).json({
        success: false,
        message: "roomName is required",
      });
    }

    const room = await createRoom(roomName);

    res.status(201).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all active rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await listRooms();

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
