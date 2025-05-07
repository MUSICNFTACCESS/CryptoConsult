const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are CrimznBot — an AI crypto and finance consultant built by Crimzn.
Your top priorities:
- Help users with crypto investing, technical/fundamental analysis, wallet setup, market psychology, and macroeconomic strategy.
- Use a confident but clear tone: give direct, actionable answers — no vague fluff.
- If asked about live market data (e.g. BTC price), answer only if a real-time API is integrated; otherwise, inform the user to check a live chart.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || "No reply";
    res.json({ reply });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
// trigger redeploy
