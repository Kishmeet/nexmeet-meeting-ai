const WebSocket = require("ws");
const { addTranscript } = require("./transcriptBuffer");
const { updateCaption } = require("./captionBuffer");
function createDeepgramConnection(meetingId, participantName) {
  const socket = new WebSocket(
    "wss://api.deepgram.com/v1/listen?" +
      "model=nova-3" +
      "&encoding=linear16" +
      "&sample_rate=48000" +
      "&channels=1" +
      "&language=multi" +
      "&smart_format=true" +
      "&punctuate=true" +
      "&interim_results=true",
    {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      },
    },
  );

  socket.on("open", () => {
    console.log(`Deepgram Connected (${participantName})`);
  });

  socket.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      const transcript = data.channel?.alternatives?.[0]?.transcript;

      if (!transcript) return;

      // Only save final transcript
      if (!data.is_final) return;

      console.log(`[${participantName}] ${transcript}`);

      addTranscript(meetingId, participantName, transcript);

      updateCaption(meetingId, participantName, transcript);
    } catch (err) {
      console.error("Deepgram Parse Error:", err);
    }
  });

  socket.on("close", () => {
    console.log(`Deepgram Closed (${participantName})`);
  });

  socket.on("error", (err) => {
    console.error(`Deepgram Error (${participantName}):`, err);
  });

  return socket;
}

module.exports = {
  createDeepgramConnection,
};
