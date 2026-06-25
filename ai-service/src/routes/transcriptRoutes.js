const express = require("express");

const upload = require("../middleware/upload");

const { transcribeAudio } = require("../controllers/transcriptController");

const router = express.Router();

router.post("/", upload.single("audio"), transcribeAudio);

module.exports = router;
