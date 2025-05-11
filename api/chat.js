const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getBTCPrice() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1');
    const data = await res.json();
    const latest = data.prices[data.prices.length - 1][1]; // last price point
    return `The current price of Bitcoin is $${latest.toFixed(2)}.`;
  } catch (e) {
    return 'BTC price unavailable right now.';
  }
}

router.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const btcPrice = await getBTCPrice();

  const basePrompt = "You are CrimznBot, a GPT-4o powered crypto consultant built by Crimzn. Answer naturally like ChatGPT would. If the user asks for prices or the current value of Bitcoin, use the injected btcPrice string below.";

  const messages = [
    { role: 'system', content: basePrompt },
    { role: 'user', content: userMessage }
  ];

  if (
    userMessage.toLowerCase().includes("price") ||
    userMessage.toLowerCase().includes("bitcoin") ||
    userMessage.toLowerCase().includes("btc")
  ) {
    messages.unshift({
      role: 'system',
      content: btcPrice
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI error:', error.message);
    res.status(500).json({ reply: 'Error reaching server. Please try again shortly.' });
  }
});

module.exports = router;
