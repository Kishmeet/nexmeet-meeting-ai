const express = require("express");

const {
  createToken,
  createNewRoom,
  getAllRooms,
} = require("../controllers/livekitController");

const router = express.Router();

router.post("/token", createToken);

router.post("/room", createNewRoom);

router.get("/rooms", getAllRooms);

module.exports = router;