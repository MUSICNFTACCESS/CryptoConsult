const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

router.post('/', async (req, res) => {
  const userMessage = req.body.message || '';

  const coinMatch = userMessage.match(/\bprice of (\w+)\b/i);
  let priceText = '';
  if (coinMatch) {
    const coin = coinMatch[1].toLowerCase();
    try {
      const priceRes = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
      const price = priceRes.data[coin]?.usd;
      if (price) {
        priceText = `The current price of ${coin.toUpperCase()} is $${price}`;
      } else {
        priceText = `Sorry, I couldn’t find the price for ${coin.toUpperCase()}.`;
      }
    } catch (err) {
      priceText = `Failed to fetch the price for ${coin.toUpperCase()}.`;
    }
  }

  try {
    const prompt = `${priceText}\n\nUser asked: "${userMessage}"\n\nAnswer as if you're Crimzn.`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ reply: 'Error generating response.' });
  }
});

module.exports = router;
