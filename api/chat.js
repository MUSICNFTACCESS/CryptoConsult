const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

router.post('/', async (req, res) => {
  const userMessage = req.body.message;

  let priceNote = '';
  const match = userMessage.match(/price of ([a-z0-9]+)/i);
  if (match) {
    const coin = match[1].toLowerCase();
    try {
      const cg = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
      const data = await cg.json();
      const price = data[coin]?.usd;
      if (price) {
        priceNote = `The current price of ${coin.toUpperCase()} is $${price.toFixed(4)}.\n\n`;
      }
    } catch (err) {
      priceNote = '';
    }
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are CrimznBot, a crypto consultant offering real-time answers and strategic insights.' },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7
    });

    const reply = priceNote + completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    res.json({ reply: 'CrimznBot encountered an error fetching the response.' });
  }
});

module.exports = router;
