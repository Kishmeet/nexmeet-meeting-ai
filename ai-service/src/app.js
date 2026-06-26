const express = require("express");
const cors = require("cors");

const transcriptRoutes = require("./routes/transcriptRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const liveRoutes = require("./routes/liveRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const livekitRoutes = require("./routes/livekitRoutes");

const { connectToRoom } = require("./services/livekitRtcService");

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Service Running",
  });
});

// Routes
app.use("/api/transcript", transcriptRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/live", liveRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/livekit", livekitRoutes);

// Start AI agent
(async () => {
  try {
    await connectToRoom("test-room");
  } catch (err) {
    console.error("Failed to connect AI agent:", err);
  }
})();

module.exports = app;