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
    console.error("OpenAI error:", err);
    res.status(500).json({ answer: "Sorry, I’m having trouble connecting to the AI." });
  }
});

app.get("/prices", async (req, res) => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await response.json();
    res.json({
      btc: data?.bitcoin?.usd || "Error",
      eth: data?.ethereum?.usd || "Error",
      sol: data?.solana?.usd || "Error",
    });
  } catch (err) {
    console.error("Price fetch error:", err);
    res.status(500).json({ btc: "Error", eth: "Error", sol: "Error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 CrimznBot running at http://localhost:${port}`);
});
