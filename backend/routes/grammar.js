const express = require("express");
const OpenAI = require("openai");
const checkAuthorization = require("../middlewares/checkAuthorization");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", checkAuthorization, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `
          Correct the grammar of the following text and return two outputs:
          1. The corrected version of the text.
          2. The original text with incorrect words wrapped in <span class="wrong"> tags for highlighting.

          Here is the text:
          "${text}"
          `,
        },
      ],
    });

    const responseContent = completion.choices[0]?.message?.content.trim();
    if (!responseContent) {
      return res.status(500).json({ error: "Failed to generate a response." });
    }

    // Extract corrected and highlighted text from the AI's response
    const [correctedText, highlightedText] = responseContent.split("\n\n");
    
    res.status(200).json({
      correctedText: correctedText || "No corrections made.",
      highlightedText: highlightedText || "No highlights available.",
    });
  } catch (error) {
    console.error(
      "Error during OpenAI API request:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to check grammar. Please try again." });
  }
});

module.exports = router;