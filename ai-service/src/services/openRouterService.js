const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const MODELS = [
  process.env.OPENROUTER_MODEL,
  "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
  "mistralai/mistral-small-3.2-24b-instruct:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "google/gemma-4-31b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "qwen/qwen3-235b-a22b:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "deepseek/deepseek-r1-0528:free",
];

const SYSTEM_PROMPT = `
You are NexMeet AI, an intelligent meeting assistant.

Analyze the meeting transcript and generate a structured meeting summary.

Rules:

- Use ONLY information explicitly mentioned in the transcript.
- Do NOT invent facts.
- Do NOT infer tasks that were not assigned.
- Ignore filler words, repeated phrases, transcription mistakes, and incomplete sentences.
- Merge duplicate ideas.
- Keep the summary concise and professional.
- Generate the response ONLY in English.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use code blocks.
- Do not include explanations.

Return this exact JSON structure:

{
  "summary": "",
  "keyPoints": [],
  "decisions": [],
  "actionItems": [
    {
      "assignee": "",
      "task": "",
      "deadline": ""
    }
  ],
  "openQuestions": []
}

Guidelines:

Summary
- Write 1-3 concise paragraphs.
- Describe the overall discussion.
- Preserve the meeting context.

Key Points
- Include only the most important discussion points.
- Remove duplicates.
- Maximum 10 points.
If the transcript is educational, motivational, a tutorial, podcast, YouTube video, lecture, or monologue, 
return an empty actionItems array unless a speaker explicitly assigns a task.
Action Items
- Include ONLY tasks that participants explicitly agreed to perform.
- Ignore suggestions, examples, hypothetical statements, advertisements, stories, tutorials, or motivational content.
- If no real action items exist, return an empty array.
- If assignee is unknown, use "Unassigned".
- If deadline is unknown, use "".

Output must always be valid JSON.
`;

async function generateCompletion(content) {
  let response;
  let lastError;

  for (const model of MODELS) {
    try {
      console.log(`Trying Model: ${model}`);

      const start = Date.now();

      response = await client.chat.completions.create({
        model,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content,
          },
        ],
      });

      console.log(
        `LLM Time: ${Date.now() - start} ms`
      );

      console.log(
        "Actual Model Used:",
        response.model
      );

      return response.choices[0].message.content;

    } catch (err) {
      console.log(`${model} failed.`);
      lastError = err;
    }
  }

  throw lastError;
}

module.exports = {
  generateCompletion,
};