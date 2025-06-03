require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(bodyParser.json());
app.use(express.static("public"));

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
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd");
    const data = await response.json();

    res.json({
      btc: data.bitcoin.usd,
      eth: data.ethereum.usd,
      sol: data.solana.usd,
    });
  } catch (err) {
    console.error("Error fetching prices:", err);
    res.status(500).json({ btc: "Error", eth: "Error", sol: "Error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 CrimznBot running at http://localhost:${port}`);
});
