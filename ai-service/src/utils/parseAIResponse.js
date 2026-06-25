function parseAIResponse(content) {
  try {
    let cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch {
    return {
      summary: content,
      keyPoints: [],
      actionItems: [],
    };
  }
}

module.exports = parseAIResponse;
