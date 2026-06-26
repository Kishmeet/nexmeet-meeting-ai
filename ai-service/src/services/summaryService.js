const parseAIResponse = require("../utils/parseAIResponse");
const chunkTranscript = require("../utils/chunkTranscript");

const { generateCompletion } = require("./openRouterService");

async function summarize(text) {
  return await generateCompletion(`Meeting Transcript:\n\n${text}`);
}

async function createSummary(transcript) {
  try {
    const chunks = chunkTranscript(transcript);

    let rawResponse;

    if (chunks.length === 1) {
      rawResponse = await summarize(transcript);
    } else {
      console.log(`Large meeting detected. ${chunks.length} chunks.`);

      const partialSummaries = [];

      for (let i = 0; i < chunks.length; i++) {
        console.log(`Summarizing chunk ${i + 1}/${chunks.length}`);

        partialSummaries.push(await summarize(chunks[i]));
      }

      rawResponse = await generateCompletion(
        `You are NexMeet AI.
      You are given multiple partial summaries generated from different sections of the same meeting.

      Merge them into ONE final meeting summary.

      Rules:

      - Preserve the overall flow of the meeting.
      - Remove duplicate information.
      - Merge similar key points.
      - Keep only unique action items.
      - Do not invent missing information.
      - Ignore repeated speech caused by transcript chunking.
      - Use only information present in the partial summaries.
      - Return ONLY valid JSON.

      JSON format:

      {
        "summary":"",
        "keyPoints":[],
        "actionItems":[]
      }
If the transcript is educational, motivational, a tutorial, podcast, YouTube video, lecture, or monologue, return an empty actionItems array 
unless a speaker explicitly assigns a task.
      ${partialSummaries.join("\n\n")}`,
      );
    }

    console.log("Raw Response:");
    console.log(rawResponse);

    return parseAIResponse(rawResponse);
  } catch (err) {
    console.error("Summary Service Error:");
    console.error(err);

    throw err;
  }
}

module.exports = {
  createSummary,
};
