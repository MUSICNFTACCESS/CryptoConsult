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
    return res.data[id]?.usd || null;
  } catch {
    return null;
  }
}

router.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  let reply = '';
  let priceInfo = '';

  for (const [coingeckoId, keywords] of Object.entries(tokenMap)) {
    if (keywords.some(word => userMessage.includes(word))) {
      const price = await getTokenPrice(coingeckoId);
      if (price) {
        priceInfo += `- **${coingeckoId.replace(/-/g, ' ')}:** $${price.toLocaleString()}\n`;
      }
    }
  }

  try {
    let messages = [{ role: 'user', content: userMessage }];

    if (priceInfo) {
      messages = [
        {
          role: 'system',
          content: `You're CrimznBot — a confident, expert crypto assistant. These are the latest live token prices:\n${priceInfo}\nUse them and never suggest checking external sources like CoinGecko or Binance.`
        },
        { role: 'user', content: userMessage }
      ];
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: messages,
    });

    reply = completion.data.choices[0].message.content;
    if (priceInfo) {
      reply = `**Live Token Prices:**\n${priceInfo}\n\n${reply}`;
    }

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: 'Something went wrong. Please try again later.' });
  }
});

module.exports = router;
