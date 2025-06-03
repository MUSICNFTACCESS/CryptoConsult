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

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let totalQuestionsAsked = 0;

// Root route
app.get("/", (req, res) => {
  res.send("CrimznBot backend is live.");
});

// Price endpoint (CoinGecko)
app.get("/price", async (req, res) => {
  const symbol = req.query.symbol || "bitcoin";
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    const data = await response.json();
    res.json({ price: data[symbol]?.usd || "N/A" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

// CrimznBot chat endpoint (POST)
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "No message provided" });

  totalQuestionsAsked++;
  console.log(`Q#${totalQuestionsAsked} → ${userMessage}`);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are CrimznBot, a bold, brilliant crypto strategist with a degen twist. You speak like Raoul Pal, but with edge. If asked about prices, macro, tokens, or cycles — give detailed, confident answers. Keep replies focused, but with swagger.`,
        },
        { role: "user", content: userMessage }
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

// GET fallback to avoid 404 on /chat visits
app.get("/chat", (req, res) => {
  res.status(405).send("Please use POST /chat with a message in the body.");
});

app.listen(port, () => {
  console.log(`CrimznBot server running on port ${port}`);
});
