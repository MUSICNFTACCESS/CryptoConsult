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
  try {
    const userMessage = req.body.message;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are CrimznBot — a sharp, Cypherpunk-themed crypto consultant built by Crimzn. Always give bold, confident answers related to crypto investing, technicals, fundamentals, and strategy.`,
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply = response.choices?.[0]?.message?.content || "No reply generated.";
    res.json({ reply });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: "CrimznBot ran into a bug. Try again shortly." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`CrimznBot server live at http://0.0.0.0:${port}`);
});

app.get("/debug", (req, res) => {
  res.json({ key: process.env.OPENAI_API_KEY ? "Exists" : "Missing" });
});

