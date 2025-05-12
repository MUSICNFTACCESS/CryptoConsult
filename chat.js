const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

// CoinGecko token IDs mapped to keywords
const tokenMap = {
  bitcoin: ['btc', 'bitcoin'],
  ethereum: ['eth', 'ethereum'],
  solana: ['sol', 'solana'],
  pepe: ['pepe'],
  'ondo-finance': ['ondo']
};

async function getTokenPrice(id) {
  try {
    const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
    const price = res.data[id]?.usd || null;
    return price;
  } catch (err) {
    console.error(`Error fetching ${id} price:`, err.message);
    return null;
  }
}

router.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  let reply = '';
  let priceInfo = '';

  for (const [coingeckoId, keywords] of Object.entries(tokenMap)) {
    const matched = keywords.some(word => userMessage.includes(word));
    if (matched) {
      const price = await getTokenPrice(coingeckoId);
      if (price) {
        priceInfo += `- **${coingeckoId.replace(/-/g, ' ')}:** $${price.toLocaleString()}\n`;
      } else {
        priceInfo += `- **${coingeckoId}**: Price not found\n`;
      }
    }
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: userMessage }],
    });

    reply = completion.data.choices[0].message.content;
    if (priceInfo) {
      reply = `**Live Token Prices:**\n${priceInfo}\n\n${reply}`;
    }

    res.json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err.message);
    res.status(500).json({ reply: 'Something went wrong. Please try again later.' });
  }
});

module.exports = router;
