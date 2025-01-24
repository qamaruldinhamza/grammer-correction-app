const express = require("express");
const axios = require("axios");
const checkAuthorization = require("../middlewares/checkAuthorization");

const router = express.Router();

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_URL = "https://api-inference.huggingface.co/models/vennify/t5-base-grammar-correction";

router.post("/", checkAuthorization, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    const response = await axios.post(
      MODEL_URL,
      { inputs: `grammar: ${text}` }, // Ensure the correct prefix for grammar correction
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        },
      }
    );

    const correctedText = response.data[0]?.generated_text || "No corrections made.";
    const highlightedText = highlightIncorrectWords(text, correctedText);

    res.status(200).json({
      correctedText,
      highlightedText,
    });
  } catch (error) {
    console.error("Error during Hugging Face API request:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to check grammar. Please try again." });
  }
});

/**
 * Highlight incorrect words by comparing original and corrected text
 */
const highlightIncorrectWords = (originalText, correctedText) => {
  const originalWords = originalText.match(/\b\w+\b/g) || []; // Extract words, ignoring punctuation
  const correctedWords = correctedText.match(/\b\w+\b/g) || []; // Extract words, ignoring punctuation

  let highlightedText = "";
  let correctedIndex = 0;

  originalWords.forEach((word) => {
    // Check if the word exists in the corrected text and matches
    if (correctedIndex < correctedWords.length && word.toLowerCase() === correctedWords[correctedIndex].toLowerCase()) {
      highlightedText += `${word} `;
      correctedIndex++;
    } else {
      // Highlight the word if it doesn't match
      highlightedText += `<span class="wrong">${word}</span> `;
    }
  });

  return highlightedText.trim(); // Remove trailing space
};

module.exports = router;