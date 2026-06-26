const { Room, AudioStream, TrackKind } = require("@livekit/rtc-node");
const WebSocket = require("ws");

const { generateAgentToken } = require("./livekitTokenService");
const { createDeepgramConnection } = require("./deepgramLive");
const { finalizeMeeting } = require("./meetingFinalizer");
const { clearCaption } = require("./captionBuffer");

const FINALIZATION_DELAY = 5000;

async function connectToRoom(roomName) {
  const token = await generateAgentToken(roomName);
  const room = new Room();

  const participants = new Set();
  const deepgramSockets = new Map();

  let finalized = false;
  let finalizeTimer = null;

  function cancelFinalization() {
    if (finalizeTimer) {
      clearTimeout(finalizeTimer);
      finalizeTimer = null;
      console.log("Meeting finalization cancelled.");
    }
  }

  function cleanupDeepgramSocket(identity) {
    const socket = deepgramSockets.get(identity);

    if (!socket) return;

    if (
      socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING
    ) {
      try {
        socket.close();
      } catch (err) {
        console.error(`Error closing Deepgram socket for ${identity}:`, err);
      }
    }

    deepgramSockets.delete(identity);
    console.log(`Deepgram closed for ${identity}`);
  }

  function scheduleFinalization() {
    if (participants.size !== 0) return;
    if (finalized) return;

    cancelFinalization();

    console.log(
      `Room empty. Waiting ${FINALIZATION_DELAY / 1000}s before finalizing...`
    );

    finalizeTimer = setTimeout(async () => {
      if (participants.size > 0 || finalized) {
        console.log("Participant rejoined. Skipping finalization.");
        return;
      }

      try {
        console.log("Meeting ended.");
        console.log("Generating summary...");

        await finalizeMeeting(roomName);
        
        finalized = true;

        clearCaption(roomName);

        console.log("Meeting saved successfully.");
      } catch (err) {
        console.error("Meeting Finalization Error:", err);
      } finally {
        for (const identity of deepgramSockets.keys()) {
          cleanupDeepgramSocket(identity);
        }

        try {
          await room.disconnect();
          console.log("AI agent disconnected.");
        } catch (err) {
          console.error("Disconnect Error:", err);
        }

        participants.clear();
        cancelFinalization();
      }
    }, FINALIZATION_DELAY);
  }

  room.on("participantConnected", (participant) => {
    if (participant.identity === "nexmeet-ai") return;

    console.log("Participant Joined:", participant.identity);
    participants.add(participant.identity);
    cancelFinalization();

    console.log("Active Participants:", [...participants]);
  });

  room.on("participantDisconnected", (participant) => {
    if (participant.identity === "nexmeet-ai") return;

    console.log("Participant Left:", participant.identity);
    
    participants.delete(participant.identity);
    cleanupDeepgramSocket(participant.identity);

    console.log("Remaining Participants:", [...participants]);
    scheduleFinalization();
  });

room.on("trackSubscribed", async (track, publication, participant) => {
    if (
      participant.identity === "nexmeet-ai" ||
      track.kind !== TrackKind.KIND_AUDIO 
    ) {
      return;
    }

    console.log("================================");
    console.log("Track Subscribed");
    console.log("Participant:", participant.identity);
    console.log("================================");

    cleanupDeepgramSocket(participant.identity);

    const deepgram = createDeepgramConnection(roomName, participant.identity);
    deepgramSockets.set(participant.identity, deepgram);

    try {
      const audioStream = new AudioStream(track);
      console.log(`Listening to ${participant.identity}...`);

      for await (const frame of audioStream) {
        if (deepgram.readyState === WebSocket.OPEN) {
          deepgram.send(Buffer.from(frame.data.buffer));
        }
      }

      console.log(`Audio stream ended for ${participant.identity}`);

    } catch (err) {
      console.error(`Audio Stream Error (${participant.identity}):`, err);
    } finally {
      if (deepgramSockets.get(participant.identity) === deepgram) {
        cleanupDeepgramSocket(participant.identity);
      }
    }
  });

  room.on("trackUnsubscribed", (track, publication, participant) => {
    if (
      participant.identity === "nexmeet-ai" ||
      track.kind !== TrackKind.KIND_AUDIO 
    ) {
      return;
    }

    console.log(`Audio track removed: ${participant.identity}`);
    cleanupDeepgramSocket(participant.identity);
  });

  room.on("disconnected", () => {
    console.log("AI Agent disconnected.");

    cancelFinalization();

    for (const identity of deepgramSockets.keys()) {
      cleanupDeepgramSocket(identity);
    }

    participants.clear();
    deepgramSockets.clear();

    finalized = true;
  });

  console.log("Connecting to LiveKit...");

  try {
    await room.connect(process.env.LIVEKIT_URL, token);
    console.log("Connected to:", roomName);

    for (const participant of room.remoteParticipants.values()) {
      if (participant.identity === "nexmeet-ai") continue;

      participants.add(participant.identity);
      console.log("Existing Participant:", participant.identity);
    }

    console.log("Current Participants:", [...participants]);
    
    scheduleFinalization();

    return room;
  } catch (err) {
    console.error("Failed to connect to LiveKit:", err);
    throw err;
  }
}

module.exports = {
  connectToRoom,
};