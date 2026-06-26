const { AccessToken } = require("livekit-server-sdk");

async function generateAgentToken(roomName) {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: "nexmeet-ai",
      name: "NexMeet AI",
    }
  );

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: false,
    canSubscribe: true,
  });

  return await at.toJwt();
}

async function generateUserToken(roomName, participantName) {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
      name: participantName,
    }
  );

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  return await at.toJwt();
}

module.exports = {
  generateAgentToken,
  generateUserToken,
};