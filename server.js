const express = require("express");
const app = express();
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

app.get("/prices", async (req, res) => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd", {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"
      }
    });
    const data = await response.json();
    res.json({
      btc: data?.bitcoin?.usd || "Error",
      eth: data?.ethereum?.usd || "Error",
      sol: data?.solana?.usd || "Error"
    });
  } catch (err) {
    res.status(500).json({ error: "CoinGecko fetch failed", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 CrimznBot running on port ${PORT}`);
});

// 🧠 CrimznBot Chat Route (GPT-4o style)
app.use(express.json());
const { Configuration, OpenAIApi } = require("openai");

let openai;
try {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  openai = new OpenAIApi(configuration);
} catch (err) {
  console.error("⚠️ OpenAI config failed:", err.message);
}

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Missing message" });
  }

  if (!openai) {
    return res.json({
      reply: "CrimznBot here. My connection to GPT is down right now. But stay sharp — BTC doesn't sleep.",
    });
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are CrimznBot, a crypto-native strategist. Be sharp, slightly degen, with real market knowledge, alpha, and clear calls. If a user asks about a token, give sentiment, real-time relevance, and concise insight. Never say you’re an AI assistant.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("❌ CrimznBot error:", err.message);
    res.json({
      reply: "Yo, something glitched. CrimznBot will be right back — stay based.",
    });
  }
});
