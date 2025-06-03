const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.send("CrimznBot backend is live.");
});

app.get("/price", async (req, res) => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await response.json();
    res.json({
      bitcoin: data.bitcoin.usd,
      ethereum: data.ethereum.usd,
      solana: data.solana.usd,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "No message provided" });

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are CrimznBot, a bold and brilliant crypto consultant, part Raoul Pal, part ChatGPT, part degen — but always sharp, strategic, and professional." },
        { role: "user", content: userMessage },
      ],
      max_tokens: 300,
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err.message);
    res.status(500).json({ error: "Failed to get CrimznBot response" });
  }
});

app.listen(port, () => {
  console.log(`CrimznBot server running on port ${port}`);
});
