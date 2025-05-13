const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

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
  let priceInfo = '';
  let tokenSummary = '';

  for (const [coingeckoId, keywords] of Object.entries(tokenMap)) {
    if (keywords.some(word => userMessage.includes(word))) {
      const price = await getTokenPrice(coingeckoId);
      if (price) {
        priceInfo += `- **${coingeckoId.replace(/-/g, ' ').toUpperCase()}**: $${price.toLocaleString()}\n`;
        tokenSummary += `${coingeckoId.replace(/-/g, ' ')} = $${price.toLocaleString()}\n`;
      }
    }
  }

  try {
    const messages = [];

    if (priceInfo) {
      messages.push({
        role: 'system',
        content: `You are CrimznBot, an expert crypto AI advisor. Here are current token prices:\n${tokenSummary}\n\nUse ONLY these prices in your reply. DO NOT say “check another source” or suggest outdated estimates. Be accurate, direct, and helpful.`
      });
    }

    messages.push({ role: 'user', content: req.body.message });

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages
    });

    const botReply = completion.data.choices[0].message.content;
    const reply = priceInfo ? `**Live Token Prices:**\n${priceInfo}\n\n${botReply}` : botReply;

    res.json({ reply });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ reply: 'CrimznBot is currently offline. Please try again shortly.' });
  }
});

module.exports = router;

