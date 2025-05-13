const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

// Supported tokens and their keywords
const tokenMap = {
  bitcoin: ['btc', 'bitcoin'],
  ethereum: ['eth', 'ethereum'],
  solana: ['sol', 'solana'],
  pepe: ['pepe'],
  'ondo-finance': ['ondo']
};

// Fetch price from CoinGecko
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
        priceInfo += `- **${coingeckoId.replace(/-/g, ' ').toUpperCase()}**: $${price.toLocaleString()}\n`;
      }
    }
  }

  try {
    let messages = [{ role: 'user', content: userMessage }];

    if (priceInfo) {
      messages = [
        {
          role: 'system',
          content: `You're CrimznBot, a confident and up-to-date crypto expert. Here's live price data:\n${priceInfo}\nUse this information directly. DO NOT tell users to check CoinGecko or other websites.`
        },
        { role: 'user', content: userMessage }
      ];
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: messages
    });

    reply = completion.data.choices[0].message.content;

    if (priceInfo) {
      reply = `**Live Token Prices:**\n${priceInfo}\n\n${reply}`;
    }

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: 'Error reaching CrimznBot. Please try again later.' });
  }
});

module.exports = router;
