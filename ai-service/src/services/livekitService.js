const {
  AccessToken,
  RoomServiceClient,
} = require("livekit-server-sdk");

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_URL.replace("wss://", "https://"),
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

async function generateToken(
  roomName,
  participantName
) {
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
    }
  );

  token.addGrant({
    roomJoin: true,
    room: roomName,
  });

  return token.toJwt();
}

async function createRoom(roomName) {
  return await roomService.createRoom({
    name: roomName,
  });
}

async function listRooms() {
  return await roomService.listRooms();
}

module.exports = {
  generateToken,
  createRoom,
  listRooms,
};