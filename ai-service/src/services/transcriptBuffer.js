const transcripts = {};

function addTranscript(meetingId, participantName, text) {
  if (!text || !text.trim()) return;

  if (!transcripts[meetingId]) {
    transcripts[meetingId] = [];
  }

  transcripts[meetingId].push(
    `[${participantName}] ${text.trim()}`
  );
}

function getTranscript(meetingId) {
  return transcripts[meetingId]?.join("\n") || "";
}

function clearTranscript(meetingId) {
  delete transcripts[meetingId];
}

module.exports = {
  addTranscript,
  getTranscript,
  clearTranscript,
};