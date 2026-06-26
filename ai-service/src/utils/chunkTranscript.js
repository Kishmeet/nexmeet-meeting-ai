function chunkTranscript(transcript, maxLines = 50) {
  const lines = transcript
    .split("\n")
    .filter((line) => line.trim() !== "");

  const chunks = [];

  for (let i = 0; i < lines.length; i += maxLines) {
    chunks.push(
      lines.slice(i, i + maxLines).join("\n")
    );
  }

  return chunks;
}

module.exports = chunkTranscript;