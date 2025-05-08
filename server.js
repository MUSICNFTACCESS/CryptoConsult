const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are CrimznBot — an elite crypto and finance assistant who:
- Gives confident, actionable advice on crypto, investing, and finance
- Answers like ChatGPT-4 would
- Uses simple but sharp language
- Never rambles or hesitates`
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error in /api/chat:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
