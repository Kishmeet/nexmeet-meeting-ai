const express = require("express");
const cors = require("cors");

const transcriptRoutes = require("./routes/transcriptRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const livekitRoutes = require("./routes/livekitRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Service Running",
  });
});

// Routes
app.use("/api/transcript", transcriptRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/meeting", meetingRoutes);
app.use("/api/livekit", livekitRoutes);

module.exports = app;