const captions = {};

function updateCaption(meetingId, participantName, text) {
  if (!text || !text.trim()) return;

  captions[meetingId] = {
    participant: participantName,
    text: text.trim(),
    timestamp: new Date(),
  };
}

function getCaption(meetingId) {
  return captions[meetingId] || null;
}

function clearCaption(meetingId) {
  delete captions[meetingId];
}

module.exports = {
  updateCaption,
  getCaption,
  clearCaption,
};