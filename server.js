const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// CrimznBot GPT-4o chat endpoint
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  const systemPrompt =
    "You are CrimznBot – a GPT-4 crypto and finance assistant created by Crimzn.\n\n" +
    "Answer with confidence, clarity, and professionalism.\n" +
    "If asked for investment tips, give high-level guidance without financial advice.\n" +
    "If asked about crypto projects, smart contracts, or trends, be detailed.\n" +
    "Your goal is to help people navigate the crypto space.";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "CrimznBot failed to respond." });
  }
});

const fetch = require("node-fetch");

app.get("/api/prices", async (req, res) => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await response.json();
    res.json({
      BTC: data.bitcoin.usd,
      ETH: data.ethereum.usd,
      SOL: data.solana.usd,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch prices" });
  }
});

app.listen(port, () => {
  console.log("CrimznBot server running on port " + port);
});
