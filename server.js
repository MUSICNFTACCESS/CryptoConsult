const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OpenAI } = require("openai");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Price fetch to enhance prompt (BTC/ETH/SOL context)
async function getPrices() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await res.json();
    return {
      btc: data.bitcoin?.usd || "N/A",
      eth: data.ethereum?.usd || "N/A",
      sol: data.solana?.usd || "N/A"
    };
  } catch (err) {
    console.error("Price fetch error:", err);
    return { btc: "N/A", eth: "N/A", sol: "N/A" };
  }
}

// CrimznBot endpoint
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  const prices = await getPrices();

  const systemPrompt =
    `You are CrimznBot, a GPT-4o-powered crypto assistant built by Crimzn.\n\n` +
    `You work exactly like ChatGPT, but you're focused on helping users understand crypto markets, macro trends, trading setups, and portfolio decisions.\n` +
    `You are up to date — it's May 2025. Do not say "as of 2023" or pretend you're outdated.\n` +
    `If helpful, you may reference current price context like:\n` +
    `- BTC: $${prices.btc}\n` +
    `- ETH: $${prices.eth}\n` +
    `- SOL: $${prices.sol}\n\n` +
    `You speak clearly, confidently, and directly — like a trusted crypto expert.\n` +
    `You are NOT a financial advisor. Your guidance is educational only. Do not hedge or waffle with disclaimers unless asked.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "CrimznBot failed to respond." });
  }
});

// Optional: Public price API for frontend
app.get("/api/prices", async (req, res) => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await response.json();
    res.json({
      BTC: data.bitcoin.usd,
      ETH: data.ethereum.usd,
      SOL: data.solana.usd
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch prices" });
  }
});

app.listen(port, () => {
  console.log("CrimznBot server running on port " + port);
});
