const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    transcript: {
      type: String,
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    keyPoints: [String],

    actionItems: [
      {
        assignee: String,
        task: String,
        deadline: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Meeting", meetingSchema);
