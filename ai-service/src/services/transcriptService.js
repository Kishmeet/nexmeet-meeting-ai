const fs = require("fs");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateTranscript(filePath) {
  try {
    const transcription =
      await groq.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-large-v3",
      });

    return transcription.text;
  } catch (error) {
    console.error(
      "Transcript Service Error:",
      error
    );

    throw error;
  }
}

module.exports = {
  generateTranscript,
};