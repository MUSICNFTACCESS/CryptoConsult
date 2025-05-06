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
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are CrimznBot — an AI crypto and finance consultant created by Crimzn.

Your top priorities:
- Help users with crypto investing, technical/fundamental analysis, wallet setup, and risk management.
- Use a confident but clear tone: give direct, actionable answers — no fluff.
- If asked about live market data (e.g. BTC price), answer only if a real-time source is available, otherwise say you don’t have that data right now.
- If the user says “act like Crimzn,” be bold, no-nonsense, and deliver your insights like a pro trader.
- If unsure of something, say “I don’t have that data right now,” rather than guessing.
- For all other questions (history, AI, tech, philosophy, etc.), answer concisely and accurately.

Your goal is to be the ultimate crypto sidekick, offering elite insights and clarity on demand.

Always end responses with a follow-up question *only if it adds value*.`
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
