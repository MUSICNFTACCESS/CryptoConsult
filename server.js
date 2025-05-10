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

// Fetch current crypto prices from CoinGecko
async function getPrices() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await res.json();
    return {
      btc: data.bitcoin?.usd || "N/A",
      eth: data.ethereum?.usd || "N/A",
      sol: data.solana?.usd || "N/A",
    };
  } catch (err) {
    console.error("Price fetch failed:", err.message);
    return { btc: "N/A", eth: "N/A", sol: "N/A" };
  }
}

// CrimznBot chat endpoint
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  const prices = await getPrices();

  const systemPrompt =
    "You are CrimznBot – a GPT-4 crypto and finance assistant created by Crimzn.\n" +
    "Live market prices:\n" +
    "- Bitcoin (BTC): $" + prices.btc + "\n" +
    "- Ethereum (ETH): $" + prices.eth + "\n" +
    "- Solana (SOL): $" + prices.sol + "\n\n" +
    "Always use these prices when asked. You are confident, smart, helpful.\n" +
    "If asked for investment tips, give options based on current market.\n" +
    "If asked for price predictions, reason carefully and explain potential.\n" +
    "DO NOT say 'you don’t have live data.' You DO — it’s above.";

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

// Public API route for frontend price fetch
app.get("/api/prices", async (req, res) => {
  const prices = await getPrices();
  res.json({
    BTC: prices.btc,
    ETH: prices.eth,
    SOL: prices.sol,
  });
});

app.listen(port, () => {
  console.log("CrimznBot server running on port " + port);
});
