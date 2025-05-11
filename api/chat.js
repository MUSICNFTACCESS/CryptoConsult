const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

router.post('/', async (req, res) => {
  const userMessage = req.body.message || '';

  // Extract coin ticker from question if any
  const match = userMessage.match(/price of (\w+)/i);
  let priceNote = '';
  if (match) {
    const coin = match[1].toLowerCase();
    try {
      const resp = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
      const data = await resp.json();
      if (data[coin] && data[coin].usd) {
        priceNote = `\n\nAs of now, ${coin.toUpperCase()} is trading at **$${data[coin].usd}** USD.`;
      }
    } catch (err) {
      console.error('Price fetch error:', err);
    }
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: userMessage }]
    });

    const reply = completion.data.choices[0].message.content + priceNote;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: 'Sorry, an error occurred. Please try again later.' });
  }
});

module.exports = router;
