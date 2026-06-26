const Meeting = require("../models/Meeting");

const { getTranscript, clearTranscript } = require("./transcriptBuffer");

const { createSummary } = require("./summaryService");

async function finalizeMeeting(meetingId) {
  try {
    const transcript = getTranscript(meetingId);

    if (!transcript) {
      throw new Error("No transcript available");
    }

    // Generate AI summary
    const summary = await createSummary(transcript);

    // Convert string action items to objects if needed
    const formattedActionItems = (summary.actionItems || []).map((item) => {
      if (typeof item === "string") {
        return {
          assignee: "Unassigned",
          task: item,
          deadline: "",
        };
      }

      return item;
    });

    // Save meeting
    const meeting = await Meeting.create({
      meetingId,
      transcript,
      summary: summary.summary,
      keyPoints: summary.keyPoints,
      actionItems: formattedActionItems,
    });

    clearTranscript(meetingId);

    return meeting;
  } catch (error) {
    console.error("Meeting Finalizer Error:", error);
    throw error;
  }
}

module.exports = {
  finalizeMeeting,
};
