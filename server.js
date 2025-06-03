require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const OpenAI = require("openai");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/ask", async (req, res) => {
  const question = req.body.question;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: question }],
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error("Error from OpenAI:", err);
    res.status(500).json({ answer: "Sorry, I’m having trouble connecting to the AI." });
  }
});

app.get("/prices", async (req, res) => {
  try {
    const response = await fetch("https://api.coinstats.app/public/v1/coins?skip=0&limit=3&currency=USD", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    const data = await response.json();

    const prices = {
      btc: data.coins.find(coin => coin.symbol === "BTC")?.price.toFixed(2) || "Error",
      eth: data.coins.find(coin => coin.symbol === "ETH")?.price.toFixed(2) || "Error",
      sol: data.coins.find(coin => coin.symbol === "SOL")?.price.toFixed(2) || "Error"
    };

    res.json(prices);
  } catch (err) {
    console.error("Error fetching CoinStats prices:", err);
    res.status(500).json({ btc: "Error", eth: "Error", sol: "Error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 CrimznBot running at http://localhost:${port}`);
});
