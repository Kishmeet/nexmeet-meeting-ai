const OpenAI = require("openai");
const parseAIResponse = require("../utils/parseAIResponse");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

async function createSummary(transcript) {
  try {
    console.log("Using Model:", process.env.OPENROUTER_MODEL);

    const start = Date.now();

    const response = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL,

      messages: [
        {
          role: "system",
          content: `
You are an AI Meeting Assistant.
Generate Summary only in English 
Return ONLY valid JSON.
Do not use markdown.
Do not use code blocks.
Do not add explanations.

Format:
{
  "summary": "",
  "keyPoints": [],
  "actionItems": []
}
          `,
        },
        {
          role: "user",
          content: `
Meeting Transcript:

${transcript}
          `,
        },
      ],

      temperature: 0.3,
    });

    const end = Date.now();

    console.log(`LLM Time: ${end - start} ms`);

    console.log("Actual Model Used:", response.model);

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response received");
    }

    console.log("Raw Response:");
    console.log(content);

    return parseAIResponse(content);
  } catch (error) {
    console.error("Summary Service Error:");

    console.error(error);

    throw error;
  }
}

module.exports = {
  createSummary,
};
